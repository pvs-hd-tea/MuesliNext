import "./DynamicValueWidget.css";
import React from "react";
import ReactDOM from "react-dom";
import LocalDataService from "../../data/services/localDataService";

export default class DynamicValueWidget {
  data: DynamicValueWidgetData;
  wrapper?: HTMLElement;
  stateSetting: { name: string; icon: string };
  readOnly: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ data, readOnly }: any) {
    this.readOnly = readOnly;
    this.data = {
      displayState: data.displayState !== undefined ? data.displayState : false,
      tableName: data.tableName !== undefined ? data.tableName : "",
      columnName: data.columnName !== undefined ? data.columnName : "",
      entryKey: data.entryKey !== undefined ? data.entryKey : "",
    };
    this.wrapper = undefined;
    this.stateSetting = {
      name: "toggleState",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
    };
  }

  static get toolbox() {
    return {
      title: "DynamicValue",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    this.wrapper = document.createElement("div");

    const onDataChange = (newData: DynamicValueWidgetData) => {
      this.data = {
        ...newData,
      };
    };

    ReactDOM.render(
      <DynamicValueComponent
        onDataChange={onDataChange}
        initData={this.data}
        readOnly={this.readOnly}
      />,
      this.wrapper
    );

    return this.wrapper;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(blockContent: any) {
    if (!this.data.displayState && !this.readOnly) {
      const tableNameInput = blockContent.querySelector("#tableNameInput");
      const columnNameInput = blockContent.querySelector("#columnNameInput");
      const entryKeyInput = blockContent.querySelector("#entryKeyInput");

      return {
        tableName: tableNameInput.value,
        columnName: columnNameInput.value,
        entryKey: entryKeyInput.value,
        displayState: this.data.displayState,
      };
    } else {
      return this.data;
    }
  }
}

interface DynamicValueWidgetData {
  displayState: boolean;
  tableName: string;
  columnName: string;
  entryKey: string;
  value?: string;
}

interface Props {
  onDataChange: (newData: DynamicValueWidgetData) => void;
  initData: DynamicValueWidgetData;
  readOnly: boolean;
}

class DynamicValueComponent extends React.Component<
  Props,
  DynamicValueWidgetData
> {
  state = { ...this.props.initData };

  dataService = LocalDataService.getFromLocalOrNew();

  async fetchDynamicValue() {
    let newVal: string = await this.dataService.fetchTableTableItemByName(
      this.state.tableName,
      this.state.columnName,
      this.state.entryKey
    );
    if (newVal === undefined) {
      newVal = "not found";
    }
    this.setState({ ...this.state, value: newVal });
    // this.state.value = await this.dataService.fetchTableTableItemByName(
    //   "example",
    //   "string",
    //   "2"
    // );
  }

  componentDidMount() {
    this.fetchDynamicValue();
  }

  render() {
    if (this.props.readOnly) {
      //this.fetchDynamicValue();
      return (
        <div className="dynamic-value-component-display">
          {this.state.value}
        </div>
      );
    } else if (this.state.displayState) {
      //this.fetchDynamicValue();
      return (
        <div className="dynamic-value-component-display">
          {this.state.value}
          <input
            type="checkbox"
            className="toggle-switch-checkbox"
            name="toggleSwitch"
            id="toggleSwitch"
            checked={this.state.displayState}
            onChange={(event) =>
              this.setState(
                Object.assign(this.state, {
                  displayState: event.target.checked,
                })
              )
            }
          />
        </div>
      );
    } else {
      return (
        <div className="dynamic-value-component-configure">
          <input
            id="tableNameInput"
            className="text-input"
            type="text"
            value={this.state.tableName}
            onChange={(event) => {
              this.setState(
                Object.assign(this.state, { tableName: event.target.value })
              );
              this.props.onDataChange(this.state);
            }}
            placeholder="Enter Table Name..."
          />
          <input
            id="columnNameInput"
            className="text-input"
            type="text"
            value={this.state.columnName}
            onChange={(event) => {
              this.setState(
                Object.assign(this.state, { columnName: event.target.value })
              );
              this.props.onDataChange(this.state);
            }}
            placeholder="Enter Column Name..."
          />
          <input
            id="entryKeyInput"
            className="text-input"
            type="text"
            value={this.state.entryKey}
            onChange={(event) => {
              this.setState(
                Object.assign(this.state, { entryKey: event.target.value })
              );
              this.props.onDataChange(this.state);
            }}
            placeholder="Enter Key Of Table Entry..."
          />
          <input
            type="checkbox"
            className="toggle-switch-checkbox"
            name="toggleSwitch"
            id="toggleSwitch"
            checked={this.state.displayState}
            onChange={(event) => {
              this.setState(
                Object.assign(this.state, {
                  displayState: event.target.checked,
                })
              );
              this.fetchDynamicValue();
              this.props.onDataChange(this.state);
            }}
          />
        </div>
      );
    }
  }
}
