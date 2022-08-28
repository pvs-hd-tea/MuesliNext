import { fetcher, FetcherOptions } from "../fetcher";

export function pushTableItemByName(
  name: string,
  column: string,
  key: string,
  value: string
) {
  const bodyContent = {
    table: "p1_" + name,
    condition: ["_id", key],
    update: {
      [column]: value,
    },
  };
  const options: FetcherOptions = {
    url: `request/database/update`,
    body: bodyContent,
  };

  const res = fetcher(options);

  return res;
}
