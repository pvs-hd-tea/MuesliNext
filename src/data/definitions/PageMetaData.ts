import { z } from "zod";

export const PageMetaDataSchema = z.object({
  visible: z.boolean(),
});

export type PageMetaData = z.infer<typeof PageMetaDataSchema>;

export const defaultPageMetadata: PageMetaData = {
  visible: true,
};
