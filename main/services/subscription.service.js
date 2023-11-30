const { CollectionName } = require("../enums");
const {
  StorageChanged,
  SubscriptionChanged,
  PublisherChanged,
} = require("../events");
const { DocumentRepository } = require("../lib/holepunch");
const { StorageChangeType } = require("../lib/holepunch/enums");
const { Subscription } = require("../models/subscription.model");

class SubscriptionService {
  constructor(spec) {
    this.userService = spec.userService;
    this.driveService = spec.driveService;
    this.events = spec.events;
    this.beeJsonStorage = spec.beeJsonStorage;
    this.logger = spec.logger.namespace(SubscriptionService.name);
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.beeJsonStorage.sub(CollectionName.Subscription),
      Entity: Subscription,
    });

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(SubscriptionChanged, { type, dbId, id });

      // The publisher is served with a "subscribed" property that has now changed
      this.events.emit(PublisherChanged, {
        type: StorageChangeType.Update,
        dbId: id,
      });
    });
  }

  async create(dto) {
    const subscription = new Subscription(dto);
    subscription.createdAt = new Date().toISOString();
    subscription.meta("dbId", this.userService.sessionDbId);
    await this.repo.put(subscription);
    this.driveService.subscribe(subscription.meta("id"));
    return subscription;
  }

  async delete(id) {
    const subscription = await this.getOrFail(id);
    this.driveService.unsubscribe(subscription.meta("id"));
    await this.repo.delete(subscription.meta("dbId"), subscription.meta("id"));
  }

  async find() {
    if (!this.userService.sessionDbId) {
      return [];
    }

    return this.repo.find(this.userService.sessionDbId);
  }

  async get(id) {
    if (!this.userService.sessionDbId) {
      const subscription = new Subscription();
      subscription.meta("id", id);
      subscription.meta("found", false);
      return subscription;
    }

    return this.repo.get(this.userService.sessionDbId, id);
  }

  async getOrFail(id) {
    const subscription = await this.get(id);

    if (!subscription.meta("found")) {
      throw new Error("Subscription not found");
    }

    return subscription;
  }

  async subscribeAllToSwarm() {
    let subscriptions = await this.repo.find(this.userService.sessionDbId);
    for (const subscription of subscriptions) {
      this.driveService.subscribe(subscription.meta("id"));
    }
  }
}

module.exports = {
  SubscriptionService,
};
