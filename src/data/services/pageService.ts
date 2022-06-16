import {
  defaultBlocks,
  defaultMetadata,
  defaultPage,
  EditorData,
  Page,
  PageMetaData,
} from "../configuration";
import { Optional } from "../types";
import localDataService from "./localDataService";

export default class PageService {
  private dataService: localDataService;
  private activeUuid = "";

  constructor(
    dataService: localDataService = localDataService.getFromLocalOrNew()
  ) {
    this.dataService = dataService;
  }

  createAndAddPageFromName(pageName: string | null): void {
    if (pageName == null || pageName == "") {
      return;
    } else {
      if (
        this.dataService
          .getPages()
          .find(
            (page) =>
              page.title.toLocaleLowerCase() === pageName.toLocaleLowerCase()
          )
      ) {
        // TODO: move
        alert("Page with this name already exists.");
        return;
      }
      const newPage: Page = {
        ...defaultPage,
        title: pageName,
        path: pageName.toLowerCase().replace(/ /g, "-"),
      };

      this.addPage(newPage);
    }
  }

  addPage = (page: Page) => {
    this.dataService.setPageByKey(page.path, page);
    // TODO: move this
    location.replace(`/#/pages/${page.path}`);
  };

  deletePage = (uuid: string) => {
    this.dataService.deletePageByKey(uuid);
  };

  setPageTitle = (uuid: string, title?: string) => {
    if (title == null || title == "") {
      alert("Please provide a title.");
      return;
    }
    const page = this.dataService.getPageByKey(uuid);
    if (page) {
      const newPage = page.unwrap();
      newPage.title = title;
      this.dataService.setPageByKey(uuid, newPage);
    }
  };

  setPageContent = (uuid: string, content: EditorData): void => {
    const page = this.dataService.getPageByKey(uuid);
    if (!page.isUndefined()) {
      const newPage = page.unwrap();
      newPage.content = content;
      this.dataService.setPageByKey(uuid, newPage);
    }
  };

  // TODO: near copy of above
  setMetadataForPage = (uuid: string, metadata: PageMetaData): void => {
    const page = this.dataService.getPageByKey(uuid);
    if (!page.isUndefined()) {
      const newPage = page.unwrap();
      newPage.metadata = metadata;
      this.dataService.setPageByKey(uuid, newPage);
    }
  };

  setPagePath = (uuid: string, path: string): void => {
    const oldUUID = uuid;
    const page = this.dataService.getPageByKey(uuid);
    if (!page.isUndefined()) {
      // We need to create a deep copy of that page
      const newPage = { ...page.unwrap() };
      newPage.path = path;
      this.dataService.setPageByKey(oldUUID, newPage);
      // TODO: move this
      location.replace(`/#/pages/${newPage.path}`);
    }
  };

  getActiveUuid = (): string => {
    return this.activeUuid;
  };

  setActiveUuid = (uuid: string): void => {
    this.activeUuid = uuid;
  };
}