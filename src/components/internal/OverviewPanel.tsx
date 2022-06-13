import {
  faAngleDown,
  faBarsStaggered,
  faCog,
  faFile,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { PageLink } from "../../data/page-link";
import { Page } from "../../app";

export enum LayoutStyle {
  empty = "empty",
  default = "default",
}

interface OverviewPanelProperties {
  pages: Page[];
}

const OverviewPanel: React.FC<OverviewPanelProperties> = ({ pages }) => {
  return (
    <div className="flex flex-row min-h-screen fixed">
      <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
        <div className="flex flex-col justify-between min-h-screen bg-white border-r">
          <div className="px-4 py-6">
            <h1 className="text-2xl">Overview</h1>

            <nav className="flex flex-col mt-6 space-y-1">
              <a
                href=""
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
              >
                <FontAwesomeIcon icon={faCog} />
                <span className="ml-3 text-sm font-medium"> General </span>
              </a>

              <details className="group">
                <summary className="flex items-center px-4 py-2 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-700">
                  <FontAwesomeIcon icon={faBarsStaggered} />

                  <span className="ml-3 text-sm font-medium"> Pages </span>

                  <span className="ml-auto transition duration-300 shrink-0 group-open:-rotate-180">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </span>
                </summary>

                <nav className="mt-1.5 ml-8 flex flex-col">
                  {pages.map((page, id) => (
                    <a
                      key={id}
                      href={`/pages/${page.path}`}
                      className="flex items-center px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                      <FontAwesomeIcon icon={faFile} />

                      <span className="ml-3 text-sm font-medium">
                        {" "}
                        {page.title}{" "}
                      </span>
                    </a>
                  ))}
                  <a
                    onClick={() => alert("new page")}
                    className="flex items-center px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="ml-3 text-sm font-medium"> add page </span>
                  </a>
                </nav>
              </details>
            </nav>
          </div>
          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
            <div className="ml-1.5">
              <p className="text-xs">
                <span> WebAppGen </span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OverviewPanel;
