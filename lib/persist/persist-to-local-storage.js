const { Persist } = require("./persist");

class PersistToLocalStorage extends Persist {
  constructor(key, defaultValue = "") {
    super();
    this.key = key;
    this.defaultValue = defaultValue;

    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }

  async read() {
    const value = window.localStorage.getItem(this.key);
    return typeof value === "undefined" ? this.defaultValue : value;
  }

  async write(value) {
    window.localStorage.setItem(this.key, value);
  }
}

module.exports = {
  PersistToLocalStorage,
};
