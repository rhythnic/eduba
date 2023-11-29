const { spawn } = require("child_process");

/**
 * Build the environment for the main electron process
 * @param {string} peerId
 * @param {number} port
 * @returns
 */
function appEnv(port, directory, overrides) {
  // Electron default port and logger port are 3000 and 9000
  // By adding 6000 to port, we can derive both ports from one argument
  return Object.assign(
    {
      PORT: `${port}`,
      LOGGER_PORT: `${port + 6000}`,
      DHT_BOOTSTRAP_NODES: "127.0.0.1:49737",
      LOG_LEVEL: "debug",
      LOGGER_FILE: `${directory}/logs.txt`,
      MACHINE_STATE_FILE: `${directory}/state.json`,
      CORESTORE_DIRECTORY: `${directory}/corestore`,
    },
    overrides,
    process.env
  );
}

function runApp(directory, env) {
  return spawn("./node_modules/.bin/electron", [directory], {
    stdio: "inherit",
    env,
  });
}

module.exports = {
  appEnv,
  runApp,
};
