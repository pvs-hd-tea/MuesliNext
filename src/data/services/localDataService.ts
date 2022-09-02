import fileDialog from "file-dialog";
import { Md5 } from "ts-md5";
import { WebAppConfig, defaultConfig, Page, Settings } from "../definitions";
import { Optional } from "../types";
import ParseService from "./parseService";
import { Table } from "../definitions/Tables";

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

/* A singleton that holds the configuration of the app and provides methods to
access and modify it */
export default class LocalDataService {
  private config: WebAppConfig = defaultConfig;
  /* A callback that is used to update the hash of the application. */
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

  /**
   * If there is no instance of LocalDataService, create one and return it. If
   * there is an instance, load the data from local storage and return it
   * @param {WebAppConfig} config - WebAppConfig = defaultConfig
   * @returns A new instance of LocalDataService
   */
  static getFromLocalOrNew(
    config: WebAppConfig = defaultConfig
  ): LocalDataService {
    if (!LocalDataService.instance) {
      LocalDataService.instance = new LocalDataService(config);
    }
    LocalDataService.instance.loadFromLocalStorage();
    return LocalDataService.instance;
  }

  /**
   * It returns a hash of the current state of the application
   * @returns A hash of the config and local objects.
   */
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
  }

  // TODO: move to backend
  getPages(): Page[] {
    return this.config.pages;
  }

  getPageById(id: number): Optional<Page> {
    return new Optional(this.config.pages[id]);
  }

  setPageById(id: number, page: Page) {
    this.config.pages[id] = page;
    this.saveToLocalStorage();
  }

  deletePageById(id: number) {
    this.config.pages.splice(id, 1);
    this.saveToLocalStorage();
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

  /**
   * It converts the config object to a JSON string.
   * @returns A string
   */
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

  /**
   * It opens a file dialog, reads the file, and then calls the
   * `importFromJsonString` function
   */
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
      alert("Invalid Configuration");
      return false;
    }
  }

  /**
   * It takes a string, parses it into a Config object, and if it succeeds, it sets
   * the config property to the parsed Config object
   * @param {string} json - The JSON string to parse.
   * @returns A boolean
   */
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
}
