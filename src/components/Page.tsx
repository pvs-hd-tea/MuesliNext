import React, { useEffect } from "react";
import { PageMetaData } from "../data/meta-data";

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
    <div className="page">
      {children}
      {metadata.showDebugInformation && (
        <>
          <hr />
          Metadata:{JSON.stringify(metadata)}
        </>
      )}
    </div>
  );
};

export default Page;
