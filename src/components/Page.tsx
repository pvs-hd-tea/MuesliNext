import React, { useEffect } from "react";
import { PageMetaData } from "../data/meta-data";
import InfoBanner from "./Widgets/InfoBanner";

interface PageProperties {
  title: string;
  children: React.ReactNode;
  metadata: PageMetaData;
}

const Page: React.FC<PageProperties> = ({ title, children, metadata }) => {
  useEffect(() => {
    document.title = title;
  }, []);
  return (
    <div className="pb-1 pt-2">
      {children}
      {metadata.showDebugInformation && (
        <InfoBanner message={`Metadata:${JSON.stringify(metadata)}}`} />
      )}
    </div>
  );
};

export default Page;
