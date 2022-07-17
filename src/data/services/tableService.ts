import { defaultPage } from "../definitions";
import { Table } from "../definitions/Tables";
import localDataService, { PageMode } from "./localDataService";

export default class TableService {
  private dataService: localDataService;

  constructor(
    dataService: localDataService = localDataService.getFromLocalOrNew()
  ) {
    this.dataService = dataService;
  }

  createAndAddTableFromName(name: string | null): void {
    if (name == null || name == "") {
      return;
    } else {
      if (
        this.dataService
          .getPages()
          .find(
            (page) =>
              page.title.toLocaleLowerCase() === name.toLocaleLowerCase()
          )
      ) {
        // TODO: move
        alert("Table with this name already exists.");
        return;
      }
      const newTable: Table = {
        ...defaultPage,
        name: name,
        key: name.toLowerCase().replace(/ /g, "-"),
      };

      this.addTable(newTable);
    }
  }

  addTable = (table: Table) => {
    this.dataService.setTableByKey(table.key, table);
    // TODO: move this
    location.replace(`/#/tables/${table.key}`);
    this.setActivePageUuid(table.key);
  };

  deleteTable = (uuid: string) => {
    this.dataService.deleteTableByKey(uuid);
  };

  setTableName = (key: string, name?: string) => {
    if (name == null || name == "") {
      alert("Please provide a title.");
      return;
    }
    const table = this.dataService.getTableByKey(key);
    if (table) {
      const newTable = table.unwrap();
      newTable.name = name;
      this.dataService.setTableByKey(key, newTable);
    }
  };

  getActivePageUuid = (): string => {
    const localState = this.dataService.getLocalState();
    return localState.activePageUuid ?? "unknown";
  };

  setActivePageUuid = (uuid: string): void => {
    const localState = this.dataService.getLocalState();
    this.dataService.setLocalState({
      ...localState,
      activePageUuid: uuid,
    });
  };

  setGlobalPageMode = (mode: PageMode): void => {
    const localState = this.dataService.getLocalState();
    this.dataService.setLocalState({
      ...localState,
      pageMode: mode,
    });
  };

  getGlobalPageMode = (): PageMode => {
    const localState = this.dataService.getLocalState();
    return localState.pageMode;
  };
}
