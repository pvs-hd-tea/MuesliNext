import { z } from "zod";

export const TableSchema = z.object({
  key: z.string(),
  name: z.string(),
  // ownerId: "1", //<- TODO: for user-authentication plugin
  // TODO: much more
});

export type Table = z.infer<typeof TableSchema>;

export const defaultTable: Table = {
  key: "example",
  name: "example",
};
