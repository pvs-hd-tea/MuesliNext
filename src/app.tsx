import React, { useState } from "react";
import { LayoutStyle } from "./components/internal/Layout";
import { UserMetaData } from "./data/meta-data";

import PageEdit from "./components/internal/PageEdit";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export interface Page {
  title: string;
  path: string;
  uuid: number;
}

// eslint-disable-next-line no-empty-pattern
const App: React.FC<Props> = ({}) => {
  // could be fetched from backend
  const userData: UserMetaData = {
    name: "John",
    id: "123",
  };

  const defaultPages: Page[] = [
    {
      title: "Welcome",
      path: "welcome-page",
      uuid: 1,
    },
  ];

  const [pages, setPages] = useState(defaultPages);

  return (
    <Router>
      <Routes>
        {pages.map((page) => (
          <Route
            key={page.uuid}
            path={`/pages/${page.path}`}
            element={
              <PageEdit
                title={page.title}
                uuid={page.uuid}
                layout={LayoutStyle.default}
                pages={pages}
                metadata={{
                  visible: true,
                  userData,
                  showDebugInformation: false,
                }}
              />
            }
          />
        ))}
        <Route
          path="/"
          element={<Navigate replace to="/pages/welcome-page" />}
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
  );
};

export default App;
