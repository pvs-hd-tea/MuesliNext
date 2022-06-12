import React from "react";
import OverviewPanel from "./OverviewPanel";

export enum LayoutStyle {
  empty = "empty",
  default = "default",
}

interface LayoutProperties {
  layout?: LayoutStyle;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProperties> = ({ layout, children }) => {
  layout = layout || LayoutStyle.default;
  switch (layout) {
    case LayoutStyle.empty:
      return <EmptyLayout>{children}</EmptyLayout>;
    case LayoutStyle.default:
    default:
      return <DefaultLayout>{children}</DefaultLayout>;
  }
};

const EmptyLayout: React.FC<LayoutProperties> = ({ children }) => {
  return <div className="content">{children}</div>;
};

const DefaultLayout: React.FC<LayoutProperties> = ({ children }) => {
  return (
    <div className="flex">
      <OverviewPanel />
      <div className="grow">{children}</div>
    </div>
  );
};

export default Layout;
