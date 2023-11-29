/**
 * Build app binaries
 */

const { series, parallel, src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const { spawn } = require("child_process");
const { rm } = require("fs/promises");
const { runApp, appEnv } = require("./utils");

const MAIN_DIR = "./main";
const BUILD_DIR = "./app";

/**
 * Build the Renderer single page application
 */
function buildRenderer() {
  return spawn("yarn", ["build"], {
    cwd: "./renderer",
    stdio: "inherit",
  });
}

function buildMain() {
  // return src(`${MAIN_DIR}/**/*.js`).pipe(dest(BUILD_DIR));
  return src(`${MAIN_DIR}/**/*.js`).pipe(uglify()).pipe(dest(BUILD_DIR));
}

function cleanBuild() {
  return rm(BUILD_DIR, { recursive: true, force: true });
}

const build = series(cleanBuild, parallel(buildRenderer, buildMain));

function runBuild() {
  return runApp(
    BUILD_DIR,
    appEnv(3000, "./data/build-test", { MAIN_WINDOW_URL: void 0 })
  );
}

module.exports = {
  build,
  cleanBuild,
  runBuild,
};
