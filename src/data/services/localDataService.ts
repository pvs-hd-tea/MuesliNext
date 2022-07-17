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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows: Record<string, any>;
    };
  };
  updateCounter: number;
}

// singleton
export default class LocalDataService {
  private config: WebAppConfig = defaultConfig;
  private hashCallback?: React.Dispatch<React.SetStateAction<string>>;
  static instance: LocalDataService;

  private local: LocalState = {
    pageMode: PageMode.Edit,
    cachedTables: {},
    updateCounter: 0,
  };

  private constructor(config: WebAppConfig) {
    this.config = config;
    this.local.activePageUuid = this.getSettings().homePath;
  }

  private forceUpdate() {
    this.local.updateCounter++;
    this.useHashCallback();
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

  pushTableItemByName(
    name: string,
    column: string,
    key: string,
    value: string
  ) {
    const bodyContent = {
      table: "p1_" + name,
      condition: ["_id", key],
      update: {
        [column]: value,
      },
    };
    this.request<Table[]>("database/update", bodyContent).then(() => {
      this.forceUpdate();
    });
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
    return true;
  }
}
