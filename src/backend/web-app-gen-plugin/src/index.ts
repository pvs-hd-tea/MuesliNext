import { PluginLoader } from "@intutable/core";

import { select } from "@intutable/database/dist/requests";
import initializeData from "./initializeData";

let core: PluginLoader;

/**
 * Entry point for the plugin
 * @param {PluginLoader} plugins - PluginLoader - this is the object that contains
 * all the plugins that are loaded.
 */
export async function init(plugins: PluginLoader) {
  core = plugins;

  const exampleTable = await getTableId("example");
  if (!exampleTable) {
    console.log(`table "example" not found => assuming first start.`);
    initializeData(core);
  }
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
