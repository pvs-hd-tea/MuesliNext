/**
 * Specifications of example data.
 */
import {
  Column,
  ColumnType,
  ColumnOption,
} from "@intutable/database/dist/column";
import {
  TableDescriptor,
  ViewDescriptor,
} from "@intutable/lazy-views/dist/types";

export const PK_COLUMN = "_id";

export type JoinSpec = {
  table: string;
  fkColumn: Column;
  pkColumn: string;
  linkColumns: { name: string; attributes: Record<string, any> }[];
};
export type TableSpec = {
  name: string;
  columns: { baseColumn: Column; attributes: Record<string, any> }[];
  joins: JoinSpec[];
};
export type Table = {
  baseTable: TableDescriptor;
  tableView: ViewDescriptor;
  filterView: ViewDescriptor;
};

export const METADATA: TableSpec = {
  name: "internal#metadata",
  columns: [
    {
      baseColumn: {
        name: "_id",
        type: ColumnType.increments,
        options: [ColumnOption.primary],
      },
      attributes: {
        displayName: "ID",
        _cellContentType: "number",
      },
    },
    {
      baseColumn: {
        name: "visible",
        type: ColumnType.boolean,
      },
      attributes: {
        displayName: "Visible",
        userPrimary: 1,
        _cellContentType: "boolean",
      },
    },
  ],
  joins: [],
};

export const METADATA_DATA = [
  {
    visible: false,
  },
];

export const PAGES: TableSpec = {
  name: "internal#pages",
  columns: [
    {
      baseColumn: {
        name: "_id",
        type: ColumnType.increments,
        options: [ColumnOption.primary],
      },
      attributes: {
        displayName: "ID",
        _cellContentType: "number",
      },
    },
    {
      baseColumn: {
        name: "name",
        type: ColumnType.string,
      },
      attributes: {
        displayName: "Name",
        userPrimary: 1,
        _cellContentType: "string",
      },
    },
    {
      baseColumn: {
        name: "path",
        type: ColumnType.string,
      },
      attributes: {
        displayName: "Path",
        userPrimary: 1,
        _cellContentType: "string",
      },
    },
    {
      baseColumn: {
        name: "content",
        type: ColumnType.string,
        options: [ColumnOption.nullable],
      },
      attributes: {
        displayName: "Content",
        _cellContentType: "string",
      },
    },
  ],
  joins: [
    {
      table: "internal#metadata",
      fkColumn: {
        name: "j#1_fk",
        type: ColumnType.integer,
      },
      pkColumn: "_id",
      linkColumns: [
        {
          name: "visible",
          attributes: {
            displayName: "Visible",
            editable: 0,
            _kind: "link",
            _cellContentType: "boolean",
          },
        },
      ],
    },
  ],
};

export const PAGES_DATA = [
  {
    name: "Example",
    path: "/example",
    content: `blocks:[
      {
        type: "header",
        data: {
          text: "This is an example page.",
          level: 2,
        },
      },
      {
        type: "paragraph",
        data: { text: "Start writing here.." },
      },
    ]`,
    "j#1_fk": 1,
  },
];

export const SETTINGS: TableSpec = {
  name: "internal#settings",
  columns: [
    {
      baseColumn: {
        name: "_id",
        type: ColumnType.increments,
        options: [ColumnOption.primary],
      },
      attributes: {
        displayName: "ID",
        _cellContentType: "number",
      },
    },
    {
      baseColumn: {
        name: "name",
        type: ColumnType.string,
      },
      attributes: {
        displayName: "App name",
        userPrimary: 1,
        _cellContentType: "string",
      },
    },
    {
      baseColumn: {
        name: "homePath",
        type: ColumnType.string,
      },
      attributes: {
        displayName: "homePath",
        userPrimary: 1,
        _cellContentType: "string",
      },
    },
    {
      baseColumn: {
        name: "backendUrl",
        type: ColumnType.string,
      },
      attributes: {
        displayName: "backendUrl",
        _cellContentType: "string",
      },
    },
  ],
  joins: [],
};

export const SETTINGS_DATA = [
  {
    name: "Example App",
    homePath: "home",
    backendUrl: "http://localhost:8080",
  },
];
