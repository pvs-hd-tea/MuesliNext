import "./DynamicTableWidget.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TableWidget } from "./DynamicTable";
import { TableWidgetDropdown } from "./DynamicTableForDropdown";
import LocalDataService from "../../data/services/localDataService";

import { Table } from "../../data/definitions/Tables";

import { Column } from "../../../node_modules/@intutable/database/dist/column";
import { faTurnDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DynamicTableWidgetData {
  tableName: string;
  tableData?: {
    table: Table;
    columns: Column[];
    rows: Record<string, string | number | boolean>;
  };
}

export default class DynamicTableWidgetDropdwon {
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
      title: "DynamicDropdown",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM390.6 246.6l-112 112C272.4 364.9 264.2 368 256 368s-16.38-3.125-22.62-9.375l-112-112c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L256 290.8l89.38-89.38c12.5-12.5 32.75-12.5 45.25 0S403.1 234.1 390.6 246.6z"/></svg>',
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
  const dataService = LocalDataService.getFromLocalOrNew();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      // TODO: can we do better?
      fetchTableByName(initData.tableName);
      setFetched(true);
    }
  });

  async function fetchTableByName(tableName: string) {
    let tableData = undefined;
    try {
      tableData = await dataService.fetchTableByName(tableName);
    } catch (error) {
      tableData = undefined;
    }
    setData({
      ...data,
      tableName,
      tableData,
    });
    //return `${this.state.tableName}`;
  }

  if (readOnly) {
    return (
      <div className="dynamic-table-component-display">
        {data.tableData && (
          <table>
            <TableWidget
              heads={data.tableData.columns}
              rows={data.tableData.rows}
            />
          </table>
        )}
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
          pattern={data.tableData ? ".*" : ""}
          onChange={(event) => {
            setData({ ...data, tableName: event.target.value });
            fetchTableByName(event.target.value);
          }}
          placeholder="Enter Table Column..."
        />
        {data.tableData && (
          <>
            <FontAwesomeIcon icon={faTurnDown} className="ml-3" />
            <table>
              <TableWidgetDropdown
                heads={data.tableData.columns}
                rows={data.tableData.rows}
              />
            </table>
          </>
        )}
        {!data.tableData && (
          <p className="text-red-500">table does not exist</p>
        )}
      </div>
    );
  }
};
