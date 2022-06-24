export default class InlineDynamicValueWidget {
  _state: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _button: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _api: any;

  static get isInline() {
    return true;
  }
  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
    this._button.classList.toggle(
      this._api.styles.inlineToolButtonActive,
      state
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ api }: any) {
    this._api = api;
    this._button = null;
    this._state = false;
  }

  render() {
    this._button = document.createElement("button");
    this._button.type = "button";
    this._button.textContent = "V";
    this._button.classList.add(this._api.styles.inlineToolButton);

    return this._button;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  surround(range: any) {
    if (this.state) {
      this.unwrap(range);
      return;
    }
    this.wrap(range);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrap(range: any) {
    //const selectedText = range.extractContents();
    const dynamicValue = "$dynamicValue$"; //getDynamicVauleBy...(selectedText)

    range.insertNode(document.createTextNode(dynamicValue));

    this._api.selection.expandToTag(dynamicValue);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unwrap(range: any) {
    const mark = this._api.selection.findParentTag("MARK");

    mark.remove();

    range.insertNode(document.createTextNode(mark.outerText));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkState(selection: any) {
    const text = selection.anchorNode;

    if (!text) {
      return;
    }

    const anchorElement = text instanceof Element ? text : text.parentElement;

    this.state = !!anchorElement.closest("MARK");
  }
}
