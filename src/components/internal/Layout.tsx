import React from "react";
import { Page } from "../../app";
import OverviewPanel from "./OverviewPanel";

export enum LayoutStyle {
  empty = "empty",
  default = "default",
}

interface LayoutProperties {
  layout?: LayoutStyle;
  children: React.ReactNode;
  pages?: Page[];
}

const Layout: React.FC<LayoutProperties> = ({ layout, children, pages }) => {
  layout = layout || LayoutStyle.default;
  switch (layout) {
    case LayoutStyle.empty:
      return <EmptyLayout>{children}</EmptyLayout>;
    case LayoutStyle.default:
    default:
      return <DefaultLayout pages={pages}>{children}</DefaultLayout>;
  }
};

const EmptyLayout: React.FC<LayoutProperties> = ({ children }) => {
  return <div className="content">{children}</div>;
};

const DefaultLayout: React.FC<LayoutProperties> = ({ children, pages }) => {
  const linkedPages = pages || [];
  return (
    <div className="grid grid-cols-6 gap-4">
      <OverviewPanel pages={linkedPages} col-span-1 />
      <div className="grow col-start-3 col-span-3">{children}</div>
    </div>
  );
};

export default Layout;
