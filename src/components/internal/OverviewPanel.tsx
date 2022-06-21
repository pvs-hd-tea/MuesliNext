import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import pjson from "../../../package.json";
import localDataService, {
  PageMode,
} from "../../data/services/localDataService";
import SettingsService from "../../data/services/settingsService";
import PageService from "../../data/services/pageService";
import PageList from "./PageList";
import { faCog, faRocket } from "@fortawesome/free-solid-svg-icons";

interface OverviewPanelProperties {
  dataHash: string;
  dataService: localDataService;
  settingsService: SettingsService;
  pageService: PageService;
}

const OverviewPanel: React.FC<OverviewPanelProperties> = ({
  dataService,
  pageService,
}) => {
  return (
    <div className="flex flex-row min-h-screen fixed">
      <aside className="sidebar w-72 shadow-lg transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
        <div className="flex flex-col justify-between min-h-screen bg-white border-r">
          <div className="px-4 py-6">
            <div className="flex flex-row">
              <a
                className="flex flex-row group text-3xl hover:bg-gray-900 hover:text-gray-100 hover:animate-pulse rounded-tl-lg rounded-br-lg transition duration-300 shrink-0 p-1"
                onClick={() => pageService.setGlobalPageMode(PageMode.Preview)}
                href={`/#/`}
              >
                {dataService.getSettings().name}
                <FontAwesomeIcon className="text-white ml-2" icon={faRocket} />
              </a>
            </div>
            <nav className="flex flex-col mt-6 space-y-1">
              <a
                onClick={() => pageService.setActivePageUuid("")}
                href="/#/general"
                className="group flex items-center px-4 py-2 text-gray-700 rounded-lg"
              >
                <FontAwesomeIcon
                  className="transition duration-300 shrink-0 group-hover:-rotate-180 group-hover:scale-125"
                  icon={faCog}
                />
                <span className="ml-3 text-sm font-medium"> General </span>
              </a>

              <PageList dataService={dataService} pageService={pageService} />
            </nav>
          </div>
          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
            <div className="ml-1.5">
              <a
                className="text-xs"
                href="https://github.com/pvs-hd-tea/MuesliNext"
              >
                <span className="text-gray-400">
                  {" "}
                  <FontAwesomeIcon icon={faGithub} /> WebAppGen v{pjson.version}{" "}
                </span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OverviewPanel;
