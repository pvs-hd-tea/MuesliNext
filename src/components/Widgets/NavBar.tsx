import React from "react";
import localDataService, {
  PageMode,
} from "../../data/services/localDataService";
import PageService from "../../data/services/pageService";

interface NavBarProperties {
  dataService: localDataService;
  pageService: PageService;
}

const NavBar: React.FC<NavBarProperties> = ({ dataService, pageService }) => {
  return (
    <div className="bg-gray-900 flex items-center h-14 w-screen gap-8 px-4">
      <a
        className="text-2xl bold text-white transition hover:text-white/75"
        href="/"
      >
        {dataService.getSettings().name}
      </a>

      <div className="flex items-center justify-end flex-1 md:justify-between">
        <nav className="hidden md:block" aria-labelledby="header-navigation">
          <h2 className="sr-only" id="header-navigation">
            Header navigation
          </h2>

          <ul className="flex items-center gap-6 text-sm">
            {dataService.getPages().map((page, id) => (
              <li key={id}>
                <a
                  className="text-white transition hover:text-white/75"
                  href={`/#/pages/${page.path}`}
                >
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="grow"></div>
      <a
        className="cursor-pointer text-sm text-white transition hover:text-white/75 animate-pulse"
        onClick={() => pageService.setGlobalPageMode(PageMode.Edit)}
      >
        {" "}
        PREVIEW MODE{" "}
      </a>
    </div>
  );
};

export default NavBar;
