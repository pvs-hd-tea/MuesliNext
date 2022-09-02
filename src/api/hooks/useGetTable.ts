import { fetcher, FetcherOptions } from "../fetcher";
import useSWR from "swr";
import { useListTables } from "./useListTables";
import { Table } from "../../data/definitions/Tables";

/**
 * Hook to get a table by id from the server
 * @param {number} id - number - The ID of the table you want to get
 */
export function useGetTableByID(id: number) {
  const options: FetcherOptions = {
    url: `request/project-management/getTableData`,
    body: {
      sessionID: "Session",
      id,
    },
  };
  const { data, error } = useSWR(options, fetcher, { refreshInterval: 60000 });

  return {
    table: data,
    isLoading: !error && !data,
    isError: error,
  };
}

/**
 * It returns a table object, a boolean indicating whether the table is loading,
 * and a boolean indicating whether there was an error
 * @param {string} name - The name of the table you want to get.
 * @returns A table object
 */
export function useGetTableByName(name: string) {
  const { tables } = useListTables();
  let tableID = -1;
  if (tables) {
    tableID = tables.findIndex((table: Table) => table.name === name);
  }
  const { table, isLoading, isError } = useGetTableByID(tableID + 1);
  if (tableID === -1 || !name || isError) {
    return {
      table: null,
      isLoading: false,
      isError: true,
    };
  }
  return {
    table,
    isLoading: isLoading,
    isError: false,
  };
}

/**
 * Hook to get a table item by name, column and key from the server
 * @param {string} name - name - The name of the table you want to get
 * @param {string} column - column - The name of the column you want to get
 * @param {string} key - key - The key of the row you want to get
 */
export function useGetTableItemByName(
  name: string,
  column: string,
  key: string
) {
  const { table, isLoading, isError } = useGetTableByName(name);
  if (!name || !column || !key) {
    return {
      item: null,
      isLoading: false,
      isError: true,
    };
  }

  if (isLoading || isError) {
    return {
      item: null,
      isLoading: isLoading,
      isError: isError,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = table.rows.find((r: any) => r._id + "" === key);
  if (!row) {
    return {
      item: null,
      isLoading: false,
      isError: true,
    };
  }
  const item = row[column];
  return {
    item,
    isLoading: false,
    isError: false,
  };
}

/**
 * Derives a value from a table column
 * @param {string} name - The name of the table you want to get the item from
 * @param {string} column - the column name in the table
 * @param {string} action - The action to perform on the column.
 * @returns The item, isLoading, and isError
 */
export function useDeriveTableItemByName(
  name: string,
  column: string,
  action: string
) {
  const { table, isLoading, isError } = useGetTableByName(name);
  if (!name || !column || !action) {
    return {
      item: "null",
      isLoading: false,
      isError: true,
    };
  }

  if (isLoading || isError) {
    return {
      item: "null",
      isLoading: isLoading,
      isError: isError,
    };
  }

  let sum = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const type_int = table.columns.find((e: any) => e.type === "integer");

  for (let k = 0; k < table.rows.length; k++) {
    const v = table.rows[k];
    if (action == "sum" && type_int?.name == column) {
      sum += v[column];
    } else {
      return {
        item: "The input column should be from an integer type or the action does not exist",
        isLoading: false,
        isError: true,
      };
    }
  }
  return {
    item: sum.toString(),
    isLoading: false,
    isError: false,
  };
}
