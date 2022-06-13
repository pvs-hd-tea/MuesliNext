import React, { useEffect, useState } from "react";
import { PageMetaData } from "../../data/meta-data";
import Button from "../Widgets/ButtonWidget";
import InfoBanner from "./InfoBanner";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PageProperties {
  configuration: string;
  onExportData: () => void;
  onLoadData: () => void;
  onSaveData: (raw: string) => boolean;
  onResetData: () => void;
}

const General: React.FC<PageProperties> = ({
  configuration,
  onExportData,
  onLoadData,
  onSaveData,
  onResetData,
}) => {
  useEffect(() => {
    document.title = "WebAppGen General";
  }, []);

  const [config, setConfig] = useState(configuration);
  const [syntaxError, setSyntaxError] = useState(false);

  const saveConfig = () => {
    setSyntaxError(onSaveData(config));
  };

  const handleChange = (event: any) => {
    setConfig(event.target.value);
  };

  return (
    <div className="mt-5">
      <h2>General</h2>
      <h4>WebApp Configuration JSON</h4>
      <textarea
        className="bg-slate-900 text-slate-100 p-2 rounded-lg w-full h-96 text-xs"
        onChange={handleChange}
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
