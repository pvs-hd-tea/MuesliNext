import { fetcher, FetcherOptions } from "./fetcher";
import useSWR from "swr";

export function useListTables() {
  const options: FetcherOptions = {
    url: `request/project-management/getTablesFromProject`,
    body: {
      sessionID: "Session",
      id: "1",
    },
  };
  const { data, error } = useSWR(options, fetcher);

  return {
    tables: data,
    isLoading: !error && !data,
    isError: error,
  };
}
