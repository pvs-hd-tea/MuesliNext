import fileDialog from "file-dialog";
import { Md5 } from "ts-md5";
import { WebAppConfig, defaultConfig, Page, Settings } from "../definitions";
import { Optional } from "../types";
import ParseService from "./parseService";
import axios from "axios";
import { Table, TableSchema } from "../definitions/Tables";

import { Column } from "../../../node_modules/@intutable/database/dist/column";

export enum PageMode {
  Edit,
  Preview,
}
export interface LocalState {
  pageMode: PageMode;
  activePageUuid?: string;
  cachedTables: {
    [name: string]: {
      table: Table;
      columns: Column[];
      rows: Record<string, any>;
    };
  };
}

// singleton
export default class LocalDataService {
  private config: WebAppConfig = defaultConfig;
  private hashCallback?: React.Dispatch<React.SetStateAction<string>>;
  static instance: LocalDataService;

  private local: LocalState = {
    pageMode: PageMode.Edit,
    cachedTables: {},
  };

  private constructor(config: WebAppConfig) {
    this.config = config;
    this.local.activePageUuid = this.getSettings().homePath;
  }

  static getFromLocalOrNew(
    config: WebAppConfig = defaultConfig
  ): LocalDataService {
    if (!LocalDataService.instance) {
      LocalDataService.instance = new LocalDataService(config);
    }
    LocalDataService.instance.loadFromLocalStorage();
    return LocalDataService.instance;
  }

  toHash(): string {
    return Md5.hashStr(JSON.stringify([this.config, this.local]));
  }

  loadFromLocalStorage(): void {
    const json = localStorage.getItem("config");
    if (json) {
      this.config = JSON.parse(json);
    }
  }

  resetToDefault(defaultConf: WebAppConfig = defaultConfig): void {
    this.config = defaultConf;
    this.saveToLocalStorage();
    this.useHashCallback();
  }

  saveToLocalStorage() {
    localStorage.setItem("config", JSON.stringify(this.config));
    this.useHashCallback();
  }

  getSettings(): Settings {
    return this.config.settings;
  }

  setSettings(settings: Settings) {
    this.config.settings = settings;
    this.saveToLocalStorage();
    this.useHashCallback();
  }

  getPages(): Page[] {
    return this.config.pages;
  }

  getPageById(id: number): Optional<Page> {
    return new Optional(this.config.pages[id]);
  }

  setPageById(id: number, page: Page) {
    this.config.pages[id] = page;
    this.saveToLocalStorage();
    this.useHashCallback();
  }

  deletePageById(id: number) {
    this.config.pages.splice(id, 1);
    this.saveToLocalStorage();
    this.useHashCallback();
  }

  getPageByKey(key: string): Optional<Page> {
    return new Optional(this.config.pages.find((page) => page.path === key));
  }

  setPageByKey(key: string, newOrUpdatedPage: Page) {
    const index = this.config.pages.findIndex((page) => page.path === key);
    if (index === -1) {
      // page is new
      this.config.pages.push(newOrUpdatedPage);
    }
    this.setPageById(index, newOrUpdatedPage);
  }

  deletePageByKey(key: string) {
    const index = this.config.pages.findIndex((page) => page.path === key);
    if (index !== -1) {
      this.deletePageById(index);
    }
  }

  getTables() {
    return this.config.tables;
  }

  getTableById(id: number): Optional<Table> {
    return new Optional(this.config.tables[id]);
  }

  setTableById(id: number, table: Table) {
    this.config.tables[id] = table;
    this.saveToLocalStorage();
    this.useHashCallback();
  }

  deleteTableById(id: number) {
    this.config.tables.splice(id, 1);
    this.saveToLocalStorage();
    this.useHashCallback();
  }

  getTableByKey(key: string): Optional<Table> {
    return new Optional(this.config.tables.find((table) => table.key === key));
  }

  setTableByKey(key: string, newOrUpdatedTable: Table) {
    const index = this.config.tables.findIndex((table) => table.key === key);
    if (index === -1) {
      // page is new
      this.config.tables.push(newOrUpdatedTable);
    }
    this.setTableById(index, newOrUpdatedTable);
  }

  deleteTableByKey(key: string) {
    const index = this.config.tables.findIndex((table) => table.key === key);
    if (index !== -1) {
      this.deleteTableById(index);
    }
  }

  toJsonString(): string {
    return ParseService.getInstance().parseConfigToString(this.config);
  }

  exportToJsonFile() {
    const json = this.toJsonString();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.config.settings.name.replace(" ", "-")}.json`;
    link.click();
  }

  importFromJsonFile() {
    fileDialog({ multiple: false, accept: "application/json" }).then(
      (files) => {
        const file = files[0];
        file.text().then((raw) => {
          this.importFromJsonString(raw);
        });
      }
    );
    this.saveToLocalStorage();
  }

  importFromJsonString(raw: string): boolean {
    const success = this.parse(raw);
    if (success) {
      this.saveToLocalStorage();
      return true;
    } else {
      // TODO: move somewhere else
      alert("Invalid Configuration");
      return false;
    }
  }

  parse(json: string): boolean {
    const configOpt = ParseService.getInstance().parseConfigFromString(json);
    if (configOpt.isUndefined()) {
      return false;
    } else {
      this.config = configOpt.unwrap();
      return true;
    }
  }

  setHashCallback(hash: React.Dispatch<React.SetStateAction<string>>) {
    this.hashCallback = hash;
  }

  useHashCallback() {
    if (this.hashCallback) {
      this.hashCallback(this.toHash());
    }
  }

  setLocalState = (state: LocalState): void => {
    this.local = state;
    this.useHashCallback();
  };

  getLocalState = () => {
    return this.local;
  };

  /*------------------------------------------------- Backend functions ---*/

  async request<T>(url: string, data: any): Promise<T> {
    const headersList = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const bodyContent = JSON.stringify(data);

    const reqOptions = {
      url: `${this.config.settings.backendUrl}/request/${url}`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    const request = await axios.request(reqOptions);
    // TODO: parsing
    return request.data;
  }

  async fetchTables(): Promise<Table[]> {
    const bodyContent = {
      sessionID: "Session",
      id: 1,
    };
    const tables = await this.request<Table[]>(
      "project-management/getTablesFromProject",
      bodyContent
    );
    return tables;
  }

  async fetchTableById(id: number): Promise<{
    table: Table;
    columns: Column[];
    rows: Record<string, string>;
  }> {
    const bodyContent = {
      sessionID: "Session",
      id: id,
    };
    const table = await this.request<{
      table: Table;
      columns: Column[];
      rows: Record<string, any>;
    }>("project-management/getTableData", bodyContent);
    return table;
  }

  async fetchTableByName(name: string): Promise<{
    table: Table;
    columns: Column[];
    rows: Record<string, any>;
  }> {
    const tables = await this.fetchTables();
    const tableID = tables.findIndex((table) => table.name === name);
    if (tableID === -1) {
      throw new Error("Table not found");
    }
    //console.log("Table ID: " + tableID);
    const table = await this.fetchTableById(tableID + 1);
    const cachedTables = this.getLocalState().cachedTables;
    cachedTables[name] = table;
    console.log("cached table");
    this.setLocalState({ ...this.getLocalState(), cachedTables: cachedTables });
    return table;
  }

  async fetchTableTableItemByName(
    name: string,
    column: string,
    key: string
  ): Promise<string> {
    // "rows": [
    //   {
    //     "_id": 1,
    //     "number": 1,
    //     "string": "foo",
    //     "boolean": true
    //   },
    //   {
    //     "_id": 2,
    //     "number": 42,
    //     "string": "bar",
    //     "boolean": false
    //   }
    // ]
    const table = await this.fetchTableByName(name);
    //console.log(table);
    //console.log(`key is ${key}`);
    const row = table.rows.find((r: { _id: string }) => r._id + "" === key);
    //console.log(row);
    if (!row) {
      return "row not found";
    }
    const item = row[column];
    //console.log(item);
    return item;
  }

  // TODO: replace by SWR
  fetchTableItemByNameCached(name: string, column: string, key: string) {
    // timout is to repreduce not updated on loaded bug
    //setTimeout(() => {
    this.fetchTableTableItemByName(name, column, key); // stage next fetch
    //}, 1000);
    const cachedTables = this.getLocalState().cachedTables;
    if (cachedTables[name]) {
      const table = cachedTables[name];
      const row = table.rows.find((r: { _id: string }) => r._id + "" === key);
      if (!row) {
        return "row not found";
      }
      const item = row[column];
      return item;
    } else {
      console.log("fetching table");
      return "fetching table";
    }
  }

  // TODO: make more efficient
  async isConnected(): Promise<boolean> {
    const tables = await this.fetchTables();
    const parsed = TableSchema.safeParse(tables[0]);
    return parsed.success;
  }
}
