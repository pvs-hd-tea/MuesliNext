import fileDialog from "file-dialog";
import { Md5 } from "ts-md5";
import WebAppConfig, {
  defaultConfig,
  EditorSettings,
  Page,
  Settings,
} from "../configuration";
import { Optional } from "../types";

// singleton
export default class LocalDataService {
  private config: WebAppConfig = defaultConfig;
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
  }

  saveToLocalStorage() {
    localStorage.setItem("config", JSON.stringify(this.config));
  }

  getSettings(): Settings {
    return this.config.settings;
  }

  setSettings(settings: Settings) {
    this.config.settings = settings;
    this.saveToLocalStorage();
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
  }

  getPageByKey(key: string): Optional<Page> {
    return new Optional(this.config.pages.find((page) => page.path === key));
  }

  setPageByKey(key: string, page: Page) {
    const index = this.config.pages.findIndex((page) => page.path === key);
    if (index === -1) {
      this.config.pages.push(page);
    }
    this.config.pages[index] = page;
    this.saveToLocalStorage();
  }

  getEditorSettings(): Optional<EditorSettings> {
    return new Optional(this.config.editorSettings);
  }

  setEditorSettings(settings: EditorSettings) {
    this.config.editorSettings = settings;
    this.saveToLocalStorage();
  }

  toJsonString(): string {
    return JSON.stringify(this.config, null, 2);
  }

  exportToJsonFile() {
    const json = this.toJsonString();
    console.log(json);
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
      return false;
    }
  }

  // TODO: parse with e.g. Zod
  parse(json: string): boolean {
    try {
      this.config = JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }
}
