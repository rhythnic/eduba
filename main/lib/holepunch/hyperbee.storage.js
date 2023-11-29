const streamToArray = require("stream-to-array");
const { readFile } = require("node:fs/promises");
const { ValueEncoding, KeyEncoding } = require("./enums");
const { DbStorage } = require("./db.storage");
const Hyperbee = require("hyperbee");

class HyperbeeStorage extends DbStorage {
  async _db(bee) {
    if (bee instanceof Hyperbee) {
      return bee;
    }

    bee = await this.dbService.db(bee);

    return bee.sub(this.root, {
      keyEncoding: KeyEncoding.Utf8,
      valueEncoding: this.valueEncoding,
      sep: Buffer.from("/"),
    });
  }

  _normalizeRoot(root) {
    return root;
  }

  _normalizeKey(base) {
    return base;
  }

  async _put(bee, id, value) {
    bee = await this.db(bee);
    return bee.put(id, value);
  }

  async _putFile(bee, key, file) {
    bee = await this.db(bee);

    const opts =
      this.valueEncoding === ValueEncoding.Binary ? {} : { encoding: "utf-8" };

    let content = await readFile(file, opts);

    if (content && this.valueEncoding === ValueEncoding.Json) {
      content = JSON.parse(content);
    }

    setImmediate(() =>
      bee.put(key, content).catch((err) => this.emit("error", err))
    );
  }

  async _get(bee, id) {
    bee = await this.db(bee);
    const result = await bee.get(id);
    return result && result.value;
  }

  async _find(bee) {
    return streamToArray(bee.createReadStream());
  }
}

module.exports = {
  HyperbeeStorage,
};
