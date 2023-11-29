const { assert, object, string, array, enums } = require("superstruct");
const { extname } = require("path");
const { Entity } = require("../lib/holepunch");
const { AudioExtension } = require("../enums");

class Audio extends Entity {
  static ID = () => `${Date.now()}`;

  get fileBase() {
    return `${this.meta("id")}${this.ext}`;
  }

  validate() {
    super.validate();

    assert(
      this,
      object({
        createdAt: string(),
        ext: enums(Object.values(AudioExtension)),
        title: string(),
        tags: array(string()),
      })
    );
  }

  setExtension(file) {
    this.ext = extname(file);
  }
}

module.exports = {
  Audio,
};
