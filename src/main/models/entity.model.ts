/**
 * Entity
 * Base class for Models that are persisted with DocumentRepository
 */
import { object, string } from "superstruct";
import { isoString } from "../../lib/common/validators";

export const dbIdRegex = /[0-9a-z]{52}/i;

export class EntityMeta {
  version: string;
  createdAt: string;
}

export class Entity {
  _db: string;
  _id: string;
  _writable?: boolean;
  _found?: boolean;
  meta: EntityMeta;

  static schema = object({
    meta: object({
      version: string(),
      createdAt: isoString()
    })
  })

  constructor(init?: Partial<Entity> | null) {
    Object.assign(this, init);
  }
}
