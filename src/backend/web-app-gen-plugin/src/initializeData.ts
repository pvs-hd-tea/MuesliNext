import { PluginLoader } from "@intutable/core";
import { Column, ColumnType } from "@intutable/database/dist/column";
import { insert } from "@intutable/database/dist/requests";
import {
  createProject,
  createTableInProject,
} from "@intutable/project-management/dist/requests";

/**
 * Initializes the database with default data
 * @param {PluginLoader} core - PluginLoader
 */
export default async function initializeData(core: PluginLoader) {
  // TODO: proper table creation (define columns etc.)
  // TODO: initialize Tables (default admin user,...)
  // await core.events.request(
  //   insert("tables", [
  //     {
  //       key: "lectures",
  //       name: "Lectures",
  //       // ownerId: "1", //<- TODO: for user-authentication plugin
  //     },
  //     {
  //       key: "exercises",
  //       name: "Exercises",
  //       // ownerId: "1",
  //     },
  //   ])
  // );

  // create default admin
  await core.events.request(
    insert("users", {
      email: "admin@example.com",
      password:
        "$argon2i$v=19$m=4096,t=3,p=1$vzOdnV+KUtQG3va/nlOOxg$vzo1JP16rQKYmXzQgYT9VjUXUXPA6cWHHAvXutrRHtM",
    })
  );

  // TODO: correct values
  const sessionId = "default";
  const userId = 1;
  const projectId = 1;

  await core.events.request(
    createProject(sessionId, userId, "example project")
  );

  const defaultColumns: Column[] = [
    { name: "value", type: ColumnType.integer },
    { name: "bool", type: ColumnType.boolean },
    { name: "string", type: ColumnType.string },
  ];

  await core.events.request(
    createTableInProject(
      sessionId,
      userId,
      projectId,
      "example table",
      defaultColumns
    )
  );
}
