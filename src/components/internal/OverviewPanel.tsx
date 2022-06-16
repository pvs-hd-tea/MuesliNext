import {
  faAngleDown,
  faBars,
  faCheck,
  faCog,
  faEye,
  faEyeSlash,
  faFile,
  faPen,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import pjson from "../../../package.json";
import localDataService from "../../data/services/localDataService";
import SettingsService from "../../data/services/settingsService";
import PageService from "../../data/services/pageService";
import { Page } from "../../data/configuration";

interface PageItemProperties {
  pageService: PageService;
  page: Page;
  active: string;
}

const PageItem: React.FC<PageItemProperties> = ({ pageService, page }) => {
  const [fileIcon, setFileIcon] = useState(faFile);
  const [stopEditButton, setStopEditButton] = useState(faXmark);
  const [pageName, setPageName] = useState(page.title);
  const [edit, setEdit] = useState(false);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value);
    setStopEditButton(
      event.target.value !== page.title && event.target.value !== ""
        ? faCheck
        : faXmark
    );
  };

  const onNameSave = () => {
    if (pageName !== page.title && pageName !== "") {
      pageService.setPageTitle(page.path, pageName);
    } else {
      setPageName(page.title);
    }
    setEdit(false);
    setFileIcon(faFile);
  };

  const onNameCancel = () => {
    setPageName(page.title);
    setEdit(false);
    setFileIcon(faFile);
  };

  const onDelete = () => {
    // ask for confirmation
    onNameCancel();
    if (confirm("Are you sure you want to delete this page?")) {
      pageService.deletePage(page.path);
    }
  };

  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onNameCancel();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <div className="grid grid-cols-7 hover:scale-105">
      <a
        href={`/#/pages/${page.path}`}
        className="col-span-6 items-center px-4 py-2 text-gray-500  hover:text-gray-900"
      >
        <div>
          {!edit && (
            <>
              <FontAwesomeIcon
                onMouseEnter={() => setFileIcon(faPen)}
                onMouseLeave={() => setFileIcon(faFile)}
                icon={fileIcon}
                onClick={() => {
                  setEdit(true), setStopEditButton(faXmark);
                }}
              />
              <span className="w-60  ml-3 mr-3 text-sm font-medium">
                {" "}
                {page.title}{" "}
              </span>
            </>
          )}
          {edit && (
            <div className="flex mt-1">
              <FontAwesomeIcon
                className="hover:scale-125"
                icon={stopEditButton}
                onClick={onNameSave}
              />
              <FontAwesomeIcon
                className="px-2 hover:scale-125"
                icon={faTrash}
                onClick={onDelete}
              />
              <form onSubmit={onNameSave} className="w-px flex">
                <input
                  className="text-sm appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  size={14}
                  onChange={onInputChange}
                  value={pageName}
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      </a>
      <a
        className="px-2 py-2 text-gray-500 rounded-lg hover:text-gray-900"
        onClick={() => {
          pageService.setMetadataForPage(page.path, {
            ...page.metadata,
            visible: !page.metadata.visible,
          });
        }}
      >
        <FontAwesomeIcon
          className="hover:scale-125"
          icon={page.metadata.visible ? faEye : faEyeSlash}
        />
      </a>
    </div>
  );
};

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
          <FontAwesomeIcon icon={faBars} />

          <span className="ml-3 text-sm font-medium"> Pages </span>

          <span className="ml-auto transition duration-300 shrink-0 group-open:-rotate-180">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </summary>

        <nav className="ml-5 flex flex-col">
          {pages.map((page, id) => (
            <PageItem
              key={id}
              pageService={pageService}
              page={page}
              active={pageService.getActiveUuid()}
            />
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
    </>
  );
};

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
            <h1 className="text-2xl">{dataService.getSettings().name}</h1>

            <nav className="flex flex-col mt-6 space-y-1">
              <a
                href="/#/general"
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
              >
                <FontAwesomeIcon icon={faCog} />
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
              {/* <div className="text-xs">{dataService.toHash()}</div> */}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OverviewPanel;
