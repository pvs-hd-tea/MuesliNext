import "./Button.css";
import React, { useEffect, useState } from "react";
import LocalDataService from "../../data/services/localDataService";
import { createRoot, Root } from "react-dom/client";

interface ButtonData {
  text: string;
  type: string; // TODO: make enum
}

export default class Button {
  data: ButtonData;
  wrapper: HTMLElement;
  root: Root;
  readOnly: boolean;
  api: EditorJS.API;
  container?: HTMLElement;

  constructor({
    data,
    readOnly,
    api,
  }: {
    data: ButtonData;
    readOnly: boolean;
    api: EditorJS.API;
  }) {
    this.readOnly = readOnly;
    this.data = {
      text: data.text !== undefined ? data.text : "",
      type: Button.buttonTypes.includes(data.type)
        ? data.type
        : Button.defaultType,
    };

    this.api = api;
    this.container = undefined;

    this.wrapper = document.createElement("div");
    this.root = createRoot(this.wrapper);
  }

  static get toolbox() {
    return {
      title: "Button",
      icon: "B",
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get defaultType() {
    return "link";
  }

  static get buttonTypes() {
    return ["link", "alert"];
  }

  render() {
    const onDataChange = (newData: ButtonData) => {
      this.data = {
        ...newData,
      };
    };

    this.root.render(
      <React.StrictMode>
        <ButtonComponent
          onDataChange={onDataChange}
          initData={this.data}
          readOnly={this.readOnly}
        />
      </React.StrictMode>
    );

    return this.wrapper;
  }

  /**
   * Alert Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: "cdx-alert",
      wrapperForType: (type: string) => `cdx-button-${type}`,
      message: "cdx-alert__message",
    };
  }

  /**
   * Create Block's settings block
   *
   * @returns {HTMLElement}
   */
  renderSettings() {
    const settingsContainer = this._make("div");

    Button.buttonTypes.forEach((type) => {
      const settingsButton = this._make(
        "div",
        [
          this.CSS.settingsButton,
          this.CSS.wrapper,
          this.CSS.wrapperForType(type),
        ],
        {
          innerHTML: "B",
        }
      );

      if (this.data.type === type) {
        // Highlight current type button
        settingsButton.classList.add(this.CSS.settingsButtonActive);
      }

      // Set up click handler
      settingsButton.addEventListener("click", () => {
        this.data.type = type;
        this.render();
        // Un-highlight previous type button
        settingsContainer
          .querySelectorAll(`.${this.CSS.settingsButton}`)
          .forEach((button: any) =>
            button.classList.remove(this.CSS.settingsButtonActive)
          );

        // and highlight the clicked type button
        settingsButton.classList.add(this.CSS.settingsButtonActive);
      });

      settingsContainer.appendChild(settingsButton);
    });

    return settingsContainer;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @returns {Element}
   * @private
   */
  _make(tagName: any, classNames: any = undefined, attributes: any = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(blockContent: any) {
    if (!this.readOnly) {
      const textInput = blockContent.querySelector("#textInput");

      return {
        text: textInput.value,
        type: this.data.type,
      };
    }
    return this.data;
  }
}

interface Props {
  onDataChange: (newData: ButtonData) => void;
  initData: ButtonData;
  readOnly: boolean;
}

const ButtonComponent: React.FC<Props> = ({
  onDataChange,
  initData,
  readOnly,
}) => {
  const [data, setData] = useState(initData);

  let btnColor = "";
  if (initData.type === "link") {
    btnColor = "bg-blue-500 hover:bg-blue-400";
  } else if (data.type === "alert") {
    btnColor = "bg-red-500 hover:bg-red-400";
  }

  if (readOnly) {
    return (
      <div className="dynamic-value-component-display">
        <button
          className={`text-white ${btnColor} shadow-sm hover:shadow-md ml-1 p-1 pl-3 pr-3 rounded-lg`}
        >
          {data.text == "" ? "Button" : data.text}
        </button>
      </div>
    );
  } else {
    return (
      <div className="dynamic-value-component-configure">
        <input
          id="textInput"
          className="text-input"
          type="text"
          value={data.text}
          onChange={(event) => {
            setData({ ...data, text: event.target.value });
          }}
          placeholder="Enter text name..."
        />
        <button
          className={`text-white ${btnColor} shadow-sm hover:shadow-md ml-1 p-1 pl-3 pr-3 rounded-lg`}
        >
          {data.text == "" ? "Button" : data.text}
        </button>
      </div>
    );
  }
};
