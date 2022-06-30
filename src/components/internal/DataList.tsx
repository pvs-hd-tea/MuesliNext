import {
  faAngleDown,
  faCubes,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Table } from "../../data/definitions/Tables";
import localDataService from "../../data/services/localDataService";
import TableService from "../../data/services/tableService";
import TableItem from "./TableItem";

interface PageListProperties {
  dataService: localDataService;
  tableService: TableService;
}

const DataList: React.FC<PageListProperties> = ({
  dataService,
  tableService,
}) => {
  const defaultTables: Table[] = [];
  const [tables, setTables] = useState(defaultTables);

  const getTables = async () => {
    const tables = await dataService.fetchTables();
    setTables(tables);
  };

  useEffect(() => {
    if (tables.length === 0) {
      getTables();
    }
  });

  const addTable = () => {
    const tableName = prompt("Please enter your table name:", "my table");
    tableService.createAndAddTableFromName(tableName);
  };

  return (
    <>
      <details className="group">
        <summary className="flex items-center px-4 py-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900">
          <FontAwesomeIcon
            className="transition duration-300 shrink-0 group-hover:scale-150"
            icon={faCubes}
          />

          <span className="ml-3 text-sm font-medium"> Data </span>

          <span className="ml-auto transition duration-300 shrink-0 group-open:-rotate-180">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </summary>

        <nav className="ml-5 flex flex-col">
          {tables.map((table, id) => (
            <TableItem key={id} tableService={tableService} table={table} />
          ))}
          <a
            onClick={addTable}
            className="cursor-pointer flex items-center px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-3 text-sm font-medium"> add table </span>
          </a>
        </nav>
      </details>
    </>
  );
};

export default DataList;
