import React, { useEffect, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import Button from "../Widgets/ButtonWidget";
import { EDITOR_JS_TOOLS } from "./tools";
import {
  faChevronRight,
  faHome,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import localDataService from "../../data/services/localDataService";
import PageService from "../../data/services/pageService";

interface Block {
  id?: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
export interface EditorData {
  time: number;
  blocks: Block[];
  version: string;
}

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

  const handleSave = React.useCallback(async () => {
    const savedData = await editorCore.current.save();
    pageService.setPage(uuid, savedData);
  }, []);

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
      pageService.setPagePath(uuid, `${pre}/${pathEnding}`);
    }
  };

  const addPath = () => {
    // prompt for new path ending
    const pathEnding = page.path.split("/").at(-1);
    let subPath = prompt("Enter new  sub path");
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

      <nav aria-label="Breadcrumb">
        <ol
          role="list"
          className="flex items-center space-x-1 text-sm text-gray-500"
        >
          <li>
            <a className="block transition-colors hover:text-gray-700" href="/">
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
                    className="block transition-colors hover:text-gray-700"
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
              className="block transition-colors hover:text-gray-700"
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
              className="block transition-colors hover:text-gray-700"
              onClick={changePath}
            >
              {" "}
              {page.path.split("/").at(-1)}{" "}
            </a>
          </li>
        </ol>
      </nav>

      <div>
        <ReactEditorJS
          data={page.content}
          tools={EDITOR_JS_TOOLS}
          onInitialize={handleInitialize}
          onChange={handleSave}
          placeholder="start writing here..."
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
