import "./DynamicValueWidget.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { useDeriveTableItemByName } from "../../../api/hooks";

export default class DerivedValueWidget {
  data: DerivedValueWidgetData;
  wrapper?: HTMLElement;
  readOnly: boolean;

  constructor({
    data,
    readOnly,
  }: {
    data: DerivedValueWidgetData;
    readOnly: boolean;
  }) {
    this.readOnly = readOnly;
    this.data = {
      tableName: data.tableName !== undefined ? data.tableName : "",
      columnName: data.columnName !== undefined ? data.columnName : "",
      action: data.action !== undefined ? data.action : "",
    };
    this.wrapper = undefined;
  }

  static get toolbox() {
    return {
      title: "DerivedValue",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sum" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M18 16v2a1 1 0 0 1 -1 1h-11l6 -7l-6 -7h11a1 1 0 0 1 1 1v2" /> </svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    this.wrapper = document.createElement("div");

    const onDataChange = (newData: DerivedValueWidgetData) => {
      this.data = {
        ...newData,
      };
    };
    const root = createRoot(this.wrapper);
    root.render(
      <React.StrictMode>
        <DerivedValueComponent
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
      const action = blockContent.querySelector("#entryActionInput");

      return {
        tableName: tableNameInput.value,
        columnName: columnNameInput.value,
        action: action.value,
      };
    }
    return this.data;
  }
}

interface DerivedValueWidgetData {
  tableName: string;
  columnName: string;
  action: string;
  value?: string;
}

interface Props {
  onDataChange: (newData: DerivedValueWidgetData) => void;
  initData: DerivedValueWidgetData;
  readOnly: boolean;
}

const DerivedValueComponent: React.FC<Props> = ({ initData, readOnly }) => {
  const [data, setData] = React.useState(initData);
  const { item, isLoading, isError } = useDeriveTableItemByName(
    data.tableName,
    data.columnName,
    data.action
  );

  if (readOnly) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (isError) {
      return <div>{item ?? "Error"}</div>;
    }
    return <div className="dynamic-value-component-display">{item}</div>;
  } else {
    return (
      <div className="dynamic-value-component-configure">
        <input
          id="tableNameInput"
          className="text-input"
          type="text"
          value={data.tableName}
          onChange={(event) => {
            setData({ ...data, tableName: event.target.value });
          }}
          placeholder="Enter Table Name..."
          aria-label="table-name-input"
        />
        <input
          id="columnNameInput"
          className="text-input"
          type="text"
          value={data.columnName}
          onChange={(event) => {
            setData({ ...data, columnName: event.target.value });
          }}
          placeholder="Enter Column Name..."
          aria-label="column-name-input"
        />
        <input
          id="entryActionInput"
          className="text-input"
          type="text"
          value={data.action}
          onChange={(event) => {
            setData({ ...data, action: event.target.value });
          }}
          placeholder="Enter Action..."
          aria-label="entry-action-input"
        />
      </div>
    );
  }
};

export { DerivedValueWidget, DerivedValueComponent };
export type { DerivedValueWidgetData };
