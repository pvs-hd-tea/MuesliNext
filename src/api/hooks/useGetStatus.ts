import { fetcher, FetcherOptions } from "../fetcher";
import useSWR from "swr";

export function useGetStatus() {
  const options: FetcherOptions = {
    url: `request/web-app-gen/get-status`,
  };
  const { data, error } = useSWR(options, fetcher);

  return {
    status: data,
    isLoading: !error && !data,
    isError: error,
  };
}
