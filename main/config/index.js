const { BOOTSTRAP_NODES } = require("hyperdht/lib/constants");
const { app: electronApp } = require("electron");
const { join } = require("path");

function dhtBootstrapNodes() {
  const { DHT_BOOTSTRAP_NODES } = process.env;

  if (!DHT_BOOTSTRAP_NODES) {
    return BOOTSTRAP_NODES;
  }

  const nodes = DHT_BOOTSTRAP_NODES.split(",").map((x) => x.trim());

  if (!Array.isArray(nodes)) {
    throw new Error("DHT_BOOTSTRAP_NODES must be a JSON array of strings");
  }

  return nodes;
}

const defaultMainWindowFile = join(__dirname, "../renderer/index.html");
const defaultLoggerFile = join(electronApp.getPath("userData"), "logs.txt");
const defaultMachineStateFile = join(
  electronApp.getPath("userData"),
  "state.json"
);
const defualtCorestoreDirectory = join(
  electronApp.getPath("userData"),
  "corestore"
);

module.exports = {
  holepunch: {
    dhtBootstrapNodes: dhtBootstrapNodes(),
    corestoreDirectory:
      process.env.CORESTORE_DIRECTORY || defualtCorestoreDirectory,
  },
  logger: {
    file: process.env.LOGGER_FILE || defaultLoggerFile,
    level: process.env.LOG_LEVEL || "info",
  },
  machineState: {
    file: process.env.MACHINE_STATE_FILE || defaultMachineStateFile,
  },
  mainWindow: {
    url: process.env.MAIN_WINDOW_URL || "",
    file: process.env.MAIN_WINDOW_FILE || defaultMainWindowFile,
  },
};
