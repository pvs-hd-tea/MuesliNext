import { fetcher, FetcherOptions } from "../fetcher";

/**
 * Updates a value in the table.
 * @param {string} name - the name of the table
 * @param {string} column - the column you want to update
 * @param {string} key - the key of the item you want to update
 * @param {string} value - the value you want to push to the database
 * @returns The response from the server.
 */
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

/**
 * It takes a table name and a record of values, and inserts the values into the
 * table
 * @param {string} name - The name of the table you want to insert into.
 * @param values - Record<string, unknown>
 * @returns The response from the server.
 */
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
