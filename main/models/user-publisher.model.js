const { assert, object, boolean, string } = require("superstruct");
const { Entity } = require("../lib/holepunch/index.js");

class UserPublisher extends Entity {
  validate() {
    super.validate();

    assert(
      this,
      object({
        coreName: string(),
        pinned: boolean(),
      })
    );
  }
}

module.exports = {
  UserPublisher,
};
