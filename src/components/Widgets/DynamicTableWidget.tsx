import "./DynamicValueWidget.css";
import React from "react";
import ReactDOM from "react-dom";
import fs from "fs";
import { Table } from "./DynamicTable-new";
import DynamicTable from "./DynamicTable";

//import data from "../../data/table-data.json";
//const data = JSON.parse(
//    fs.readFileSync("./../data/table-data.json", "utf-8")
//  );

export default class DynamicTableWidget {
  data: DynamicTableWidgetData;
  wrapper?: HTMLElement;
  stateSetting: { name: string; icon: string };
  readOnly: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ data, readOnly }: any) {
    this.readOnly = readOnly;
    this.data = {
      //displayState: data.displayState !== undefined ? data.displayState : false,
      tableName: data.tableName !== undefined ? data.tableName : "",
      //content: data && data.content ? data.content : [],
      //columnName: data.columnName !== undefined ? data.columnName : "",
      //entryKey: data.entryKey !== undefined ? data.entryKey : "",
    };
    this.wrapper = undefined;
    this.stateSetting = {
      name: "toggleState",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
    };
  }

  static get toolbox() {
    return {
      title: "DynamicTable",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    this.wrapper = document.createElement("div");

    const onDataChange = (newData: DynamicTableWidgetData) => {
      this.data = {
        ...newData,
      };
    };

    ReactDOM.render(
      <DynamicTableComponent
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
    if (!this.readOnly) {
      const tableNameInput = blockContent.querySelector("#tableNameInput");

      return {
        tableName: tableNameInput.value,
      };
    } else {
      return this.data;
    }
  }
}

interface Props {
  onDataChange: (newData: DynamicTableWidgetData) => void;
  initData: DynamicTableWidgetData;
  readOnly: boolean;
}

interface DynamicTableWidgetData {
  //displayState: boolean;
  tableName: string;
  //columnName: string;
  //entryKey: string;
}

interface DataEntry {
  heads: string;
  rows: string;
}

const heads = [
  {
    id: "firstname" as const,
    label: "Firstname",
  },
];

const rows = [
  {
    firstname: "John",
  },
  {
    firstname: "Paul",
  },
];

class DynamicTableComponent extends React.Component<
  Props,
  DynamicTableWidgetData
  // DataEntry
> {
  state = this.props.initData;

  fetchDynamicValue() {
    return `${this.state.tableName}`;
  }

  renderElement() {
    if (this.state.tableName == "news")
      return <Table heads={heads} rows={rows} />;
    return null;
  }

  render() {
    if (this.props.readOnly) {
      const text = this.fetchDynamicValue();
      return (
        <div className="dynamic-table-value-component-display">{text}</div>
      );
    } else {
      return (
        <div className="dynamic-table-value-component-configure">
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
            placeholder="Enter Table Column..."
          />
          <table>{this.renderElement()}</table>
        </div>
      );
    }
  }
}
