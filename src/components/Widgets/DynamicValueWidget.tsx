import "./DynamicValueWidget.css";
import React from "react";
import LocalDataService from "../../data/services/localDataService";
import { createRoot } from "react-dom/client";

export default class DynamicValueWidget {
  data: DynamicValueWidgetData;
  wrapper?: HTMLElement;
  readOnly: boolean;

  constructor({
    data,
    readOnly,
  }: {
    data: DynamicValueWidgetData;
    readOnly: boolean;
  }) {
    this.readOnly = readOnly;
    this.data = {
      tableName: data.tableName !== undefined ? data.tableName : "",
      columnName: data.columnName !== undefined ? data.columnName : "",
      entryKey: data.entryKey !== undefined ? data.entryKey : "",
    };
    this.wrapper = undefined;
  }

  static get toolbox() {
    return {
      title: "DynamicValue",
      icon: "dV",
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
    const root = createRoot(this.wrapper);
    root.render(
      <React.StrictMode>
        <DynamicValueComponent
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
      const tableNameInput = blockContent.querySelector("#tableNameInput");
      const columnNameInput = blockContent.querySelector("#columnNameInput");
      const entryKeyInput = blockContent.querySelector("#entryKeyInput");

      return {
        tableName: tableNameInput.value,
        columnName: columnNameInput.value,
        entryKey: entryKeyInput.value,
      };
    }
    return this.data;
  }
}

interface DynamicValueWidgetData {
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
    this.dataService
      .fetchTableTableItemByName(
        this.state.tableName,
        this.state.columnName,
        this.state.entryKey
      )
      .then((newVal) => {
        if (newVal === undefined) {
          newVal = "not found";
        }
        this.setState({ ...this.state, value: newVal });
      })
      .catch(() => {
        this.setState({ ...this.state, value: "error fetching data" });
        console.log("error fetching data");
      });
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
      return (
        <div className="dynamic-value-component-display">
          {this.state.value}
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
            aria-label="table-name-input"
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
            aria-label="column-name-input"
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
            aria-label="entry-key-input"
          />
        </div>
      );
    }
  }
}

export { DynamicValueWidget, DynamicValueComponent };
export type { DynamicValueWidgetData };
