import "./Button.css";
import React, { useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import localDataService from "../../../data/services/localDataService";
import { ButtonComponent } from "./ButtonComponent";
import { ButtonData, buttonType } from "./ButtonTypes";

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
      submit_targets:
        data.submit_targets !== undefined ? data.submit_targets : ["", ""],
      submit_regex:
        data.submit_regex !== undefined ? data.submit_regex : ["", ""],
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
   * button Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: "cdx-button",
      wrapperForType: (type: string) => `cdx-button-${type}`,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } else if (this.data.type === "submit") {
        const submitTargetInputs =
          blockContent.querySelectorAll("#submitTargetInput");
        const submitTargets: string[] = [submitTargetInputs.length];

        submitTargetInputs.forEach((input: any, index: number) => {
          submitTargets[index] = input ? input.value : "";
        });
        submitTargets.pop();

        const submitRegexInputs =
          blockContent.querySelectorAll("#submitRegexInput");
        const submitRegexes: string[] = [submitRegexInputs.length];

        submitRegexInputs.forEach((input: any, index: number) => {
          submitRegexes[index] = input ? input.value : "";
        });
        submitRegexes.pop();
        return {
          text,
          type: this.data.type,
          submit_targets: submitTargets,
          submit_regex: submitRegexes,
        };
      }
    }
    return this.data;
  }
}
