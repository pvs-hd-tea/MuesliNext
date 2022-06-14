import React, { useEffect } from "react";
import { PageMetaData } from "../../data/meta-data";
import InfoBanner from "./InfoBanner";

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
    <div className="bg-gray-100 font-sans leading-normal tracking-normal pb-1 pt-2">
      <div>{children}</div>
    </div>
  );
};

export default Page;
