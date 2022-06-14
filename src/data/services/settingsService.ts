import localDataService from "./localDataService";

export default class SettingsService {
  private dataService: localDataService;

  constructor(dataService: localDataService) {
    this.dataService = dataService;
  }

  setAppName(appName: string) {
    const changedSettings = {
      ...this.dataService.getSettings(),
      name: appName,
    };
    this.dataService.setSettings(changedSettings);
  }
}
