/**
 * JSON Document Repository API based on DB Storage
 */

const { EntityMeta } = require("./entity");

class DocumentRepository {
  /**
   * Constructor
   * @param {object} params
   * @param {Entity} params.Entity - The model, a class derived from Entity
   * @param {Holepunch} params.holepunch
   * @param {string} params.path
   */
  constructor({ Entity, storage }) {
    this.storage = storage;
    this.Entity = Entity;
  }

  /**
   * Assert that doc is an instance of Entity
   * @param {object} doc
   */
  assertEntityInstance(doc) {
    if (!(doc instanceof this.Entity)) {
      throw new TypeError(`Document is not an instance of ${this.Entity.name}`);
    }
  }

  /**
   * Put the model in storage
   * @param {Entity} model
   * @returns
   */
  async put(model) {
    this.assertEntityInstance(model);
    model.validate();

    const { [EntityMeta]: meta, ...props } = model;

    if (!(meta.dbId && meta.id)) {
      throw new TypeError("dbId and id required to put document");
    }

    await this.storage.put(meta.dbId, meta.id, props);

    return model;
  }

  async get(dbId, id) {
    const db = await this.storage.db(dbId);
    const props = await this.storage.get(db, id);
    return this.toEntity(db, id, props);
  }

  async load(dbId, id) {
    const db = await this.storage.db(dbId);
    const props = await this.storage.load(db, id);
    return this.toEntity(db, id, props);
  }

  async find(dbId, load = false) {
    const db = await this.storage.db(dbId);
    const results = await this.storage.find(db, load);
    return results.map((r) => this.toEntity(db, r.key, r.value));
  }

  /**
   * Delete document
   * @param {Entity} doc
   */
  async delete(dbId, id) {
    await this.storage.delete(dbId, id);
  }

  async deleteMany(dbId, ids) {
    await this.storage.deleteMany(dbId, ids);
  }

  /**
   * Build instance of entity from result
   * @param {*} db
   * @param {*} id
   * @param {*} props
   * @returns
   */
  toEntity(db, id, props) {
    const entity = new this.Entity(props);
    entity.meta("id", id);
    entity.meta("dbId", db.id);
    entity.meta("writable", db.writable);
    entity.meta("found", !!props);
    return entity;
  }
}

module.exports = {
  DocumentRepository,
};
