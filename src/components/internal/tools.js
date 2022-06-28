// tools.js

//import Paragraph from "@editorjs/paragraph";

//import Image from "@editorjs/image";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Alert from "editorjs-alert";
import Table from "@editorjs/table";
import Paragraph from "../Widgets/CustomParagraph";

import DynamicValueWidget from "../Widgets/DynamicValueWidget";
import InlineDynamicValueWidget from "../Widgets/InlineDynamicValueWiget";

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  paragraph: { class: Paragraph, inlineToolbar: true },
  header: { class: Header, shortcut: "CMD+SHIFT+H" },
  list: { class: List, shortcut: "CMD+SHIFT+L" },
  alert: {
    class: Alert,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+A",
    config: {
      defaultType: "primary",
      messagePlaceholder: "Enter something",
    },
  },
  table: { class: Table, inlineToolbar: true, shortcut: "CMD+SHIFT+T" },
  dynamicValue: DynamicValueWidget,
  dynamicValueInline: InlineDynamicValueWidget,
};
