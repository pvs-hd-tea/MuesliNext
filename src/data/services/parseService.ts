import { WebAppConfig, WebAppConfigSchema } from "../definitions";
import { Optional } from "../types";

export default class ParseService {
  private static instance: ParseService;

  private reliablyStringify(value: unknown): Optional<string> {
    try {
      return new Optional(JSON.stringify(value, null, 2));
    } catch {
      try {
        return new Optional(String(value));
      } catch {
        return new Optional<any>(undefined);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): ParseService {
    if (!ParseService.instance) {
      ParseService.instance = new ParseService();
    }
    return ParseService.instance;
  }

  parseConfigFromString(input: string): Optional<WebAppConfig> {
    const raw = JSON.parse(input);
    // parse with zod
    const config = WebAppConfigSchema.safeParse(raw);
    if (!config.success) {
      return new Optional<WebAppConfig>(undefined);
    }
    return new Optional(config.data);
  }

  parseConfigToString(config: WebAppConfig): string {
    const simpleConfig = WebAppConfigSchema.parse(config);
    const stringified = this.reliablyStringify(simpleConfig);
    if (!stringified.isUndefined()) {
      return stringified.unwrap();
    }
    return "";
  }
}
