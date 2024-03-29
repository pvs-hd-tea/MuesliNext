import React, { useState } from "react";

import PageEdit from "./components/internal/PageEdit";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import OverviewPanel from "./components/internal/OverviewPanel";
import localDataService, { PageMode } from "./data/services/localDataService";
import General from "./components/internal/General";
import PageService from "./data/services/pageService";
import SettingsService from "./data/services/settingsService";
import NavBar from "./components/Widgets/NavBar";
import TableService from "./data/services/tableService";
import { Table } from "./data/definitions/Tables";
import { TableWidget } from "./components/Widgets/Table/TableWidget";
import { SWRConfig } from "swr";
import { useListTables } from "./api/hooks";
import { nameToUrl } from "./util/nameToUrl";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

// eslint-disable-next-line no-empty-pattern
const App: React.FC<Props> = ({}) => {
  // Services here

  const dataService = localDataService.getFromLocalOrNew();
  const pageService = new PageService();
  const tableService = new TableService();
  const settingsService = new SettingsService();

  const defaultTables: Table[] = [];
  useState(defaultTables);
  const { tables, isLoading, isError } = useListTables();

  const [, setSettingsHash] = useState("");
  dataService.setHashCallback(setSettingsHash);

  function localStorageProvider() {
    // When initializing, we restore the data from `localStorage` into a map.
    const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"));

    // Before unloading the app, we write back all the data into `localStorage`.
    window.addEventListener("beforeunload", () => {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem("app-cache", appCache);
    });

    // We still use the map for write & read for performance.
    return map;
  }

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <body className="min-h-screen bg-gray-100">
        {pageService.getGlobalPageMode() !== PageMode.Edit && (
          <NavBar dataService={dataService} pageService={pageService} />
        )}
        <div className="flex flex-row">
          {pageService.getGlobalPageMode() === PageMode.Edit && (
            <>
              <div className="sm:z-10 flex-none md:z-0 md:block md:w-72 transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in"></div>
              <div className="sm:z-10 flex-none md:z-0 md:fixed md:w-72 transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
                <OverviewPanel
                  dataHash={dataService.toHash()}
                  dataService={dataService}
                  settingsService={settingsService}
                  pageService={pageService}
                  tableService={tableService}
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
                {!isLoading &&
                  !isError &&
                  tables
                    .filter(
                      (table: Table) =>
                        table.name && !table.name.startsWith("internal#")
                    )
                    .map((table: Table) => (
                      <Route
                        key={table.name}
                        path={`/tables/${nameToUrl(
                          table.name.replace(/^p.*_/, "")
                        )}`}
                        element={
                          <div className="mt-5 place-content-center">
                            <p className="text-2xl text-center text-blue-600">
                              {"table: " + table.name.replace(/^p.*_/, "")}
                            </p>
                            <br />
                            <TableWidget
                              tableName={table.name.replace(/^p.*_/, "")}
                            />
                          </div>
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
    </SWRConfig>
  );
};

export default App;
