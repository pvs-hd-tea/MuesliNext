export interface Settings {
  name: string;
}

export interface PageMetaData {
  visible: boolean;
}

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

interface WebAppConfig {
  settings: Settings;
  pages: Page[];
  editorSettings?: EditorSettings;
}

export interface EditorSettings {
  lastUrl: string;
}

export const defaultMetadata: PageMetaData = {
  visible: true,
};

export const defaultConfig: WebAppConfig = {
  settings: {
    name: "Web App",
  },
  pages: [
    {
      title: "Welcome",
      path: "welcome-page",
      metadata: defaultMetadata,
      content: { blocks: defaultBlocks },
    },
  ],
};

export default WebAppConfig;
