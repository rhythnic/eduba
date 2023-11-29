const { createReadStream } = require("node:fs");
const streamToArray = require("stream-to-array");
const pump = require("pump");
const { ValueEncoding } = require("./enums");
const { DbStorage } = require("./db.storage");

class HyperdriveStorage extends DbStorage {
  async _db(db) {
    return this.dbService.db(db);
  }

  _normalizeRoot(root) {
    return root.startsWith("/") ? root : `/${root}`;
  }

  _normalizeKey(key) {
    return this.valueEncoding === ValueEncoding.Json
      ? `${this.root}/${key}.json`
      : `${this.root}/${key}`;
  }

  async _put(drive, key, value) {
    if (this.valueEncoding === ValueEncoding.Json) {
      value = Buffer.from(JSON.stringify(value), "utf-8");
    } else if (this.valueEncoding === ValueEncoding.Utf8) {
      value = Buffer.from(value, "utf-8");
    }
    drive = await this.db(drive);
    await drive.put(this._normalizeKey(key), value);
  }

  async _putFile(drive, key, file) {
    drive = await this.db(drive);

    const source = createReadStream(file);
    const dest = drive.createWriteStream(this._normalizeKey(key));

    pump(source, dest, function (err) {
      if (err) this.emit("error", err);
    });
  }

  async _get(drive, key) {
    drive = await this.db(drive);
    const buffer = await drive.get(this._normalizeKey(key));

    if (this.valueEncoding === ValueEncoding.Utf8) {
      return buffer ? buffer.toString("utf-8") : "";
    }

    if (buffer && this.valueEncoding === ValueEncoding.Json) {
      return JSON.parse(buffer.toString("utf-8"));
    }

    return buffer;
  }

  async _find(drive) {
    let keys = await streamToArray(drive.readdir(this.root));

    if (this.valueEncoding === ValueEncoding.Json) {
      keys = keys
        .filter((k) => k.endsWith(".json"))
        .map((k) => k.slice(0, -".json".length));
    }

    return Promise.all(
      keys.map(async (key) => ({
        key,
        value: await this.get(drive, key),
      }))
    );
  }
}

module.exports = {
  HyperdriveStorage,
};
