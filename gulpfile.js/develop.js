/***********************************
 * Local Development Orchestration
 ***********************************/
const { spawn } = require("child_process");
const { parallel } = require("gulp");
const { appEnv, runApp } = require("./utils");

const MAIN_DIR = "./main";
const RENDERER_DIR = "./renderer";
const DATA_DIR = "./data";

/**
 * Spawn the renderer development server
 * @TODO bypass yarn
 */
function developRenderer() {
  return spawn("yarn", ["dev"], {
    cwd: RENDERER_DIR,
    stdio: "inherit",
  });
}

/**
 * Spawn the development DHT server
 */
function localDht() {
  return spawn("node", ["dht.js"], { cwd: "./gulpfile.js", stdio: "inherit" });
}

/**
 * Spawn the development main electron process
 */
function runMainDev(port, peerId) {
  return () => {
    const dataDir = `./data/${peerId}`;

    const env = appEnv(port, dataDir, {
      MAIN_WINDOW_URL: "http://localhost:8080",
    });

    return runApp(MAIN_DIR, env);
  };
}

/**
 * Run all development processes in parallel
 */
const develop = parallel(developRenderer, localDht, runMainDev(3000, "peer1"));

function cleanDev() {
  return rm(DATA_DIR, { recursive: true, force: true });
}

module.exports = {
  develop,
  developRenderer,
  localDht,
  developPeer1: runMainDev(3000, "peer1"),
  developPeer2: runMainDev(3001, "peer2"),
  cleanDev,
};
