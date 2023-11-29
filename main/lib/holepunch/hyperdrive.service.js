const Hyperdrive = require("hyperdrive");
const { DbService } = require("./db.service");

class HyperdriveService extends DbService {
  _isDb(db) {
    return db instanceof Hyperdrive;
  }

  _db(core, store) {
    return new Hyperdrive(store, core.key);
  }

  _exists(db, key) {
    return db.exists(key);
  }

  _diff(current, previous) {
    return current.diff(previous.version, this.root);
  }
}

module.exports = {
  HyperdriveService,
};
