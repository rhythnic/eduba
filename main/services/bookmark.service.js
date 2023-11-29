const { CollectionName } = require("../enums");
const { StorageChanged, BookmarkChanged } = require("../events");
const { DocumentRepository } = require("../lib/holepunch");
const { Bookmark } = require("../models/bookmark.model");

class BookmarkService {
  constructor(spec) {
    this.events = spec.events;
    this.userService = spec.userService;
    this.beeJsonStorage = spec.beeJsonStorage;
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.beeJsonStorage.sub(CollectionName.Bookmark),
      Entity: Bookmark,
    });

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(BookmarkChanged, { type, dbId, id });
    });
  }

  async create(dto) {
    let bookmark = new Bookmark(dto);
    bookmark.meta("dbId", this.userService.sessionDbId);
    bookmark.generateId();
    await this.repo.put(bookmark);
    return bookmark;
  }

  async update({ id, ...props }) {
    let bookmark = await this.getOrFail(id);
    Object.assign(bookmark, props);
    await this.repo.put(bookmark);
    return bookmark;
  }

  async get(id) {
    return this.repo.get(this.userService.sessionDbId, id);
  }

  async getOrFail(id) {
    const bookmark = await this.get(id);

    if (!bookmark.meta("found")) {
      throw new Error("Bookmark not found.");
    }

    return bookmark;
  }

  async find(opts) {
    return this.repo.find(this.userService.sessionDbId, opts);
  }

  async delete(id) {
    const bookmarks = await this.repo.find(this.userService.sessionDbId);
    const toDelete = [id];
    let lastLength = 0;

    while (toDelete.length !== lastLength) {
      lastLength = toDelete.length;
      for (const bookmark of bookmarks) {
        if (
          bookmark.parent &&
          toDelete.includes(bookmark.parent) &&
          !toDelete.includes(bookmark.meta("id"))
        ) {
          toDelete.push(bookmark.meta("id"));
        }
      }
    }

    await this.repo.deleteMany(this.userService.sessionDbId, toDelete);
  }
}

module.exports = {
  BookmarkService,
};
