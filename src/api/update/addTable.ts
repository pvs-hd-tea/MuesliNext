import { fetcher, FetcherOptions } from "../fetcher";
import { ColumnOption, ColumnType } from "@intutable/database/dist/column";
import { TableSpec } from "../../backend/web-app-gen-plugin/src/example/schema";
import { z } from "zod";

/* A schema for the table. */
export const TableSchema = z.object({
  table: z.object({
    id: z.number(),
    name: z.string(),
    key: z.string(),
  }),
  columns: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      type: z.string(),
      attributes: z.any(),
    })
  ),
  rows: z.array(z.any()),
});

/**
 * It creates a table in the database
 * @param {TableSpec} tableSpec - TableSpec
 * @returns The id, name and key of the table that was created.
 */
export async function createTable(tableSpec: TableSpec) {
  const bodyContent = {
    sessionID: "Session",
    userId: 1,
    projectId: 1,
    name: tableSpec.name,
    columns: [],
  };
  const options: FetcherOptions = {
    url: `request/project-management/createTableInProject`,
    body: bodyContent,
    schema: z.number(),
  };

  const res = await fetcher(options);

  return res;
}

/* Definition for a default table. */
const defaultTableSpec: TableSpec = {
  name: "defaultTable",
  columns: [
    {
      baseColumn: {
        name: "_id",
        type: ColumnType.increments,
        options: [ColumnOption.primary],
      },
      attributes: {
        displayName: "ID",
        _cellContentType: "number",
      },
    },
    {
      baseColumn: {
        name: "number",
        type: ColumnType.integer,
      },
      attributes: {
        displayName: "Number",
        userPrimary: 1,
        _cellContentType: "number",
      },
    },
    {
      baseColumn: {
        name: "string",
        type: ColumnType.string,
      },
      attributes: {
        displayName: "String",
        _cellContentType: "string",
      },
    },
    {
      baseColumn: {
        name: "boolean",
        type: ColumnType.boolean,
      },
      attributes: {
        displayName: "Boolean",
        _cellContentType: "boolean",
      },
    },
  ],
  joins: [],
};

/**
 * Create a table with the given name and the default table spec.
 * @param {string} name - The name of the table.
 * @returns The id, name and key of the table that was created.
 */
export async function createDefaultTable(name: string) {
  const tableSpec: TableSpec = {
    ...defaultTableSpec,
    name,
  };

  return await createTable(tableSpec);
}
