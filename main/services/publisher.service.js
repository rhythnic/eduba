const { StorageChanged, PublisherChanged } = require("../events");
const { Publisher } = require("../models/publisher.model");
const Constants = require("../constants");
const { DocumentRepository } = require("../lib/holepunch");
const { CollectionName } = require("../enums");

class PublisherService {
  constructor(spec) {
    this.driveService = spec.driveService;
    this.events = spec.events;
    this.userPublisherService = spec.userPublisherService;
    this.userService = spec.userService;
    this.articleService = spec.articleService;
    this.subscriptionService = spec.subscriptionService;
    this.driveJsonStorage = spec.driveJsonStorage;
    this.logger = spec.logger.namespace(PublisherService.name);
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.driveJsonStorage.sub(CollectionName.Publisher),
      Entity: Publisher,
    });

    this.repo.storage.on(StorageChanged, ({ type, dbId }) => {
      this.events.emit(PublisherChanged, { type, dbId });
    });
  }

  async create({ ext, title }) {
    const userPublishers = await this.userPublisherService.find();
    const coreName = `${Constants.Publisher}${userPublishers.length}`;

    const db = await this.driveService.db({ name: coreName });
    await db.ready();

    const publisher = new Publisher({
      createdAt: new Date().toISOString(),
      dbId: db.id,
      id: Constants.Default,
    });

    // Create a publisher profile aritcle and add ID to DTO
    const article = await this.articleService.create({
      dbId: db.id,
      ext,
      title,
      tags: [],
    });

    publisher.article = article.meta("id");

    await Promise.all([
      this.repo.put(publisher),
      this.userPublisherService.create({
        id: db.id,
        coreName,
        pinned: true,
      }),
    ]);

    return publisher;
  }

  async findSubscribed() {
    const subscriptions = await this.subscriptionService.find();
    return Promise.all(subscriptions.map((x) => this.load(x.meta("id"), true)));
  }

  async findUserPublished() {
    const userPublishers = await this.userPublisherService.find();
    const publishers = await Promise.all(
      userPublishers.map((x) => this.load(x.meta("id"), false))
    );
    return publishers;
  }

  async load(dbId, subscribed) {
    const publisher = await this.repo.load(dbId, Constants.Default);
    if (typeof subscribed === "undefined") {
      const subscription = await this.subscriptionService.get(dbId);
      subscribed = subscription.meta("found");
    }
    publisher.meta("subscribed", subscribed);
    publisher.article = await this.articleService.get(
      publisher.meta("dbId"),
      publisher.article
    );
    const userPublisher = await this.userPublisherService.get(dbId);
    if (userPublisher.meta("found")) {
      publisher.meta("pinned", userPublisher.pinned);
    }
    return publisher;
  }
}

module.exports = {
  PublisherService,
};
