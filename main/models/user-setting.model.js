const { assert, object, string, array, any } = require("superstruct");
const { Entity } = require("../lib/holepunch/index.js");

class UserSetting extends Entity {
  validate() {
    super.validate();

    assert(
      this,
      object({
        tags: array(string()),
        value: any(),
      })
    );
  }
}

module.exports = {
  UserSetting,
};
