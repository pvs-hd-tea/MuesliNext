import { fetcher, FetcherOptions } from "../fetcher";
import useSWR from "swr";

/**
 * Hook to list all tables in the project
 * @returns tables: data,
 *   isLoading: !error && !data,
 *   isError: error,
 */
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
