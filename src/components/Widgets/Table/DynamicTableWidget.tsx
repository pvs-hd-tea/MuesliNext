import "./DynamicTableWidget.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { TableWidget } from "./TableWidget";
import { Table } from "../../../data/definitions/Tables";

import { Column } from "../../../../node_modules/@intutable/database/dist/column";

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
      title: "DynamicTable",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-table-import" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M4 13.5v-7.5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6m-8 -10h16m-10 -6v11.5m-8 3.5h7m-3 -3l3 3l-3 3" /> </svg>',
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
      <div className="dynamic-table-component-display">
        <table>
          <TableWidget tableName={data.tableName} />
        </table>
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
          placeholder="Enter Table Column..."
        />
        <table>
          <TableWidget tableName={data.tableName} />
        </table>
      </div>
    );
  }
};
