import React, { useState } from "react";

import PageEdit from "./components/internal/PageEdit";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import OverviewPanel from "./components/internal/OverviewPanel";
import localDataService, { PageMode } from "./data/services/localDataService";
import General from "./components/internal/General";
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

  const [, setSettingsHash] = useState("");
  dataService.setHashCallback(setSettingsHash);

  return (
    <body className="min-h-screen bg-gray-100">
      {pageService.getGlobalPageMode() !== PageMode.Edit && (
        <div className="bg-gray-900 flex items-center h-14 w-screen gap-8 px-4">
          <a
            className="text-2xl bold text-white transition hover:text-white/75"
            href="/"
          >
            {dataService.getSettings().name}
          </a>

          <div className="flex items-center justify-end flex-1 md:justify-between">
            <nav
              className="hidden md:block"
              aria-labelledby="header-navigation"
            >
              <h2 className="sr-only" id="header-navigation">
                Header navigation
              </h2>

              <ul className="flex items-center gap-6 text-sm">
                {dataService.getPages().map((page, id) => (
                  <li key={id}>
                    <a
                      className="text-white transition hover:text-white/75"
                      href={`/#/pages/${page.path}`}
                    >
                      {page.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="grow"></div>
          <a
            className="cursor-pointer text-sm text-white transition hover:text-white/75 animate-pulse"
            onClick={() => pageService.setGlobalPageMode(PageMode.Edit)}
          >
            {" "}
            PREVIEW MODE{" "}
          </a>
        </div>
      )}
      <div className="flex flex-row">
        {pageService.getGlobalPageMode() === PageMode.Edit && (
          // TODO: make more responsive (not hardcode width)
          <>
            <div className="sm:z-10 flex-none md:z-0 md:block md:w-72 transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in"></div>
            <div className="sm:z-10 flex-none md:z-0 md:fixed md:w-72 transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
              <OverviewPanel
                dataHash={dataService.toHash()}
                dataService={dataService}
                settingsService={settingsService}
                pageService={pageService}
                col-span-1
              />
            </div>
          </>
        )}

        <div
          className={
            "grow px-10" +
            (pageService.getGlobalPageMode() === PageMode.Edit ? " ml-6" : "")
          }
        >
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
                element={
                  <Navigate
                    replace
                    to={`/pages/${dataService.getSettings().homePath}`}
                  />
                }
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
