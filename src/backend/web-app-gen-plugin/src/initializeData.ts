import { PluginLoader } from "@intutable/core";
import { insert } from "@intutable/database/dist/requests";

/**
 * Initializes the database with default data
 * @param {PluginLoader} core - PluginLoader
 */
export default async function initializeData(core: PluginLoader) {
  // TODO: proper table creation (define columns etc.)
  // TODO: initialize Tables (default admin user,...)
  await core.events.request(
    insert("tables", {
      key: "lectures",
      name: "Lectures",
      // ownerId: "1", //<- TODO: for user-authentication plugin
    })
  );
  await core.events.request(
    insert("tables", {
      key: "exercises",
      name: "Exercises",
      // ownerId: "1",
    })
  );
}
