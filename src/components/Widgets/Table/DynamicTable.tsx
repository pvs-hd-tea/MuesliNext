import React from "react";
import { useGetTableByName } from "../../../api/hooks";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type HeadCell = {
  name: string;
};

type TableProps = {
  columns: HeadCell[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: Record<string, any>;
};

// export function TableWidget<T>({ heads, rows }: TableProps<T>) {
//export function TableWidget<T>(tableName: string) {
export const TableWidget: React.FC<{ tableName: string }> = ({ tableName }) => {
  const { table, isLoading, isError } = useGetTableByName(tableName);
  if (!isLoading && !isError) {
    const { columns, rows }: TableProps = table;
    const ColumnsKeys = columns.map((item: HeadCell) => item.name);
    return (
      <table className="border-collapse border-t-2 border-l-2 border-gray-200 p-1">
        <tr>
          {columns.map((columns, headKey) => {
            return (
              <th
                key={headKey}
                className="border-r-2 border-b-2 border-gray-200 p-1"
              >
                {columns.name}
              </th>
            );
          })}
        </tr>
        {rows.map(
          (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            row: any,
            rowKey: string
          ) => {
            return (
              <tr key={rowKey}>
                {ColumnsKeys.map((column: string, columnKey) => {
                  return (
                    <td
                      key={columnKey}
                      className="border-r-2 border-b-2 border-gray-200 p-1 bg-white"
                    >
                      {row[column] + ""}
                    </td>
                  );
                })}
              </tr>
            );
          }
        )}
      </table>
    );
  } else {
    return (
      <>
        {isError && <p className="text-red-500">table does not exist</p>}
        {isLoading && <p className="text-blue-500">loading...</p>}
      </>
    );
  }
};
