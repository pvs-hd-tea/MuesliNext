import React, { useState } from "react";
import Layout, { LayoutStyle } from "./components/internal/Layout";
import Page from "./components/internal/Page";
import Button from "./components/Widgets/ButtonWidget";
import Text from "./components/Widgets/TextWidget";
import { UserMetaData } from "./data/meta-data";

import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./components/internal/tools";
import PageEdit from "./components/internal/PageEdit";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

// eslint-disable-next-line no-empty-pattern
const App: React.FC<Props> = ({}) => {
  // could be fetched from backend
  const userData: UserMetaData = {
    name: "John",
    id: "123",
  };

  return (
    <PageEdit
      title="Demo Page"
      layout={LayoutStyle.default}
      metadata={{ visible: true, userData, showDebugInformation: false }}
    />
  );
};

export default App;
