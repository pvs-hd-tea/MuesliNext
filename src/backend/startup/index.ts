import { Core, EventSystem } from "@intutable/core";
import net from "net";
import path from "path";
import process from "process";

const PG_PORT = 5432;
const RETRIES = Math.pow(2, 30);

/* An array of paths to the plugins that the Core instance will load. */
const PLUGIN_PATHS = [
  path.join(process.cwd(), "node_modules/@intutable/*"),
  path.join(__dirname, "../../web-app-gen-plugin"),
];

main();

/**
 * `main` waits for the database to be ready, then creates a
 * new {@link EventSystem} and {@link Core} instance
 * Since we have the HTTP plugin installed, it will keep
 * running and listen for requests.
 */
async function main() {
  await waitForDatabase().catch((e) => crash<Core>(e));
  const events: EventSystem = new EventSystem(true); // debug mode
  await Core.create(PLUGIN_PATHS, events);
}

/**
 * It waits for the database to be ready
 * @returns A promise that resolves to a boolean value.
 */
async function waitForDatabase() {
  let connected = false;
  let lastError: unknown;
  let retries = RETRIES;
  while (retries > 0 && !connected) {
    console.log(`${path.basename(__filename)}: waiting for database...`);
    console.log(`${path.basename(__filename)}: retries: ${retries}`);
    await testPort(PG_PORT)
      .then(() => {
        connected = true;
      })
      .catch((e) => {
        lastError = e;
      });
    await new Promise((res) => setTimeout(res, 3000));
    retries--;
  }
  if (connected) {
    console.log("connected to database");
    return;
  } else {
    return Promise.reject({
      error: {
        message: "could not connect to database",
        reason: lastError,
      },
    });
  }
}

/**
 * It creates a socket connection to the given port and host, and returns a promise
 * that resolves if the connection is successful, and rejects if it is not
 * @param {number} port - The port to test
 * @param {string} [host] - The hostname or IP address to connect to. Defaults to
 * localhost.
 * @returns A promise that resolves if the port is open and rejects if the port is
 * closed.
 */
async function testPort(port: number, host?: string) {
  let socket: net.Socket;
  return new Promise((res, rej) => {
    socket = net.createConnection(port, host);
    socket
      .on("connect", function (e: Event) {
        res(e);
        socket.destroy();
      })
      .on("error", function (e: Event) {
        rej(e);
        socket.destroy();
      });
  });
}

/**
 * Crash takes an Error and returns nothing.
 * @param {Error} e - Error
 * @returns the templated object
 */
function crash<A>(e: Error): A {
  console.log(e);
  return process.exit(1);
}
