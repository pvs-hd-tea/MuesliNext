import React, { useEffect } from "react";
import { PageMetaData } from "../data/meta-data";
import Layout, { LayoutStyle } from "./internal/Layout";
import InfoBanner from "./internal/InfoBanner";

interface PageProperties {
  title: string;
  layout?: LayoutStyle;
  children: React.ReactNode;
  metadata: PageMetaData;
}

const Page: React.FC<PageProperties> = ({
  title,
  layout,
  children,
  metadata,
}) => {
  useEffect(() => {
    document.title = title;
  }, []);

  layout = layout || LayoutStyle.default;

  return (
    <div className="bg-gray-100 font-sans leading-normal tracking-normal pb-1 pt-2">
      <Layout layout={layout}>
        {children}
        {metadata.showDebugInformation && (
          <>
            <InfoBanner message={`Metadata:${JSON.stringify(metadata)}`} />
            <InfoBanner message={`Layout:${JSON.stringify(layout)}`} />
          </>
        )}
      </Layout>
    </div>
  );
};

export default Page;
