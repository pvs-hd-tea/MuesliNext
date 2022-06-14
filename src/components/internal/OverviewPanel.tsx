import {
  faAngleDown,
  faBarsStaggered,
  faCog,
  faEye,
  faEyeSlash,
  faFile,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Page } from "../../app";
import { defaultMetadata, PageMetaData } from "../../data/meta-data";

export enum LayoutStyle {
  empty = "empty",
  default = "default",
}

interface OverviewPanelProperties {
  appName: string;
  pages: Page[];
  onAddPage: (page: Page) => void;
  onSetMetadata: (uuid: string, metadata: PageMetaData) => void;
}

const OverviewPanel: React.FC<OverviewPanelProperties> = ({
  appName,
  pages,
  onAddPage,
  onSetMetadata,
}) => {
  const addPage = () => {
    const pageName = prompt("Please enter your page name:", "my new page");
    if (pageName == null || pageName == "") {
      return;
    } else {
      if (
        pages.find(
          (page) =>
            page.title.toLocaleLowerCase() === pageName.toLocaleLowerCase()
        )
      ) {
        alert("Page with this name already exists.");
        return;
      }
      const newPage: Page = {
        title: pageName,
        path: pageName.toLowerCase().replace(/ /g, "-"),
        metadata: defaultMetadata,
      };
      onAddPage(newPage);
    }
    return;
  };

  return (
    <div className="flex flex-row min-h-screen fixed">
      <aside className="sidebar w-72 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
        <div className="flex flex-col justify-between min-h-screen bg-white border-r">
          <div className="px-4 py-6">
            <h1 className="text-2xl">{appName}</h1>

            <nav className="flex flex-col mt-6 space-y-1">
              <a
                href="/#/general"
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

                <nav className="ml-5 flex flex-col">
                  {pages.map((page, id) => (
                    <div key={id} className="grid grid-cols-7">
                      <a
                        href={`/#/pages/${page.path}`}
                        className="col-span-6 items-center px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                      >
                        <FontAwesomeIcon icon={faFile} />

                        <span className="w-60  ml-3 mr-3 text-sm font-medium">
                          {" "}
                          {page.title}{" "}
                        </span>
                      </a>
                      <a
                        className="px-2 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => {
                          onSetMetadata(page.path, {
                            ...page.metadata,
                            visible: !page.metadata.visible,
                          });
                        }}
                      >
                        <FontAwesomeIcon
                          icon={page.metadata.visible ? faEye : faEyeSlash}
                        />
                      </a>
                    </div>
                  ))}
                  <a
                    onClick={addPage}
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
