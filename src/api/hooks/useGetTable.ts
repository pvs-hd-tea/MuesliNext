import { fetcher, FetcherOptions } from "../fetcher";
import useSWR, { useSWRConfig } from "swr";
import { useListTables } from "./useListTables";

export function useGetTableByID(id: number) {
  const options: FetcherOptions = {
    url: `request/project-management/getTableData`,
    body: {
      sessionID: "Session",
      id,
    },
  };
  const { data, error } = useSWR(options, fetcher, { refreshInterval: 60000 });

  const { mutate, cache } = useSWRConfig();

  return {
    table: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useGetTableByName(name: string) {
  const { tables } = useListTables();
  let tableID = -1;
  if (tables) {
    tableID = tables.findIndex((table: any) => table.name === name);
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

  //let k: keyof typeof table.rows;
  let sum = 0;
  const type_int = table.columns.find((e: any) => e.type === "integer");

  for (let k = 0; k < table.rows.length(); k++) {
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

    return {
      item: sum.toString(),
      isLoading: false,
      isError: false,
    };
  }
}
