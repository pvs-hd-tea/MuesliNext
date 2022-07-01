import "./Button.css";
import React, { useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

enum buttonType {
  LINK = "link",
  ALERT = "alert",
  SCRIPT = "script",
}

interface ButtonData {
  text: string;
  type: buttonType;

  link: string; // for link button
  message: string; // for alert button
  script: string; // for script button
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
      type: data.type ? data.type : Button.defaultType,
      link: data.link !== undefined ? data.link : "",
      message: data.message !== undefined ? data.message : "",
      script: data.script !== undefined ? data.script : "",
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
    return buttonType.LINK;
  }

  static get buttonTypes() {
    return buttonType;
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

    Object.values(Button.buttonTypes).forEach((type) => {
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
      const text = textInput ? textInput.value : "";

      if (this.data.type === "link") {
        const linkInput = blockContent.querySelector("#linkInput");
        const link = linkInput ? linkInput.value : "";
        return {
          text,
          type: this.data.type,
          link,
        };
      } else if (this.data.type === "alert") {
        const messageInput = blockContent.querySelector("#messageInput");
        const message = messageInput ? messageInput.value : "";
        console.log("save alert stuff");
        return {
          text,
          type: this.data.type,
          message,
        };
      } else if (this.data.type === "script") {
        const scriptInput = blockContent.querySelector("#scriptInput");
        const script = scriptInput ? scriptInput.value : "";
        return {
          text,
          type: this.data.type,
          script,
        };
      }
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
  const [syntaxError, setSyntaxError] = useState(false);
  const [syntaxErrorMessage, setSyntaxErrorMessage] = useState("");

  let btnColor = "";
  let specificFields;
  let onClickListener;
  if (initData.type === buttonType.LINK || !initData.type) {
    btnColor = "bg-blue-500 hover:bg-blue-400";
    specificFields = (
      <input
        id="linkInput"
        className="text-input"
        type="text"
        value={data.link ?? ""}
        onChange={(event) => {
          setData({ ...data, link: event.target.value });
        }}
        placeholder="Enter link"
      />
    );
    onClickListener = () => {
      window.location.assign(data.link.replace(/^www/, "http://www"));
    };
  } else if (data.type === buttonType.ALERT) {
    btnColor = "bg-red-500 hover:bg-red-400";
    specificFields = (
      <input
        id="messageInput"
        className="text-input"
        type="text"
        value={data.message ?? ""}
        onChange={(event) => {
          setData({ ...data, message: event.target.value });
        }}
        placeholder="Enter message"
      />
    );
    onClickListener = () => {
      alert(data.message);
    };
  } else if (data.type === buttonType.SCRIPT) {
    btnColor = "bg-black hover:bg-black-900";
    specificFields = (
      <input
        id="scriptInput"
        className="text-input"
        type="text"
        value={data.script ?? ""}
        onChange={(event) => {
          setData({ ...data, script: event.target.value });
        }}
        placeholder="Enter script"
      />
    );
    onClickListener = () => {
      // TODO: investigate security of using eval here
      // eval is okay here because it is only the frontend (we allow the user to inject scripts into his browser only)
      // or is it not??
      try {
        setSyntaxError(false);
        eval(data.script);
      } catch (e) {
        if (e instanceof SyntaxError) {
          setSyntaxError(true);
          setSyntaxErrorMessage(e.message);
        }
      }
    };
  }

  if (readOnly) {
    return (
      <div className="dynamic-value-component-display">
        <button
          className={`text-white ${btnColor} shadow-sm hover:shadow-md m-1 p-1 pl-3 pr-3 rounded-lg`}
          onClick={onClickListener}
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
        {specificFields}
        <FontAwesomeIcon className="mx-1" icon={faArrowRight} />
        <button
          className={`text-white ${btnColor} shadow-sm hover:shadow-md m-1 p-1 pl-3 pr-3 rounded-lg`}
          onClick={onClickListener}
        >
          {data.text == "" ? "Button" : data.text}
        </button>
        {syntaxError && (
          <div className="text-red-500">
            <p>{syntaxErrorMessage}</p>

            <p>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about eval
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }
};
