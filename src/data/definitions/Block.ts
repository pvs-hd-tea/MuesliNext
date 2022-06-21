import { z } from "zod";

export const BlockSchema = z.object({
  type: z.string(),
  data: z.any(),
});

export type Block = z.infer<typeof BlockSchema>;

export const defaultBlocks: Block[] = [
  {
    type: "header",
    data: {
      text: "Welcome to your page!",
      level: 2,
    },
  },
  {
    type: "paragraph",
    data: { text: "Start writing here.." },
  },
];
