import fileDialog from "file-dialog";

const relevantKeys = ["pages", "app"];

export class LocalStorageService {
  get(key: string) {
    const item = localStorage.getItem(key);
    // TODO: parse with e.g. Zod
    return item;
  }
  set(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string) {
    localStorage.removeItem(key);
  }

  getConfiguration() {
    const items: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        let relevant = false;
        for (const relevantKey of relevantKeys) {
          if (key.startsWith(relevantKey)) {
            relevant = true;
            break;
          }
        }
        if (key && value && relevant) {
          items[key] = JSON.parse(value);
        }
      }
    }
    const configuration = JSON.stringify(items, null, 2);
    return configuration;
  }

  exportToJsonFile(name: string) {
    const json = this.getConfiguration();
    console.log(json);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.replace(" ", "-")}.json`;
    link.click();
  }

  importFromJsonFile() {
    fileDialog({ multiple: false, accept: "application/json" }).then(
      (files) => {
        const file = files[0];
        file.text().then((raw) => {
          this.save(raw);
        });
      }
    );
  }

  save(raw: string): boolean {
    try {
      const data = JSON.parse(raw);
      for (const key in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(key)) {
          this.set(key, data[key]);
        }
      }
      // TODO: maybe not mix react and plain javascript
      document.location.reload();
    } catch (e) {
      return false;
    }
    return true;
  }
}
