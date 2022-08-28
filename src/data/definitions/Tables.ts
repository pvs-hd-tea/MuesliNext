import { Column } from "@intutable/database/dist/column";
import { z } from "zod";

export const TableSchema = z.object({
  key: z.string(),
  name: z.string(),
  id: z.number().optional(),
  // ownerId: "1", //<- TODO: for user-authentication plugin
  // TODO: much more
});

export type Table = z.infer<typeof TableSchema>;

export const defaultTable: Table = {
  key: "example",
  name: "example",
};

export type tableData = {
  table: Table;
  columns: Column[];
  rows: Record<string, string | number | boolean>;
};
