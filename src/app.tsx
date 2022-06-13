import React from "react";
import { LayoutStyle } from "./components/internal/Layout";
import { UserMetaData } from "./data/meta-data";

import PageEdit from "./components/internal/PageEdit";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
    <Router>
      <Routes>
        <Route
          path="/pages/placeholderPage1"
          element={
            <PageEdit
              title="Placeholder page 1"
              uuid={1}
              layout={LayoutStyle.default}
              metadata={{
                visible: true,
                userData,
                showDebugInformation: false,
              }}
            />
          }
        />
        <Route
          path="/pages/placeholderPage2"
          element={
            <PageEdit
              title="Placeholder page 2"
              uuid={2}
              layout={LayoutStyle.default}
              metadata={{
                visible: true,
                userData,
                showDebugInformation: false,
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
