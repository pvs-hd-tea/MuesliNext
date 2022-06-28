import { PluginLoader } from "@intutable/core";
import { insert } from "@intutable/database/dist/requests";
import {
  ProjectDescriptor,
  TableDescriptor,
  TableInfo,
  ColumnDescriptor,
} from "@intutable/project-management/dist/types";
import {
  createProject,
  createTableInProject,
  getTableInfo,
  createColumnInTable,
} from "@intutable/project-management/dist/requests";
import { requests as v_req } from "@intutable/lazy-views/";
import { types as v_types } from "@intutable/lazy-views";
import { tableId, viewId } from "@intutable/lazy-views";

import { emptyRowOptions, defaultRowOptions } from "../defaults";

import {
  TableSpec,
  JoinSpec,
  Table,
  METADATA,
  METADATA_DATA,
  PAGES,
  PAGES_DATA,
  SETTINGS,
  SETTINGS_DATA,
} from "./schema";

let metadata: Table;
let pages: Table;
let settings: Table;
let simpleTables: Table[];

const SESSION_ID = "session";

export async function createExampleSchema(
  core: PluginLoader,
  adminId: number
): Promise<void> {
  const project: ProjectDescriptor = (await core.events.request(
    createProject(SESSION_ID, adminId, "example WebApp")
  )) as ProjectDescriptor;
  metadata = await createTable(core, adminId, project.id, METADATA);
  simpleTables = [metadata];
  pages = await createTable(core, adminId, project.id, PAGES);
  settings = await createTable(core, adminId, project.id, SETTINGS);
}
async function createTable(
  core: PluginLoader,
  userId: number,
  projectId: number,
  table: TableSpec
): Promise<Table> {
  const baseTable: TableDescriptor = (await core.events.request(
    createTableInProject(
      SESSION_ID,
      userId,
      projectId,
      table.name,
      table.columns.map((c) => c.baseColumn)
    )
  )) as TableDescriptor;
  const tableInfo = (await core.events.request(
    getTableInfo(SESSION_ID, baseTable.id)
  )) as TableInfo;
  const viewColumns: v_types.ColumnSpecifier[] = table.columns.map((c) => {
    const baseColumn =
      tableInfo.columns.find((parent) => parent.name === c.baseColumn.name) ??
      undefined;
    return {
      parentColumnId: baseColumn.id,
      attributes: c.attributes,
    };
  });
  const tableView = (await core.events.request(
    v_req.createView(
      tableId(baseTable.id),
      table.name,
      { columns: viewColumns, joins: [] },
      emptyRowOptions(),
      userId
    )
  )) as v_types.ViewDescriptor;
  // add joins
  await Promise.all(
    table.joins.map((j) => addJoin(core, baseTable, tableView, j))
  );

  const tableViewInfo = (await core.events.request(
    v_req.getViewInfo(tableView.id)
  )) as v_types.ViewInfo;
  const filterView = await core.events.request(
    v_req.createView(
      viewId(tableView.id),
      "Standard",
      { columns: [], joins: [] },
      defaultRowOptions(tableViewInfo.columns),
      userId
    )
  );
  const tableDescriptors = { baseTable, tableView, filterView };
  return tableDescriptors;
}

async function addJoin(
  core: PluginLoader,
  baseTable: TableDescriptor,
  tableView: v_types.ViewDescriptor,
  join: JoinSpec
): Promise<void> {
  const fk = (await core.events.request(
    createColumnInTable(
      SESSION_ID,
      baseTable.id,
      join.fkColumn.name,
      join.fkColumn.type
    )
  )) as ColumnDescriptor;
  const foreignTable =
    simpleTables.find((t) => t.tableView.name === join.table) ?? undefined;
  const info = (await core.events.request(
    v_req.getViewInfo(foreignTable.tableView.id)
  )) as TableInfo;
  const pk = info.columns.find((c) => c.name === join.pkColumn) ?? undefined;
  const foreignColumns = join.linkColumns.map((l) => {
    const parentColumn =
      info.columns.find((c) => c.name === l.name) ?? undefined;
    return {
      parentColumnId: parentColumn.id,
      attributes: l.attributes,
    };
  });
  await core.events.request(
    v_req.addJoinToView(tableView.id, {
      foreignSource: viewId(foreignTable.tableView.id),
      on: [fk.id, "=", pk.id],
      columns: foreignColumns,
    })
  );
}

export async function insertExampleData(core: PluginLoader): Promise<void> {
  await Promise.all(
    METADATA_DATA.map((r) =>
      core.events.request(insert(metadata.baseTable.key, r))
    )
  );
  await Promise.all(
    PAGES_DATA.map((r) => core.events.request(insert(pages.baseTable.key, r)))
  );
  await Promise.all(
    SETTINGS_DATA.map((r) =>
      core.events.request(insert(settings.baseTable.key, r))
    )
  );
}
