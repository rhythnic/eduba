/**
 * User publisher is a collection to track the publications created
 * by the logged in user.
 */
const { CollectionName } = require("../enums");
const { DocumentRepository, StorageChangeType } = require("../lib/holepunch");
const { StorageChanged, UserPublisherChanged } = require("../events");
const { UserPublisher } = require("../models/user-publisher.model");

class UserPublisherService {
  constructor(spec) {
    this.userService = spec.userService;
    this.driveService = spec.driveService;
    this.beeJsonStorage = spec.beeJsonStorage;
    this.events = spec.events;
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.beeJsonStorage.sub(CollectionName.UserPublisher),
      Entity: UserPublisher,
    });

    this.repo.storage.on(StorageChanged, ({ name: id }) => {
      this.events.emit(UserPublisherChanged, {
        type: StorageChangeType.Update,
        id,
      });
    });
  }

  async create(dto) {
    const userPublisher = new UserPublisher(dto);
    userPublisher.meta("dbId", this.userService.sessionDbId);
    await this.repo.put(userPublisher);

    if (userPublisher.pinned) {
      this.driveService.joinSwarm(userPublisher.meta("id"));
    } else {
      this.driveService.leaveSwarm(userPublisher.meta("id"));
    }
  }

  async update({ id, ...props }) {
    const userPublisher = await this.getOrFail(id);
    Object.assign(userPublisher, props);
    await this.repo.put(userPublisher);

    if ("pinned" in props) {
      if (userPublisher.pinned) {
        this.driveService.joinSwarm(userPublisher.meta("id"));
      } else {
        this.driveService.leaveSwarm(userPublisher.meta("id"));
      }
    }

    return userPublisher;
  }

  async find() {
    return this.repo.find(this.userService.sessionDbId);
  }

  async get(id) {
    return this.repo.get(this.userService.sessionDbId, id);
  }

  async getOrFail(id) {
    const userPublisher = await this.get(id);
    if (!userPublisher.meta("found")) {
      throw new Error("User publisher not found.");
    }
    return userPublisher;
  }

  async joinAllToSwarm() {
    let userPublishers = await this.repo.find(this.userService.sessionDbId);
    for (const userPublisher of userPublishers) {
      if (userPublisher.pinned) {
        this.driveService.joinSwarm(userPublisher.meta("id"));
      }
    }
  }
}

module.exports = {
  UserPublisherService,
};
