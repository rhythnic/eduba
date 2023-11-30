/**
 * Providers for holepunch functionality
 */

const Corestore = require("corestore");
const Hyperswarm = require("hyperswarm");
const { fromClass } = require("../../lib/app");
const config = require("../config");
const Constants = require("../constants");
const {
  HyperbeeService,
  HyperdriveService,
  HyperdriveStorage,
  HyperbeeStorage,
  ValueEncoding,
} = require("../lib/holepunch");

const corestore = new Corestore(config.holepunch.corestoreDirectory).namespace(
  Constants.App
);

const swarm = new Hyperswarm({
  bootstrap: config.holepunch.dhtBootstrapNodes,
});

swarm.on("connection", (conn) => {
  corestore.replicate(conn);
});

module.exports = {
  corestore,
  swarm,

  driveService: fromClass(HyperdriveService, {
    root: Constants.App,
    store: corestore,
  }),

  beeService: fromClass(HyperbeeService, {
    root: Constants.App,
    store: corestore,
  }),

  beeJsonStorage: fromClass(HyperbeeStorage, {
    dbService: Symbol("beeService"),
    root: `/${Constants.App}/${Constants.DB}`,
    valueEncoding: ValueEncoding.Json,
  }),

  driveJsonStorage: fromClass(HyperdriveStorage, {
    dbService: Symbol("driveService"),
    root: `/${Constants.App}/${Constants.DB}`,
    valueEncoding: ValueEncoding.Json,
  }),

  driveFileStorage: fromClass(HyperdriveStorage, {
    dbService: Symbol("driveService"),
    root: `/${Constants.App}/${Constants.Files}`,
    valueEncoding: ValueEncoding.Binary,
  }),

  driveTextStorage: fromClass(HyperdriveStorage, {
    dbService: Symbol("driveService"),
    root: `/${Constants.App}/${Constants.Text}`,
    valueEncoding: ValueEncoding.Utf8,
  }),
};
