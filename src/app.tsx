import React, { useState } from "react";
import { UserMetaData } from "./data/meta-data";

import PageEdit from "./components/internal/PageEdit";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import OverviewPanel from "./components/internal/OverviewPanel";
import { LocalStorageService as StorageService } from "./data/localStorage";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export interface Page {
  title: string;
  path: string;
  uuid: number;
}

// eslint-disable-next-line no-empty-pattern
const App: React.FC<Props> = ({}) => {
  // Services here
  const storageService = new StorageService();

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
  const [loaded, setLoaded] = useState(false);

  const onAddPage = (page: Page) => {
    setPages([...pages, page]);
    //localStorage.setItem("pages", JSON.stringify([...pages, page]));
    storageService.set("pages", [...pages, page]);
  };

  // const pagesString = localStorage.getItem("pages");
  const pagesString = storageService.get("pages");
  if (pagesString && !loaded) {
    setLoaded(true);
    setPages(JSON.parse(pagesString));
  }

  const onExportData = () => {
    console.log("export data");
    storageService.exportToJsonFile();
  };

  const onLoadData = () => {
    console.log("load data");
    storageService.importFromJsonFile();
  };

  return (
    <body className="h-screen bg-gray-100">
      <div className="grid grid-cols-6 gap-4">
        <OverviewPanel pages={pages} onAddPage={onAddPage} col-span-1 />
        <div className="grow col-start-3 col-span-3">
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
                      pages={pages}
                      metadata={{
                        visible: true,
                        userData,
                        showDebugInformation: false,
                      }}
                      onExportData={onExportData}
                      onLoadData={onLoadData}
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
        </div>
      </div>
    </body>
  );
};

export default App;
