import React, { useEffect, useState } from "react";
import localDataService from "../../data/services/localDataService";
import SettingsService from "../../data/services/settingsService";
import Button from "../Widgets/ButtonWidget";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GeneralProperties {
  dataService: localDataService;
  settingsService: SettingsService;
}

const General: React.FC<GeneralProperties> = ({
  dataService,
  settingsService,
}) => {
  useEffect(() => {
    document.title = `${dataService.getSettings().name} - General`;
  }, []);

  const [config, setConfig] = useState(dataService.toJsonString());
  const [appName, setAppName] = useState(dataService.getSettings().name);
  const [syntaxError, setSyntaxError] = useState(false);

  const handleConfigChange = (event: any) => {
    setConfig(event.target.value);
  };

  const handleNameInputChange = (event: any) => {
    setAppName(event.target.value);
  };

  const handleNameChange = () => {
    settingsService.setAppName(appName);
  };

  return (
    <div className="mt-5">
      <h2>General</h2>

      <br />
      <h4>Global Settings</h4>
      <div className="flex grid-cols-2 my-2">
        <p>App name</p>
        <input
          className="text-slate-900 bg-slate-200 p-1 px-2 ml-3 rounded-lg text-xs"
          onChange={handleNameInputChange}
          value={appName}
        ></input>
        <Button text="set" onClick={handleNameChange} />
      </div>
      <br />

      <h4>WebApp Configuration JSON</h4>
      <textarea
        className="bg-slate-900 text-slate-100 p-2 rounded-lg w-full h-96 text-xs"
        onChange={handleConfigChange}
      >
        {dataService.toJsonString()}
      </textarea>
      {syntaxError && <span className="text-red-500">Syntax error</span>}
      <div className="float-right mb-5">
        <Button
          text="save"
          onClick={() =>
            setSyntaxError(!dataService.importFromJsonString(config))
          }
        />
        <Button
          text="export"
          onClick={() => {
            const success = dataService.importFromJsonString(config);
            if (success) {
              dataService.exportToJsonFile();
            } else {
              setSyntaxError(true);
            }
          }}
        />
        <Button text="load" onClick={() => dataService.importFromJsonFile()} />
        <Button text="reset" onClick={() => dataService.resetToDefault()} />
      </div>
    </div>
  );
};

export default General;
