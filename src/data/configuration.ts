import { z } from "zod";

export const SettingsSchema = z.object({
  name: z.string(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const defaultSettings: Settings = {
  name: "Web App",
};

export const PageMetaDataSchema = z.object({
  visible: z.boolean(),
});

export type PageMetaData = z.infer<typeof PageMetaDataSchema>;

export const defaultMetadata: PageMetaData = {
  visible: true,
};

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

export const EditorDataSchema = z.object({
  blocks: z.array(BlockSchema),
});

export type EditorData = z.infer<typeof EditorDataSchema>;

export const DefaultEditorData: EditorData = {
  blocks: defaultBlocks,
};

export const PageSchema = z.object({
  title: z.string(),
  path: z.string(),
  metadata: PageMetaDataSchema,
  content: EditorDataSchema.optional(),
});

export type Page = z.infer<typeof PageSchema>;

export const defaultPage: Page = {
  title: "Welcome",
  path: "welcome-page",
  metadata: defaultMetadata,
  content: { blocks: defaultBlocks },
};

export const WebAppConfigSchema = z.object({
  settings: SettingsSchema,
  pages: z.array(PageSchema),
});

export type WebAppConfig = z.infer<typeof WebAppConfigSchema>;

export const defaultConfig: WebAppConfig = {
  settings: defaultSettings,
  pages: [defaultPage],
};
