import React from "react";

type HeadCell<DataType> = {
  id: string;
  name: string;
};

type TableProps<DataType> = {
  heads: HeadCell<DataType>[];
  rows: Array<DataType>;
};

export function Table<T>({ heads, rows }: TableProps<T>) {
  const ColumnsKeys = heads.map((item: HeadCell<T>) => item.name);

  return (
    <table className="">
      <tr>
        {heads.map((head, headKey) => {
          return <th key={headKey}>{head.name}</th>;
        })}
      </tr>
      {rows.map((row: any, rowKey) => {
        return (
          <tr key={rowKey}>
            {ColumnsKeys.map((column: string, columnKey) => {
              return <td key={columnKey}>{row[column]}</td>;
            })}
          </tr>
        );
      })}
    </table>
  );
}
