import { z } from "zod";
import { BlockSchema, defaultBlocks } from "./Block";

export const EditorDataSchema = z.object({
  blocks: z.array(BlockSchema),
});

export type EditorData = z.infer<typeof EditorDataSchema>;

export const DefaultEditorData: EditorData = {
  blocks: defaultBlocks,
};
