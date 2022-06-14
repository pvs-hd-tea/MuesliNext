import React, { useEffect, useState } from "react";
import { PageMetaData } from "../../data/meta-data";
import { createReactEditorJS } from "react-editor-js";
import Button from "../Widgets/ButtonWidget";
import { EDITOR_JS_TOOLS } from "./tools";
import { Page } from "../../app";

interface Block {
  id?: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
export interface EditorData {
  time: number;
  blocks: Block[];
  version: string;
}

interface PageProperties {
  title: string;
  uuid: string;
  metadata: PageMetaData;
  content?: EditorData;
  onChangePage: (uuid: string, content: EditorData) => void;
}

const PageEdit: React.FC<PageProperties> = ({
  title,
  uuid,
  content,
  metadata,
  onChangePage,
}) => {
  useEffect(() => {
    document.title = title;
  }, []);

  const editorCore = React.useRef<typeof ReactEditorJS>(null);

  const storagePath = `pagecontent:from:${uuid}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInitialize = React.useCallback((instance: any) => {
    editorCore.current = instance;
  }, []);

  const handleSave = React.useCallback(async () => {
    const savedData = await editorCore.current.save();
    console.log(JSON.stringify(savedData));
    onChangePage(uuid, savedData);
  }, []);

  const ReactEditorJS = createReactEditorJS();
  const exampleData: EditorData = {
    time: 1655066094269,
    blocks: [
      {
        id: "8ZoVTZZ9jg",
        type: "header",
        data: { text: "This is an example page", level: 2 },
      },
      {
        id: "LYJ1EHOLmQ",
        type: "paragraph",
        data: { text: "This is some text <b>with </b><i>styling</i>" },
      },
      {
        id: "qYaxKJcXGD",
        type: "paragraph",
        data: {
          text: 'This is a <a href="http://www.google.com">link</a><br>',
        },
      },
      {
        id: "cMoaX5FzF4",
        type: "paragraph",
        data: { text: "This is a list" },
      },
      {
        id: "D0jErz3_xG",
        type: "list",
        data: { style: "ordered", items: ["this", "that"] },
      },
      {
        id: "JxFUMr6p2l",
        type: "button",
        data: {
          link: "www.google.com",
          text: "A button (that is just a link)",
        },
      },
      {
        id: "O8eLtHr6Q-",
        type: "table",
        data: {
          withHeadings: false,
          content: [
            ["This", "is"],
            ["a", "Table"],
          ],
        },
      },
      {
        id: "3e5YMNDp_W",
        type: "code",
        data: { code: "A code block" },
      },
      {
        id: "e-E8VunCZv",
        type: "checklist",
        data: {
          items: [
            { text: "do this", checked: false },
            { text: "do that", checked: false },
            { text: "do yet another thing", checked: false },
          ],
        },
      },
      {
        id: "8oIBCrULms",
        type: "quote",
        data: {
          text: "This is a quote<br>",
          caption: "caption<br>",
          alignment: "left",
        },
      },
      {
        id: "QhXvUN9Amt",
        type: "raw",
        data: { html: "<p>custom html</p>" },
      },
    ],
    version: "2.24.3",
  };

  const defaultData: EditorData = {
    time: 0,
    blocks: [
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
    ],
    version: "2.11.10",
  };

  if (!content) {
    content = defaultData;
  }

  const loadExampleData = () => {
    localStorage.setItem(storagePath, JSON.stringify(exampleData));
    content = exampleData;
    editorCore.current.render(exampleData);
    onChangePage(uuid, content);
  };

  const clearData = () => {
    localStorage.setItem(storagePath, JSON.stringify(defaultData));
    content = defaultData;
    editorCore.current.render(defaultData);
    onChangePage(uuid, content);
  };

  return (
    <div className="bg-gray-100 font-sans leading-normal tracking-normal pb-1 pt-2">
      {!metadata.visible && (
        <div className="px-1 py-1 text-white bg-red-600 rounded-full">
          <p className="text-sm font-medium text-center">
            Page will not be visible in final WebApp
          </p>
        </div>
      )}

      <div>
        <ReactEditorJS
          data={content}
          tools={EDITOR_JS_TOOLS}
          onInitialize={handleInitialize}
          onChange={handleSave}
          placeholder="start writing here..."
        />
        {/* <ReactEditorJS tools={EDITOR_JS_TOOLS} /> */}
        <div className="float-right m-5">
          <Button text="load Example Data" onClick={loadExampleData} />
          <Button text="clear" onClick={clearData} />
        </div>
      </div>
    </div>
  );
};

export default PageEdit;
