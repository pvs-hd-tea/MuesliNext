// TODO: port to react.
// Until then it will be difficult to use state from react.
import { API, HTMLPasteEvent } from "@editorjs/editorjs";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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

interface ParagraphConfig {
  placeholder: string;
  preserveBlank: boolean;
}

interface ParagraphData {
  text?: string;
}

export default class Paragraph {
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }

  api: API;
  readOnly: boolean;
  _placeholder: string;
  data: ParagraphData;
  _preserveBlank: boolean;
  wrapper?: HTMLElement;

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

    /**
     * Placeholder for paragraph if it is first Block
     * @type {string}
     */
    this._placeholder = config.placeholder
      ? config.placeholder
      : Paragraph.DEFAULT_PLACEHOLDER;

    this._preserveBlank =
      config.preserveBlank !== undefined ? config.preserveBlank : false;

    this.data = data;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    this.wrapper = document.createElement("div");

    const onDataChange = (newData: ParagraphData) => {
      this.data = {
        ...newData,
      };
    };

    ReactDOM.render(
      <ParagraphComponent
        onDataChange={onDataChange}
        initData={this.data}
        readOnly={this.readOnly}
      />,
      this.wrapper
    );

    return this.wrapper;
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

  static get toolbox() {
    return {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 -0.3 9 11.4" width="12" height="14"><path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"/></svg>',
      title: "Text",
    };
  }
}

interface Props {
  onDataChange: (newData: ParagraphData) => void;
  initData: ParagraphData;
  readOnly: boolean;
}

const ParagraphComponent: React.FC<Props> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDataChange,
  initData,
  readOnly,
}) => {
  const [data, setData] = useState(initData);

  function injectDynamicValues(html: string): string {
    let injected = html;
    // replace all Dynamic values
    injected = injected.replaceAll(
      /\$([a-zA-Z]+)\.([a-zA-Z]+)\.([1-9][0-9]*)/gi,
      '<span className="text-red-500">$1 - $2 - $3</span>'
    );

    return injected;
  }

  if (readOnly) {
    return (
      <div
        className="ce-paragraph"
        dangerouslySetInnerHTML={{
          __html: injectDynamicValues(data.text ?? ""),
        }}
      ></div>
    );
  } else {
    return (
      <div
        className="ce-paragraph"
        contentEditable={true}
        dangerouslySetInnerHTML={{
          __html: data.text ?? "",
        }}
      ></div>
    );
  }
};
