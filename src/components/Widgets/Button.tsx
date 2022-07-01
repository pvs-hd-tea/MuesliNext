import "./Button.css";
import React from "react";
import LocalDataService from "../../data/services/localDataService";
import { createRoot } from "react-dom/client";

interface ButtonData {
  text: string;
}

export default class Button {
  data: ButtonData;
  wrapper?: HTMLElement;
  readOnly: boolean;

  constructor({ data, readOnly }: { data: ButtonData; readOnly: boolean }) {
    this.readOnly = readOnly;
    this.data = {
      text: data.text !== undefined ? data.text : "",
    };
    this.wrapper = undefined;
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

  render() {
    this.wrapper = document.createElement("div");

    const onDataChange = (newData: ButtonData) => {
      this.data = {
        ...newData,
      };
    };
    const root = createRoot(this.wrapper);
    root.render(
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(blockContent: any) {
    if (!this.readOnly) {
      const textInput = blockContent.querySelector("#textInput");

      return {
        text: textInput.value,
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

class ButtonComponent extends React.Component<Props, ButtonData> {
  state = { ...this.props.initData };

  dataService = LocalDataService.getFromLocalOrNew();

  render() {
    if (this.props.readOnly) {
      return (
        <div className="dynamic-value-component-display">
          <button className="text-white bg-green-500 hover:bg-green-400 shadow-sm hover:shadow-md ml-1 p-1 pl-3 pr-3 rounded-lg">
            {this.state.text == "" ? "Button" : this.state.text}
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
            value={this.state.text}
            onChange={(event) => {
              this.setState(
                Object.assign(this.state, { text: event.target.value })
              );
              this.props.onDataChange(this.state);
            }}
            placeholder="Enter text name..."
          />
          <button className="text-white bg-green-500 hover:bg-green-400 shadow-sm hover:shadow-md ml-1 p-1 pl-3 pr-3 rounded-lg">
            {this.state.text == "" ? "Button" : this.state.text}
          </button>
        </div>
      );
    }
  }
}
