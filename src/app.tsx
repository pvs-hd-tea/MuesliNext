import React, { useState } from "react";

import PageEdit, { EditorData } from "./components/internal/PageEdit";
import {
  BrowserRouter as Router,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import OverviewPanel from "./components/internal/OverviewPanel";
import localDataService from "./data/services/localDataService";
import General from "./components/internal/General";
import { Page, PageMetaData } from "./data/configuration";
import PageService from "./data/services/pageService";
import SettingsService from "./data/services/settingsService";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

// eslint-disable-next-line no-empty-pattern
const App: React.FC<Props> = ({}) => {
  // Services here

  const dataService = localDataService.getFromLocalOrNew();
  const pageService = new PageService();
  const settingsService = new SettingsService();

  const [settingsHash, setSettingsHash] = useState("");
  dataService.setHashCallback(setSettingsHash);

  // const pagesString = localStorage.getItem("pages");

  return (
    <body className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-6 gap-4">
        <OverviewPanel
          dataHash={dataService.toHash()}
          dataService={dataService}
          settingsService={settingsService}
          pageService={pageService}
          col-span-1
        />
        <div className="grow col-start-3 col-span-3">
          <HashRouter>
            <Routes>
              {dataService.getPages().map((page) => (
                <Route
                  key={page.path}
                  path={`/pages/${page.path}`}
                  element={
                    // TODO: make component not rerender: editor saving difficult tho
                    <PageEdit
                      key={page.path}
                      uuid={page.path}
                      dataService={dataService}
                      pageService={pageService}
                    />
                  }
                />
              ))}
              <Route
                path="/general"
                element={
                  <General
                    key={dataService.toHash()}
                    dataService={dataService}
                    settingsService={settingsService}
                  />
                }
              />
              <Route
                path="/"
                element={<Navigate replace to="/pages/welcome-page" />}
              />
              <Route
                path="*"
                element={
                  <div className="mt-20 place-content-center">
                    <p className="text-9xl text-center text-red-600"> 404 </p>
                    <p className="text-2xl text-center text-red-600">
                      Page does not exist
                    </p>
                  </div>
                }
              />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </body>
  );
};

export default App;
