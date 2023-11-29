const { assert, object, string, pattern } = require("superstruct");
const { Entity } = require("../lib/holepunch/index.js");

class Publisher extends Entity {
  validate() {
    super.validate();

    assert(
      this,
      object({
        createdAt: string(),
        article: pattern(string(), /[0-9]{13}/),
      })
    );
  }
}

module.exports = {
  Publisher,
};
