import { z } from "zod";
import { defaultPage, PageSchema } from "./Page";
import { defaultSettings, SettingsSchema } from "./Settings";
import { defaultTable, TableSchema } from "./Tables";

export const WebAppConfigSchema = z.object({
  settings: SettingsSchema,
  pages: z.array(PageSchema),
  tables: z.array(TableSchema),
});

export type WebAppConfig = z.infer<typeof WebAppConfigSchema>;

export const defaultConfig: WebAppConfig = {
  settings: defaultSettings,
  pages: [defaultPage],
  tables: [defaultTable],
};
