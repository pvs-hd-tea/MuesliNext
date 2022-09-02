/* Defining the schema for the page. */
import { z } from "zod";
import { defaultBlocks } from "./Block";
import { EditorDataSchema } from "./EditorData";
import { defaultPageMetadata, PageMetaDataSchema } from "./PageMetaData";
import { defaultSettings } from "./Settings";

export const PageSchema = z.object({
  title: z.string(),
  path: z.string(),
  metadata: PageMetaDataSchema,
  content: EditorDataSchema.optional(),
});

export type Page = z.infer<typeof PageSchema>;

export const defaultPage: Page = {
  title: "Welcome",
  path: defaultSettings.homePath,
  metadata: defaultPageMetadata,
  content: { blocks: defaultBlocks },
};
