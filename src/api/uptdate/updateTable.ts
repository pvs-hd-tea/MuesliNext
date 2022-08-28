import { fetcher, FetcherOptions } from "../fetcher";

export async function pushTableItemByName(
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

  const res = await fetcher(options);

  return res;
}

export async function insertIntoTable(
  name: string,
  values: Record<string, unknown>
) {
  const bodyContent = {
    table: "p1_" + name,
    values,
  };
  const options: FetcherOptions = {
    url: `request/web-app-gen/insert-into-table`,
    body: bodyContent,
  };

  const res = await fetcher(options);

  return res;
}
