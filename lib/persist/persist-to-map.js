const { Persist } = require("./persist");

class PersistToMap extends Persist {
  constructor(map, key, defaultValue = "") {
    super();
    this.map = map;
    this.key = key;
    this.defaultValue = defaultValue;

    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }

  async read() {
    const value = await this.map.get(this.key);
    return typeof value === "undefined" ? this.defaultValue : value;
  }

  async write(value) {
    await this.map.set(this.key, value);
  }
}

module.exports = {
  PersistToMap,
};
