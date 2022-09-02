import React from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type HeadCell<DataType> = {
  name: string;
};

type TableProps<DataType> = {
  heads: HeadCell<DataType>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: Record<string, any>;
};

export function TableWidgetDropdown<T>({ heads, rows }: TableProps<T>) {
  const ColumnsKeys = heads.map((item: HeadCell<T>) => item.name);

  console.log(rows[1]);

  return (
    <table className="border-collapse border-t-2 border-l-2 border-gray-200 p-1">
      <tr>
        {heads.map((head, headKey) => {
          return (
            <th
              key={headKey}
              className="border-r-2 border-b-2 border-gray-200 p-1"
            >
              {head.name}
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
          console.log(rowKey);
          return (
            <tr key={rowKey}>
              {ColumnsKeys.map((column: string, columnKey) => {
                console.log(row[column]);
                if (rowKey == "1") {
                  return (
                    <>
                      <td key={columnKey} className="select">
                        <select name="Dropdown values" id="123">
                          <option value="v-real">{row[column] + ""}</option>
                          <option value="v1">{rows[0][column] + ""}</option>
                        </select>
                      </td>
                    </>
                  );
                } else {
                  return (
                    <>
                      <td key={columnKey} className="select">
                        <select name="Dropdown values" id="123">
                          <option value="v-real">{row[column] + ""}</option>
                          <option value="v0">{rows[1][column] + ""}</option>
                        </select>
                      </td>
                    </>
                  );
                }
              })}
            </tr>
          );
        }
      )}
    </table>
  );
}
