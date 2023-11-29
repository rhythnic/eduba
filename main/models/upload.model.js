const { assert, object, string, optional } = require("superstruct");
const { extname } = require("path");
const { Entity } = require("../lib/holepunch");

class Upload extends Entity {
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
        ext: optional(string()),
        fileName: optional(string()),
      })
    );
  }

  setExtension(file) {
    this.ext = extname(file);
  }
}

module.exports = {
  Upload,
};
