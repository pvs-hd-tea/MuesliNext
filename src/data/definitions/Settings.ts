import { z } from "zod";

export const SettingsSchema = z.object({
  name: z.string(),
  homePath: z.string(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const defaultSettings: Settings = {
  name: "Web App",
  homePath: "home",
};
