import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { FetcherOptions } from "../../../api/fetcher";
import { useGetTableByName, useListTables } from "../../../api/hooks";
import { insertIntoTable } from "../../../api/uptdate";
import { Table } from "../../../data/definitions/Tables";
import { hashStable } from "../../../util/hash";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type HeadCell = {
  name: string;
};

type TableProps = {
  columns: HeadCell[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: Record<string, any>;
};

export const FormField: React.FC<{ tableName: string }> = ({ tableName }) => {
  const { table, isLoading, isError } = useGetTableByName(tableName);
  // we need this to know the current table in order refresh it (mutate request)
  const { tables } = useListTables();
  const { mutate } = useSWRConfig();
  const [data, setData] = useState(
    new Array<string>(table ? table.columns.length : 0)
  );

  function submitValues() {
    // turn data into the type Record<string, unknown>
    const dataObject: Record<string, unknown> = {};
    for (let i = 0; i < table.columns.length; i++) {
      dataObject[table.columns[i].name] = data[i];
    }
    insertIntoTable(tableName, dataObject)
      .then(() => {
        // reset data
        setData(Array<string>(table.columns.length));

        let tableId = -1;
        if (tables) {
          tableId = tables.findIndex(
            (table: Table) => table.name === tableName
          );
          tableId += 1;
        }
        const options: FetcherOptions = {
          url: `request/project-management/getTableData`,
          body: {
            sessionID: "Session",
            id: tableId,
          },
        };
        mutate(hashStable(options));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!isLoading && !isError) {
    const { columns }: TableProps = table;
    return (
      <>
        <table className="table-auto">
          {columns.map((columns, headKey) => {
            if (columns.name.startsWith("_")) {
              return null;
            }
            return (
              <tr key={headKey}>
                <td
                // className="border-r-2 border-b-2 border-gray-200 p-1"
                >
                  {columns.name}
                </td>
                <td>
                  <input
                    className="text-input"
                    size={400}
                    type="text"
                    value={data[headKey]}
                    onChange={(event) => {
                      setData({ ...data, [headKey]: event.target.value });
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <button
          className={`text-white bg-green-500 shadow-sm hover:shadow-md m-1 p-2 pl-3 pr-3 rounded-lg`}
          onClick={submitValues}
        >
          Submit
        </button>
      </>
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
