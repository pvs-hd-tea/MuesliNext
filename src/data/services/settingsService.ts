import localDataService from "./localDataService";

export default class SettingsService {
  private dataService: localDataService;

  constructor(
    dataService: localDataService = localDataService.getFromLocalOrNew()
  ) {
    this.dataService = dataService;
  }

  setAppName(appName: string) {
    const changedSettings = {
      ...this.dataService.getSettings(),
      name: appName,
    };
    this.dataService.setSettings(changedSettings);
  }

  setAppHomePath(path: string) {
    const changedSettings = {
      ...this.dataService.getSettings(),
      homePath: path,
    };
    this.dataService.setSettings(changedSettings);
  }
}
