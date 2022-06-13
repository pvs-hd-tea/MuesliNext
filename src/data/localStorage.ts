const relevantKeys = ["pages"];

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

  getAllRelevant() {
    const items: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (key && value && relevantKeys.includes(key)) {
          items[key] = value;
        }
      }
    }
    return items;
  }

  exportToJsonFile() {
    const json = JSON.stringify(this.getAllRelevant());
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
  }
}
