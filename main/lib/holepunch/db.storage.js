/**
 * Duplicate parts of the hyperdrive and hyperbee APIs
 * based on the DB service
 */

const { parse: parsePath, join: joinPath } = require("node:path");
const { Emitter } = require("../../../lib/emitter");
const { StorageChanged, DbChanged } = require("./events");

class DbStorage extends Emitter {
  constructor({ dbService, root, valueEncoding }) {
    super();

    this.dbService = dbService;
    this.root = this._normalizeRoot(root);
    this.valueEncoding = valueEncoding;
  }

  initialize() {
    this.dbService.on(DbChanged, this._handleDbChange.bind(this));
  }

  async db(db) {
    return this._db(db);
  }

  async put(db, key, value) {
    await this._put(db, key, value);
  }

  async putFile(db, key, file) {
    await this._putFile(db, key, file);
  }

  async get(db, key) {
    return this._get(db, key);
  }

  async find(db, load = false) {
    db = await this.db(db);

    if (load) {
      this.dbService.load(db).catch((err) => this.emit("error", err));
    }

    return this._find(db);
  }

  async load(db, key) {
    db = await this.db(db);
    await this.dbService.waitForKeyToExist(db, this._normalizeKey(key));
    return this.get(db, key);
  }

  async delete(db, key) {
    db = await this.db(db);
    await db.del(this._normalizeKey(key));
  }

  async deleteMany(db, keys) {
    const batch = (await this.db(db)).batch();
    await Promise.all(keys.map((key) => batch.del(this._normalizeKey(key))));
    await batch.flush();
  }

  /**
   * Hyperdrive changed listener
   * Ignore changes unless root starts with this.root
   * @param {object} evt
   * @param {StorageChangeType} evt.type
   * @param {string} evt.key
   * @param {string} evt.dbId
   */
  async _handleDbChange({ type, dbId, key }) {
    if (key.startsWith(this.root)) {
      const parsed = parsePath(key.slice(this.root.length));

      this.emit(StorageChanged, {
        type,
        dbId,
        key,
        dir: parsed.dir,
        base: parsed.base,
        ext: parsed.ext,
        name: parsed.name,
      });
    }
  }

  sub(key) {
    const instance = new this.constructor({
      dbService: this.dbService,
      valueEncoding: this.valueEncoding,
      root: joinPath(this.root, key),
    });
    instance.initialize();
    return instance;
  }
}

module.exports = {
  DbStorage,
};
