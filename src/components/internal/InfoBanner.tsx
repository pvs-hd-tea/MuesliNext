import React from "react";

interface InfoBannerProperties {
  message: string;
}

const InfoBanner: React.FC<InfoBannerProperties> = ({ message }) => {
  return (
    <div className="text-slate-100  bg-slate-800 mt-1 p-1 pl-6 pr-6">
      {message}
    </div>
  );
};

export default InfoBanner;
