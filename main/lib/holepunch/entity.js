/**
 * Entity
 * Base class for Models that are persisted with DocumentRepository
 */

const EntityMeta = Symbol("meta");

const dbIdRegex = /[0-9a-z]{52}/i;

class Entity {
  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    this[EntityMeta] = {};

    if (props) {
      const { dbId, id, ...rest } = props;
      Object.assign(this, rest);
      this[EntityMeta].id = id;
      this[EntityMeta].dbId = dbId;
    }
  }

  generateId() {
    this.meta("id", this.constructor.ID());
  }

  meta(key, value) {
    if (typeof key === "undefined") {
      return this[EntityMeta];
    }
    if (typeof value === "undefined") {
      return this[EntityMeta][key];
    }
    this[EntityMeta][key] = value;
  }

  validate() {
    const id = this.meta("id");

    if (!id || typeof id !== "string" || !id.length) {
      throw new TypeError("Invalid Entity id.");
    }

    if (!dbIdRegex.test(this.meta("dbId"))) {
      throw new TypeError("Invalid Entity dbId.");
    }

    return this;
  }
}

module.exports = {
  dbIdRegex,
  Entity,
  EntityMeta,
};
