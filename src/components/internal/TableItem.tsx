import React, { useCallback, useEffect, useState } from "react";
import {
  faCheck,
  faPen,
  faTable,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "../../data/definitions/Tables";
import TableService from "../../data/services/tableService";
import LocalDataService from "../../data/services/localDataService";

interface tableItemProperties {
  tableService: TableService;
  table: Table;
}

const TableItem: React.FC<tableItemProperties> = ({ tableService, table }) => {
  const tableIsActive = tableService.getActivePageUuid() === table.key;
  const defaultTableIcon = faTable;
  const animation = tableIsActive ? "animate-bounce" : "";
  const shadow = tableIsActive ? " shadow-lg" : "";

  const [fileIcon, setFileIcon] = useState(faTable);
  const [stopEditButton, setStopEditButton] = useState(faXmark);
  const [tableName, setTableName] = useState(table.name);
  const [edit, setEdit] = useState(false);

  const dataService = LocalDataService.getFromLocalOrNew();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableName(event.target.value);
    setStopEditButton(
      event.target.value !== table.name && event.target.value !== ""
        ? faCheck
        : faXmark
    );
  };

  const onNameSave = () => {
    if (tableName !== table.name && tableName !== "") {
      tableService.setTableName(table.key, tableName);
    } else {
      setTableName(table.name);
    }
    setEdit(false);
    setFileIcon(defaultTableIcon);
  };

  const onNameCancel = () => {
    setTableName(table.name);
    setEdit(false);
    setFileIcon(defaultTableIcon);
  };

  const onDelete = () => {
    // ask for confirmation
    onNameCancel();
    if (confirm("Are you sure you want to delete this table?")) {
      tableService.deleteTable(table.key);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onNameCancel();
    }
  }, []);

  const handleOnClick = () => {
    if (!edit && tableIsActive) {
      setEdit(true);
      setFileIcon(faXmark);
    }
    tableService.setActivePageUuid(table.key);
    // TODO: placeholder only
    // dataService.fetchTableByName(table.name).then((data) => {
    //   alert(
    //     `PLACEHOLDER UNTIL WE CAN DISPLAY TABLES\n\n ${JSON.stringify(
    //       data,
    //       null,
    //       2
    //     )}`
    //   );
    // });
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <div
      className={"grid grid-cols-7 hover:scale-105 hover:shadow-lg" + shadow}
    >
      <a
        // the replace will remove the project id: p1_example -> example
        href={`/#/tables/${table.key.replace(/^p.*_/, "")}`}
        onClick={handleOnClick}
        className="col-span-6 items-center px-4 py-2 text-gray-500  hover:text-gray-900"
      >
        <div>
          {!edit && (
            <>
              <FontAwesomeIcon
                className={animation}
                onMouseEnter={() => setFileIcon(faPen)}
                onMouseLeave={() => setFileIcon(defaultTableIcon)}
                icon={fileIcon}
                onClick={() => {
                  setEdit(true), setStopEditButton(faXmark);
                }}
              />
              <span className="w-60  ml-3 mr-3 text-sm font-medium">
                {" "}
                {table.name} {}
              </span>
            </>
          )}
          {edit && (
            <div className="flex mt-1">
              <FontAwesomeIcon
                className="hover:scale-125"
                icon={stopEditButton}
                onClick={onNameSave}
              />
              <FontAwesomeIcon
                className="px-2 hover:scale-125"
                icon={faTrash}
                onClick={onDelete}
              />
              <form onSubmit={onNameSave} className="w-px flex">
                <input
                  className="text-sm appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  size={14}
                  onChange={onInputChange}
                  value={tableName}
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default TableItem;
