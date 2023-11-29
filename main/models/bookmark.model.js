const {
  assert,
  object,
  string,
  optional,
  enums,
  pattern,
} = require("superstruct");
const { Entity } = require("../lib/holepunch/index.js");
const { BookmarkType } = require("../enums.js");

const bookmarkHrefRegex = /[0-9a-z]{52}\/articles\/[0-9a-z_-]+/i;

class Bookmark extends Entity {
  static ID = () => `${Date.now()}`;

  validate() {
    super.validate();

    assert(
      this,
      object({
        type: enums(Object.values(BookmarkType)),
        title: string(),
        parent: optional(pattern(string(), /[0-9]{13}/)),
        href: optional(pattern(string(), bookmarkHrefRegex)),
      })
    );
  }
}

module.exports = {
  Bookmark,
  bookmarkHrefRegex,
};
