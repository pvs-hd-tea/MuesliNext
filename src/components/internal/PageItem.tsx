import React, { useCallback, useEffect, useState } from "react";
import {
  faCheck,
  faEye,
  faEyeSlash,
  faFile,
  faFilePen,
  faPen,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Page } from "../../data/definitions";
import PageService from "../../data/services/pageService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PageItemProperties {
  pageService: PageService;
  page: Page;
}

const PageItem: React.FC<PageItemProperties> = ({ pageService, page }) => {
  const pageIsActive = pageService.getActivePageUuid() === page.path;
  const defaultPageIcon = pageIsActive ? faFilePen : faFile;
  const animation = pageIsActive ? "animate-bounce" : "";
  const shadow = pageIsActive ? " shadow-lg" : "";

  const [fileIcon, setFileIcon] = useState(defaultPageIcon);
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
    setFileIcon(defaultPageIcon);
  };

  const onNameCancel = () => {
    setPageName(page.title);
    setEdit(false);
    setFileIcon(defaultPageIcon);
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

  const handleOnClick = () => {
    if (!edit && pageIsActive) {
      setEdit(true);
      setFileIcon(faXmark);
    }
    pageService.setActivePageUuid(page.path);
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <div
      className={"grid grid-cols-7 hover:scale-105 hover:shadow-lg" + shadow}
    >
      <a
        href={`/#/pages/${page.path}`}
        onClick={handleOnClick}
        className="col-span-6 items-center px-4 py-2 text-gray-500  hover:text-gray-900"
      >
        <div>
          {!edit && (
            <>
              <FontAwesomeIcon
                className={animation}
                onMouseEnter={() => setFileIcon(faPen)}
                onMouseLeave={() => setFileIcon(defaultPageIcon)}
                icon={fileIcon}
                onClick={() => {
                  setEdit(true), setStopEditButton(faXmark);
                }}
              />
              <span className="w-60  ml-3 mr-3 text-sm font-medium">
                {" "}
                {page.title} {}
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

export default PageItem;
