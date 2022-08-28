import { API } from "@editorjs/editorjs";
import "./DynamicValueWidget.css";

export default class InlineDynamicValueWidget {
  _button: HTMLButtonElement;
  api: API;

  static get isInline() {
    return true;
  }

  constructor({ api }: { api: API }) {
    this.api = api;
    this._button = document.createElement("button");
    this._button.type = "button";
    this._button.textContent = "dV";
    this._button.classList.add(this.api.styles.inlineToolButton);
  }

  render() {
    return this._button;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  surround(range: any) {
    range.deleteContents();
    const text = document.createTextNode(
      '//dynamicValue:{"tableName":"","columnName":"","entryKey":""}:dynamicValue//'
    );
    range.insertNode(text);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  checkState() {}
}
