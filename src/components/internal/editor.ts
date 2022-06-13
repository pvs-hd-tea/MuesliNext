import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./tools";

export const editor = new EditorJS({
  /**
   * Id of Element that should contain the Editor
   */
  holderId: "editorjs",

  /**
   * Available Tools list.
   * Pass Tool's class or Settings object for each Tool you want to use
   */
  tools: EDITOR_JS_TOOLS,

  /**
   * Previously saved data that should be rendered
   */
  //data: {},

  /**
   * onReady callback
   */
  onReady: () => {
    console.log("Editor.js is ready to work!");
  },
});
