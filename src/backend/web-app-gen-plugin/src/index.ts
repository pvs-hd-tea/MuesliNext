import { CoreRequest, CoreResponse, PluginLoader } from "@intutable/core";
import { ColumnOption, ColumnType } from "@intutable/database/dist/column";

import { select } from "@intutable/database/dist/requests";
import {
  createProject,
  createTableInProject,
} from "@intutable/project-management/dist/requests";
import initializeData from "./initializeData";

let core: PluginLoader;
const CHANNEL = "web-app-gen";

/**
 * Entry point for the plugin
 * @param {PluginLoader} plugins - PluginLoader - this is the object that contains
 * all the plugins that are loaded.
 */
export async function init(plugins: PluginLoader) {
  core = plugins;

  core
    .listenForRequests(CHANNEL)
    .on("getStatus", getStatus)
    .on("createWebAppProject", createWebAppProject);

  const exampleTable = await getTableId("example");
  if (!exampleTable) {
    initializeData(core);
    console.log(`table "example" not found => assuming first start.`);
    await createWebAppProject({
      sessionId: "1",
      userId: 1,
      name: "example project",
      channel: CHANNEL,
      method: "",
    });
  }
}

async function getStatus(): Promise<CoreResponse> {
  return Promise.resolve({ message: `online` });
}

async function createWebAppProject({
  sessionId,
  userId,
  name,
}: CoreRequest): Promise<CoreResponse> {
  // Create project
  const projectId = await core.events.request(
    createProject(sessionId, userId, name)
  );

  // Create tables
  await core.events.request(
    createTableInProject(sessionId, userId, projectId, "settings", [
      { name: "name", type: ColumnType.string },
      { name: "homePath", type: ColumnType.string },
    ])
  );
  return { message: `created web app project with id ${projectId}` };
}

/**
 * Tries to find the id of the table with specified key
 * @param {string} tableKey - The key of the table you want to get the ID of.
 * @returns A promise that resolves to a number or null.
 */
async function getTableId(tableKey: string): Promise<number | null> {
  const userRows = await core.events.request(
    select("users", {
      columns: ["_id"],
      condition: ["email", tableKey],
    })
  );
  if (userRows.length > 1)
    return Promise.reject("fatal: multiple users with same name exist");
  else if (userRows.length === 1) return userRows[0]["_id"];
  else return null;
}

/**
 * This function is called when the application is stopped.
 */
export async function close() {
  // Optional code that gets executed when stopping the application
}
