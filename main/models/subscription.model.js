const { assert, object, string } = require("superstruct");
const { Entity } = require("../lib/holepunch/index.js");

class Subscription extends Entity {
  validate() {
    super.validate();

    assert(
      this,
      object({
        createdAt: string(),
      })
    );
  }
}

module.exports = {
  Subscription,
};
