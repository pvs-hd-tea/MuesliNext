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
import DataList from "./DataList";
import TableService from "../../data/services/tableService";
import { useGetStatus } from "../../api/hooks/useGetStatus";

interface OverviewPanelProperties {
  dataHash: string;
  dataService: localDataService;
  settingsService: SettingsService;
  pageService: PageService;
  tableService: TableService;
}

const OverviewPanel: React.FC<OverviewPanelProperties> = ({
  dataService,
  pageService,
  tableService,
}) => {
  const { status, isLoading, isError } = useGetStatus();

  // const [connected, setConnected] = useState(false);

  // useEffect(() => {
  //   dataService.isConnected().then((isConnected) => {
  //     setConnected(isConnected);
  //   });
  // });

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
              <DataList dataService={dataService} tableService={tableService} />
            </nav>
          </div>
          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100  w-full">
            <div className="ml-1.5 my-1 text-xs">
              <a href="https://github.com/pvs-hd-tea/MuesliNext">
                <span className="text-gray-400">
                  {" "}
                  <FontAwesomeIcon icon={faGithub} /> WebAppGen v{pjson.version}{" "}
                </span>
              </a>
              <a
                className="float-right mx-1"
                href={dataService.getSettings().backendUrl}
              >
                {!isLoading && !isError && status.statusCode === 200 ? (
                  <span className="text-green-400">connected</span>
                ) : (
                  <span className="float-right">offline</span>
                )}
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OverviewPanel;
