import localDataService, { PageMode } from "./localDataService";

/*
@deprecated 
A service that manages the state of the application 
*/
export default class TableService {
  private dataService: localDataService;

  constructor(
    dataService: localDataService = localDataService.getFromLocalOrNew()
  ) {
    this.dataService = dataService;
  }

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
