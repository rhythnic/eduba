const builder = require("electron-builder");
const { rm } = require("fs/promises");

const Platform = builder.Platform;

const DIST_DIR = "./dist";

async function make() {
  await builder.build({
    targets: Platform.LINUX.createTarget("AppImage"),
    config: {
      appId: "site.eduba.app",
    },
  });
}

function cleanMake() {
  return rm(DIST_DIR, { recursive: true, force: true });
}

module.exports = {
  make,
  cleanMake,
};
