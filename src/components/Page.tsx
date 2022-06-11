import React, { useEffect } from "react";

interface PageProperties {
  title: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProperties> = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, []);
  return <div className="page">{children}</div>;
};

export default Page;
