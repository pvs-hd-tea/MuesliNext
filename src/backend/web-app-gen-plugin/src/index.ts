/**
 * This plugin is intended be used as a configurable backend for a web app generator
 * It can be used to:
 * Done:
 * Todo:
 * - create new project
 * - create pages
 * - create tables
 */
import { PluginLoader } from "@intutable/core";

import { insert, select } from "@intutable/database/dist/requests";

import { createExampleSchema, insertExampleData } from "./example/load";

let core: PluginLoader;
const ADMIN_NAME = "admin@admin.com";
let adminId: number;

export async function init(plugins: PluginLoader) {
  core = plugins;

  // in init.sql until db supports default values
  // await configureColumnAttributes()

  // for dev mode, create some custom data
  //if (process.env["npm_lifecycle_event"] === "dev") {
  console.log("dev mode enabled");
  const maybeAdminId = await getAdminId();
  if (maybeAdminId === null) {
    adminId = await createAdmin();
    console.log("set up admin user");
  } else {
    adminId = maybeAdminId;
    console.log("admin user already present");
  }

  // testing data
  if (maybeAdminId === null) {
    console.log("creating and populating example schema");
    await createExampleSchema(core, adminId);
    await insertExampleData(core);
  } else console.log("skipped creating example schema");
  //}
  console.log("web-app-gen-plugin init done");

  core
    .listenForRequests("web-app-gen")
    .on("get-status", getStatus)
    .on("insert-into-table", insertIntoTable);
}

type Status = {
  statusCode: number;
};

async function getStatus(): Promise<Status> {
  return {
    statusCode: 200,
  }; // Placeholder
}

// async function insertIntoTable(table: string, values: Record<string, unknown>) {
//   return await core.events.request(
//     insert("p1_example", {
//       number: 69,
//       string: "new",
//       boolean: true,
//     })
//   );
// }
type tableInsertProps = {
  table: string;
  values: Record<string, unknown>;
};
async function insertIntoTable(props: tableInsertProps) {
  return await core.events.request(insert(props.table, props.values));
}

async function getAdminId(): Promise<number | null> {
  const userRows = await core.events.request(
    select("users", {
      columns: ["_id"],
      condition: ["email", ADMIN_NAME],
    })
  );
  if (userRows.length > 1)
    return Promise.reject("fatal: multiple users with same name exist");
  else if (userRows.length === 1) return userRows[0]["_id"];
  else return null;
}

/** Create admin user */
async function createAdmin(): Promise<number> {
  await core.events.request(
    insert("users", {
      email: ADMIN_NAME,
      password:
        "$argon2i$v=19$m=4096,t=3,p=1$vzOdnV+KUtQG3va/nlOOxg$vzo1JP16rQKYmXzQgYT9VjUXUXPA6cWHHAvXutrRHtM",
    })
  );
  return getAdminId().then((definitelyNumber) => definitelyNumber ?? -1);
}
