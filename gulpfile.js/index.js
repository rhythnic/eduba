const {
  develop,
  localDht,
  developPeer1,
  developPeer2,
  developRenderer,
  cleanDev,
} = require("./develop");
const { build, cleanBuild, runBuild } = require("./build");
const { make, cleanMake } = require("./make");

module.exports = {
  develop,
  peer1: developPeer1,
  peer2: developPeer2,
  renderer: developRenderer,
  dht: localDht,
  build,
  cleanBuild,
  runBuild,
  make,
  cleanMake,
  cleanDev,
};
