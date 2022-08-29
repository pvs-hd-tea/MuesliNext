// tools.js

//import Paragraph from "@editorjs/paragraph";

//import Image from "@editorjs/image";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Alert from "editorjs-alert";
import Table from "@editorjs/table";
import Paragraph from "../Widgets/Paragraph/CustomParagraph";
import Button from "../Widgets/Button/Button";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";

import DynamicValueWidget from "../Widgets/DynamicValue/DynamicValueWidget";
import DerivedValueWidget from "../Widgets/DerivedValues/DerivedValuesWidget";
import DynamicTableWidget from "../Widgets/Table/DynamicTableWidget";
// import InlineDynamicValueWidget from "../Widgets/DynamicValue/InlineDynamicValueWiget";
import FormFieldWidget from "../Widgets/FormField/FormFieldWidget";
import DynamicTableWidgetDropdown from "../Widgets/DynamicTableWidgetForDropdown";


export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ["alignmentTune"],
  },
  header: { class: Header, shortcut: "CMD+SHIFT+H", tunes: ["alignmentTune"] },
  list: { class: List, shortcut: "CMD+SHIFT+L" },
  alert: {
    class: Alert,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+A",
    config: {
      defaultType: "primary",
      messagePlaceholder: "Enter something",
    },
    tunes: ["alignmentTune"],
  },
  table: { class: Table, inlineToolbar: true, shortcut: "CMD+SHIFT+T" },
  dynamicValue: DynamicValueWidget,
  derivedValue: DerivedValueWidget,
  // dynamicValueInline: InlineDynamicValueWidget,
  dynamicTable: DynamicTableWidget,
  dynamicTableDropdown: DynamicTableWidgetDropdown,
  button: { class: Button, tunes: ["alignmentTune"], shortcut: "CMD+SHIFT+B" },
  formField: {
    class: FormFieldWidget,
    tunes: ["alignmentTune"],
    shortcut: "CMD+SHIFT+F",
  },

  alignmentTune: {
    class: AlignmentTuneTool,
    config: {
      default: "left",
    },
  },
};
