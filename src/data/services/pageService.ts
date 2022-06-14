import {
  defaultMetadata,
  EditorData,
  Page,
  PageMetaData,
} from "../configuration";
import { Optional } from "../types";
import localDataService from "./localDataService";

export default class PageService {
  private dataService: localDataService;

  constructor(dataService: localDataService) {
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
        title: pageName,
        path: pageName.toLowerCase().replace(/ /g, "-"),
        metadata: defaultMetadata,
      };

      this.addPage(newPage);
    }
  }

  addPage = (page: Page) => {
    this.dataService.setPageByKey(page.path, page);
    // TODO: move this
    location.replace(`/#/pages/${page.path}`);
  };

  setPage = (uuid: string, content: EditorData): void => {
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
    const page = this.dataService.getPageByKey(uuid);
    if (!page.isUndefined()) {
      const newPage = page.unwrap();
      newPage.path = path;
      this.dataService.setPageByKey(uuid, newPage);
      // TODO: move this
      location.replace(`/#/pages/${newPage.path}`);
    }
  };
}
