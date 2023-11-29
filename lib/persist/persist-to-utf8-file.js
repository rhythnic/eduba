const { readFile, writeFile, mkdir } = require("node:fs/promises");
const { dirname } = require("node:path");
const { Persist } = require("./persist");

class PersistToUtf8File extends Persist {
  constructor(path, defaultValue = "") {
    super();
    this.path = path;
    this.defaultValue = defaultValue;

    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }

  async read() {
    try {
      return await readFile(this.path, { encoding: "utf-8" });
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
      return this.defaultValue;
    }
  }

  async write(value) {
    try {
      await writeFile(this.path, value, { encoding: "utf-8" });
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
      await mkdir(dirname(this.path), { recursive: true });
      await writeFile(this.path, value, { encoding: "utf-8" });
    }
  }
}

module.exports = {
  PersistToUtf8File,
};
