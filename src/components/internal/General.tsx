import React, { useEffect, useState } from "react";
import { AppData } from "../../app";
import { PageMetaData } from "../../data/meta-data";
import Button from "../Widgets/ButtonWidget";
import InfoBanner from "./InfoBanner";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GeneralProperties {
  configuration: string;
  app: AppData;
  onExportData: () => void;
  onLoadData: () => void;
  onSaveData: (raw: string) => boolean;
  onResetData: () => void;
  onSetAppName: (pageName: string) => void;
}

const General: React.FC<GeneralProperties> = ({
  configuration,
  app,
  onExportData,
  onLoadData,
  onSaveData,
  onResetData,
  onSetAppName,
}) => {
  useEffect(() => {
    document.title = `${app.name} - General`;
  }, []);

  const [config, setConfig] = useState(configuration);
  const [appName, setAppName] = useState(app.name);
  const [syntaxError, setSyntaxError] = useState(false);

  const saveConfig = () => {
    setSyntaxError(onSaveData(config));
  };

  const handleConfigChange = (event: any) => {
    setConfig(event.target.value);
  };

  const handleNameInputChange = (event: any) => {
    setAppName(event.target.value);
  };

  const handleNameChange = () => {
    onSetAppName(appName);
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
        {config}
      </textarea>
      {syntaxError && <span className="text-red-500">Syntax error</span>}
      <div className="float-right mb-5">
        <Button text="save" onClick={saveConfig} />
        <Button text="export" onClick={onExportData} />
        <Button text="load" onClick={onLoadData} />
        <Button text="reset" onClick={onResetData} />
      </div>
    </div>
  );
};

export default General;
