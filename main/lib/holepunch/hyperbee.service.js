const Hyperbee = require("hyperbee");
const { KeyEncoding } = require("./enums");
const { DbService } = require("./db.service");

class HyperbeeService extends DbService {
  _isDb(db) {
    return db instanceof Hyperbee;
  }

  _db(core) {
    return new Hyperbee(core, { keyEncoding: KeyEncoding.Utf8 });
  }

  _exists(db, key) {
    return db.get(key).then((val) => val != null);
  }

  _diff(current, previous) {
    return current.createDiffStream(previous.version, this.root);
  }
}

module.exports = {
  HyperbeeService,
};
