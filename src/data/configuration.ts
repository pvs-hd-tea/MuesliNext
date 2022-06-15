export interface Settings {
  name: string;
}

export const defaultSettings: Settings = {
  name: "Web App",
};

export interface PageMetaData {
  visible: boolean;
}

export const defaultMetadata: PageMetaData = {
  visible: true,
};

export interface Block {
  id?: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

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

export interface EditorData {
  time?: number;
  blocks: Block[];
  version?: string;
}

export interface Page {
  title: string;
  path: string;
  metadata: PageMetaData;
  content?: EditorData;
}

export const defaultPage: Page = {
  title: "Welcome",
  path: "welcome-page",
  metadata: defaultMetadata,
  content: { blocks: defaultBlocks },
};

interface WebAppConfig {
  settings: Settings;
  pages: Page[];
  editorSettings?: EditorSettings;
}

export interface EditorSettings {
  lastUrl: string;
}

export const defaultConfig: WebAppConfig = {
  settings: defaultSettings,
  pages: [defaultPage],
};

export default WebAppConfig;
