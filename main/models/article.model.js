const {
  assert,
  object,
  string,
  optional,
  array,
  enums,
} = require("superstruct");
const { extname } = require("path");
const { Entity } = require("../lib/holepunch");
const { ArticleContentExtension } = require("../enums");

class Article extends Entity {
  static ID = () => `${Date.now()}`;

  get fileBase() {
    return `${this.meta("id")}${this.ext}`;
  }

  validate() {
    super.validate();

    assert(
      this,
      object({
        ext: enums(Object.values(ArticleContentExtension)),
        createdAt: string(),
        title: optional(string()),
        tags: array(string()),
      })
    );
  }

  setExtension(file) {
    this.ext = extname(file);
  }
}

module.exports = {
  Article,
};
