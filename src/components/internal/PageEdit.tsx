import React, { useEffect } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import {
  faArrowRightLong,
  faChevronRight,
  faHome,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import localDataService, {
  PageMode,
} from "../../data/services/localDataService";
import PageService from "../../data/services/pageService";

interface PageProperties {
  uuid: string;
  dataService: localDataService;
  pageService: PageService;
}

const PageEdit: React.FC<PageProperties> = ({
  uuid,
  dataService,
  pageService,
}) => {
  const page = dataService.getPageByKey(uuid).unwrap();

  useEffect(() => {
    document.title = page.title;
  });

  const editorCore = React.useRef<typeof ReactEditorJS>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInitialize = React.useCallback((instance: any) => {
    editorCore.current = instance;
  }, []);

  const handleReady = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editor = editorCore.current._editorJS;
  };

  const handleSave = React.useCallback(async () => {
    const savedData = await editorCore.current.save();
    pageService.setPageContent(uuid, savedData);
  }, [pageService, uuid]);

  const ReactEditorJS = createReactEditorJS();

  const changePath = () => {
    // prompt for new path ending
    let pathEnding = prompt(
      "Enter new path ending",
      page.path.split("/").at(-1)
    );
    // cast pathEnding to valid url string
    if (pathEnding) {
      pathEnding = pathEnding.replace(/[^a-zA-Z0-9]/g, "-");
      const pre = page.path.split("/").slice(0, -1).join("/") || "";
      pageService.setPagePath(uuid, `${pre}${pre ? "/" : ""}${pathEnding}`);
    }
  };

  const addPath = () => {
    // prompt for new path ending
    const pathEnding = page.path.split("/").at(-1);
    let subPath = prompt("Enter new sub path", "sub");
    // cast pathEnding to valid url string
    if (subPath && subPath !== "") {
      subPath = subPath.replace(/[^a-zA-Z0-9]/g, "-");
      const pre = page.path.split("/").slice(0, -1).join("/") || "";
      if (pre !== "") {
        pageService.setPagePath(uuid, `${pre}/${subPath}/${pathEnding}`);
      } else {
        pageService.setPagePath(uuid, `${subPath}/${pathEnding}`);
      }
    }
  };

  return (
    <div className="bg-gray-100 font-sans leading-normal tracking-normal pb-1 pt-2">
      {!page.metadata.visible && (
        <div className="mb-5 px-1 py-1 text-white bg-red-600 rounded-full">
          <p className="text-sm font-medium text-center">
            Page will not be visible in final WebApp
          </p>
        </div>
      )}

      {pageService.getGlobalPageMode() === PageMode.Edit && (
        <nav aria-label="Breadcrumb" className="flex flex-row">
          <ol
            role="list"
            className="flex items-center space-x-1 text-sm text-gray-500"
          >
            <li>
              <a
                className="block transition-colors hover:text-gray-700"
                href="/"
              >
                <span className="sr-only"> Home </span>

                <FontAwesomeIcon icon={faHome} />
              </a>
            </li>

            {page.path
              .split("/")
              .slice(0, -1)
              .map((pagePath, index) => (
                <>
                  <li>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </li>

                  <li>
                    <a
                      className="cursor-pointer block transition-colors hover:text-gray-700"
                      href={`/pages/${page.path
                        .split("/")
                        .slice(0, index + 1)
                        .join("/")}`}
                    >
                      {" "}
                      {pagePath}{" "}
                    </a>
                  </li>
                </>
              ))}
            <li>
              <FontAwesomeIcon icon={faChevronRight} />
            </li>

            <li>
              <a
                className="cursor-pointer block transition-colors hover:text-gray-700"
                onClick={addPath}
              >
                {" "}
                <FontAwesomeIcon icon={faPlus} />{" "}
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faChevronRight} />
            </li>

            <li>
              <a
                className="cursor-pointer block transition-colors hover:text-gray-700"
                onClick={changePath}
              >
                {" "}
                {page.path.split("/").at(-1)}{" "}
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faArrowRightLong} /> {page.title}
            </li>
          </ol>
          <div className="grow"></div>
          {pageService.getGlobalPageMode() === PageMode.Edit && (
            <a
              className="cursor-pointer text-sm text-gray-500 animate-pulse"
              onClick={() => pageService.setGlobalPageMode(PageMode.Preview)}
            >
              {" "}
              EDIT MODE{" "}
            </a>
          )}
        </nav>
      )}

      <div>
        <ReactEditorJS
          key={
            pageService.getGlobalPageMode() +
            dataService.getLocalState().updateCounter
          }
          data={page.content}
          tools={EDITOR_JS_TOOLS}
          readOnly={pageService.getGlobalPageMode() !== PageMode.Edit}
          onInitialize={handleInitialize}
          onReady={handleReady}
          onChange={handleSave}
          placeholder="start writing here..."
          defaultBlock="paragraph"
        />
        {/* <ReactEditorJS tools={EDITOR_JS_TOOLS} /> */}
        <div className="float-right m-5">
          {/* <Button text="load Example Data" onClick={loadExampleData} />
          <Button text="clear" onClick={clearData} /> */}
        </div>
      </div>
    </div>
  );
};

export default PageEdit;
