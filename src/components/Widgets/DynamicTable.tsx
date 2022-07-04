import React from "react";

type HeadCell<DataType> = {
  id: Extract<keyof DataType, string>;
  label: string;
};

type TableProps<DataType> = {
  heads: HeadCell<DataType>[];
  rows: Array<DataType>;
};

export function Table<T>({ heads, rows }: TableProps<T>) {
  const ColumnsKeys = heads.map((item: HeadCell<T>) => item.id);
  return (
    <table>
      <tr>
        {heads.map((head, headKey) => {
          return <th key={headKey}>{head.label}</th>;
        })}
      </tr>
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rows.map((row: any, rowKey) => {
          return (
            <tr key={rowKey}>
              {ColumnsKeys.map((column: keyof T, columnKey) => {
                return <td key={columnKey}>{row[column]}</td>;
              })}
            </tr>
          );
        })
      }
    </table>
  );
}
