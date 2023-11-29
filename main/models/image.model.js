const { assert, object, string, array, enums } = require("superstruct");
const { extname } = require("path");
const { Entity } = require("../lib/holepunch");
const { ImageExtension } = require("../enums");

class Image extends Entity {
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
        ext: enums(Object.values(ImageExtension)),
        alt: string(),
        tags: array(string()),
      })
    );
  }

  setExtension(file) {
    this.ext = extname(file);
    if (this.ext === ".jpg") {
      this.ext = ".jpeg";
    }
  }
}

module.exports = {
  Image,
};
