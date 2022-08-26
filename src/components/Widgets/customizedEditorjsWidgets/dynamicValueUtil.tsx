import LocalDataService from "../../../data/services/localDataService";

export default class DynamicValueUtil {
  static fetchInlineValues(text: string): string {
    const startStringOfCommand = "//dynamicValue:";
    const endStringOfCommand = ":dynamicValue//";
    while (
      text.search(startStringOfCommand) > 0 &&
      text.search(endStringOfCommand) > text.search(startStringOfCommand)
    ) {
      const commandStart = text.search(startStringOfCommand);
      const textWithoutStart = text.substring(
        commandStart + startStringOfCommand.length
      );
      const commandEnd = textWithoutStart.search(endStringOfCommand);
      const dataText = textWithoutStart.substring(0, commandEnd);
      const dynamicValue = this.fetchDynamicValueWithDataText(dataText);
      text = text.replace(
        startStringOfCommand + dataText + endStringOfCommand,
        dynamicValue
      );
    }
    return text;
  }

  static fetchDynamicValueWithDataText(dataText: string): string {
    let text = "";
    try {
      const dataJson = JSON.parse(dataText);
      text = this.fetchDynamicValue(
        dataJson.tableName,
        dataJson.columnName,
        dataJson.entryKey
      );
    } catch (e) {
      text = "//Error//";
    }
    return text;
  }

  static fetchDynamicValue(
    tableName: string,
    columnName: string,
    entryKey: string
  ): string {
    const dataService = LocalDataService.getFromLocalOrNew();
    let newVal: string = dataService.fetchTableItemByNameCached(
      tableName,
      columnName,
      entryKey
    );
    if (newVal === undefined) {
      newVal = "not found";
    }
    return newVal;
  }
}
