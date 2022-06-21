import { z } from "zod";
import { defaultPage, PageSchema } from "./Page";
import { defaultSettings, SettingsSchema } from "./Settings";

export const WebAppConfigSchema = z.object({
  settings: SettingsSchema,
  pages: z.array(PageSchema),
});

export type WebAppConfig = z.infer<typeof WebAppConfigSchema>;

export const defaultConfig: WebAppConfig = {
  settings: defaultSettings,
  pages: [defaultPage],
};
