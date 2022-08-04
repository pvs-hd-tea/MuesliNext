// TODO: port to react.
// Until then it will be difficult to use state from react.
import { API, HTMLPasteEvent } from "@editorjs/editorjs";
import localDataService from "../../../data/services/localDataService";
import "./CustomParagraph.css";

/**
 * Base Paragraph Block for the Editor.js.
 * Represents simple paragraph
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */

/**
 * @typedef {object} ParagraphConfig
 * @property {string} placeholder - placeholder for the empty paragraph
 * @property {boolean} preserveBlank - Whether or not to keep blank paragraphs when saving editor data
 */
interface ParagraphConfig {
  placeholder: string;
  preserveBlank: boolean;
}

/**
 * @typedef {Object} ParagraphData
 * @description Tool's input and output data format
 * @property {String} text — Paragraph's content. Can include HTML tags: <a><b><i>
 */
interface ParagraphData {
  text?: string;
}

export default class Paragraph {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  api: API;
  readOnly: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _CSS: any;
  _placeholder: string;
  _data: ParagraphData;
  _element: HTMLElement;
  _preserveBlank: boolean;

  constructor({
    data,
    config,
    api,
    readOnly,
  }: {
    data: ParagraphData;
    config: ParagraphConfig;
    api: API;
    readOnly: boolean;
  }) {
    this.api = api;
    this.readOnly = readOnly;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph",
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
    }

    /**
     * Placeholder for paragraph if it is first Block
     * @type {string}
     */
    this._placeholder = config.placeholder
      ? config.placeholder
      : Paragraph.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = this.drawView();
    this._preserveBlank =
      config.preserveBlank !== undefined ? config.preserveBlank : false;

    this.data = data;
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e: KeyboardEvent) {
    if (e.code !== "Backspace" && e.code !== "Delete") {
      return;
    }

    const { textContent } = this._element;

    if (textContent === "") {
      this._element.innerHTML = "";
    }
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    const div = document.createElement("DIV");

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = "false";
    div.dataset.placeholder = this.api.i18n.t(this._placeholder);

    if (!this.readOnly) {
      div.contentEditable = "true";
      div.addEventListener("keyup", this.onKeyUp);
    }

    return div;
  }

  fetchDynamicValueWithDataText(dataText: string) {
    let text = "";
    try {
      const dataJson = JSON.parse(dataText);
      text = this.fetchDynamicValue(
        dataJson.tableName,
        dataJson.columnName,
        dataJson.entryKey
      );
    } catch (e) {
      text = "//Error//";
    }
    return text;
  }

  fetchDynamicValue(
    tableName: string,
    columnName: string,
    entryKey: string
  ): string {
    const dataService = localDataService.getFromLocalOrNew();
    // TODO: Placeholder
    let newVal = undefined;
    // let newVal: string = dataService.fetchTableItemByNameCached(
    //   tableName,
    //   columnName,
    //   entryKey
    // );
    if (newVal === undefined) {
      newVal = "not found";
    }
    return newVal;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    const finalElement = this._element;
    if (this.readOnly) {
      const startStringOfCommand = "//dynamicValue:";
      const endStringOfCommand = ":dynamicValue//";
      while (finalElement.innerHTML.search(startStringOfCommand) >= 0) {
        const text = finalElement.innerHTML;
        const commandStart = text.search(startStringOfCommand);
        const textWithoutStart = text.substring(
          commandStart + startStringOfCommand.length
        );
        const commandEnd = textWithoutStart.search(endStringOfCommand);
        const dataText = textWithoutStart.substring(0, commandEnd);
        const dynamicValue = this.fetchDynamicValueWithDataText(dataText);
        finalElement.innerHTML = text.replace(
          startStringOfCommand + dataText + endStringOfCommand,
          dynamicValue
        );
      }
      return finalElement;
    }
    return this._element;
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   * @param {ParagraphData} data
   * @public
   */
  merge(data: ParagraphData) {
    let newText = "";
    newText += this.data.text !== undefined ? this.data.text : "";
    newText += data.text !== undefined ? data.text : "";
    this.data = {
      text: newText,
    };
  }

  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData: ParagraphData) {
    if (
      savedData.text !== undefined &&
      savedData.text.trim() === "" &&
      !this._preserveBlank
    ) {
      return false;
    }

    return true;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(toolsContent: HTMLDivElement) {
    if (this.readOnly) {
      return this.data;
    }
    return {
      text: toolsContent.innerHTML,
    };
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event: HTMLPasteEvent) {
    const data = {
      text: event.detail.data.innerHTML,
    };

    this.data = data;
  }

  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: "text", // to convert Paragraph to other block, use 'text' property of saved data
      import: "text", // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      },
    };
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   * @returns {ParagraphData} Current data
   * @private
   */
  get data() {
    const text = this._element.innerHTML;

    this._data.text = text;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {ParagraphData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this._element.innerHTML = this._data.text || "";
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["P"],
    };
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 -0.3 9 11.4" width="12" height="14"><path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"/></svg>',
      title: "Text",
    };
  }
}
