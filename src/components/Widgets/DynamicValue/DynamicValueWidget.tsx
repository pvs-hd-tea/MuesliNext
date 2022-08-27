import "./DynamicValueWidget.css";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useGetTableItemByName } from "../../../api/hooks/useGetTable";

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

const DynamicValueComponent: React.FC<Props> = ({
  onDataChange,
  initData,
  readOnly,
}: Props) => {
  const [data, setData] = useState(initData);
  const { item, isLoading, isError } = useGetTableItemByName(
    data.tableName,
    data.columnName,
    data.entryKey
  );

  if (readOnly) {
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

            onDataChange(data);
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
            onDataChange(data);
          }}
          placeholder="Enter Column Name..."
          aria-label="column-name-input"
        />
        <input
          id="entryKeyInput"
          className="text-input"
          type="text"
          value={data.entryKey}
          onChange={(event) => {
            setData({ ...data, entryKey: event.target.value });
            onDataChange(data);
          }}
          placeholder="Enter Key Of Table Entry..."
          aria-label="entry-key-input"
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error...</div>}
        {item && <div>{item}</div>}
      </div>
    );
  }
};

export { DynamicValueWidget, DynamicValueComponent };
export type { DynamicValueWidgetData };
