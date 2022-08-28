import "./DynamicTableWidget.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Table } from "../../../data/definitions/Tables";

import { Column } from "../../../../node_modules/@intutable/database/dist/column";
import { FormField } from "./FormField";

interface DynamicTableWidgetData {
  tableName: string;
  tableData?: {
    table: Table;
    columns: Column[];
    rows: Record<string, string | number | boolean>;
  };
}

export default class DynamicTableWidget {
  data: DynamicTableWidgetData;
  wrapper?: HTMLElement;
  stateSetting: { name: string; icon: string };
  readOnly: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ data, readOnly }: any) {
    this.readOnly = readOnly;
    this.data = {
      tableName: data.tableName !== undefined ? data.tableName : "",
    };
    this.wrapper = undefined;
    this.stateSetting = {
      name: "toggleState",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
    };
  }

  static get toolbox() {
    return {
      title: "Form Field",
      icon: "F",
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

const DynamicTableComponent: React.FC<Props> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDataChange,
  initData,
  readOnly,
}) => {
  const [data, setData] = useState(initData);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, tableName: event.target.value });
    //useGetTableByName(data.tableName);
  };

  if (readOnly) {
    return (
      <div className="dynamic-table-component-configure">
        <h3>Add to table: {data.tableName}</h3>
        <FormField tableName={data.tableName} />
      </div>
    );
  } else {
    return (
      <div className="dynamic-table-component-configure">
        <input
          id="tableNameInput"
          className="text-input"
          type="text"
          value={data.tableName}
          onChange={(event) => {
            handleChange(event);
          }}
          placeholder="Enter table name..."
        />
        <FormField tableName={data.tableName} />
      </div>
    );
  }
};
