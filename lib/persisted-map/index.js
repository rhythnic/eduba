/**
 * PersistedMap replicates the Map API as async methods that persist.
 */

class PersistedMap {
  /**
   *
   * @param {object} spec
   * @param {fn} spec.storage - Utf8File interface
   */
  constructor({ storage }) {
    this.state = new Map();
    this.storage = storage;
    this.ready = this._load();
  }

  async has(key) {
    await this.ready;
    return this.state.has(key);
  }

  async get(key, fallbackValue) {
    await this.ready;
    const value = this.state.get(key);
    return typeof value === "undefined" ? fallbackValue : value;
  }

  async set(key, value) {
    await this.ready;
    this.state.set(key, value);
    await this._save();
  }

  async delete(key) {
    await this.ready;
    this.state.delete(key);
    await this._save();
  }

  async keys() {
    await this.ready;
    return this.state.keys();
  }

  async _load() {
    if (!this.storage) return;
    try {
      this.state = new Map(JSON.parse(await this.storage.read()));
    } catch (err) {
      console.error("Failed to load persisted map", err);
    }
  }

  async _save() {
    if (!this.storage) return;
    await this.storage.write(JSON.stringify(Array.from(this.state)));
  }
}

module.exports = {
  PersistedMap,
};
