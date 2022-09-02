import {
  faAngleDown,
  faLayerGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import localDataService from "../../data/services/localDataService";
import PageService from "../../data/services/pageService";
import PageItem from "./PageItem";

interface PageListProperties {
  dataService: localDataService;
  pageService: PageService;
}

const PageList: React.FC<PageListProperties> = ({
  dataService,
  pageService,
}) => {
  const pages = dataService.getPages();

  const addPage = () => {
    const pageName = prompt("Please enter your page name:", "my new page");
    pageService.createAndAddPageFromName(pageName);
  };

  return (
    <>
      <details className="group">
        <summary className="flex items-center px-4 py-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900">
          <FontAwesomeIcon
            className="transition duration-300 shrink-0 group-hover:scale-y-150"
            icon={faLayerGroup}
          />

          <span className="ml-3 text-sm font-medium"> Pages </span>

          <span className="ml-auto transition duration-300 shrink-0 group-open:-rotate-180">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </summary>

        <nav
          key={pageService.getActivePageUuid()}
          className="ml-5 flex flex-col"
        >
          {pages.map((page, id) => (
            <PageItem key={id} pageService={pageService} page={page} />
          ))}
          <a
            onClick={addPage}
            className="cursor-pointer flex items-center px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-3 text-sm font-medium"> add page </span>
          </a>
        </nav>
      </details>
    </>
  );
};

export default PageList;
