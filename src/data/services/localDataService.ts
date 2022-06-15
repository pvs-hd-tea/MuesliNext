import fileDialog from "file-dialog";
import { Md5 } from "ts-md5";
import { WebAppConfig, defaultConfig, Page, Settings } from "../configuration";
import { Optional } from "../types";
import ParseService from "./parseService";

// singleton
export default class LocalDataService {
  private config: WebAppConfig = defaultConfig;
  private hashCallback?: React.Dispatch<React.SetStateAction<string>>;
  static instance: LocalDataService;

  private constructor(config: WebAppConfig) {
    this.config = config;
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
    return Md5.hashStr(JSON.stringify(this.config));
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
}
