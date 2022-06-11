import React from "react";
import Page from "./components/Page";
import Text from "./components/Widgets/TextWidget";
import { UserMetaData } from "./data/meta-data";

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
    <Page
      title="Demo Page"
      metadata={{ visible: true, userData, showDebugInformation: true }}
    >
      <Text text="This is a demo page" />
    </Page>
  );
};

export default App;
