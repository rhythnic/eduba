const { CollectionName } = require("../enums");
const {
  StorageChanged,
  ArticleChanged,
  ArticleTextChanged,
} = require("../events");
const { DocumentRepository } = require("../lib/holepunch");
const { Article } = require("../models/article.model");

class ArticleService {
  constructor(spec) {
    this.events = spec.events;
    this.driveJsonStorage = spec.driveJsonStorage;
    this.driveTextStorage = spec.driveTextStorage;
    this.logger = spec.logger.namespace(ArticleService.name);
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.driveJsonStorage.sub(CollectionName.Article),
      Entity: Article,
    });

    this.storage = this.driveTextStorage.sub(CollectionName.Article);

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(ArticleChanged, { type, dbId, id });
    });

    this.storage.on(StorageChanged, ({ type, dbId, name: id, base }) => {
      this.events.emit(ArticleTextChanged, { type, dbId, id, base });
    });
  }

  async create(dto) {
    let article = new Article(dto);
    article.generateId();
    article.createdAt = new Date().toISOString();
    await this.repo.put(article);
    return article;
  }

  async update({ dbId, id, ...props }) {
    const article = await this.getOrFail(dbId, id);
    Object.assign(article, props);
    await this.repo.put(article);
    return article;
  }

  async putText(dbId, id, text) {
    const article = await this.getOrFail(dbId, id);
    await this.storage.put(dbId, article.fileBase, text);
  }

  async get(dbId, id, load) {
    return load ? this.repo.load(dbId, id) : this.repo.get(dbId, id);
  }

  async loadWithText(dbId, id) {
    const article = await this.repo.load(dbId, id);
    let text = "";
    if (article.meta("found")) {
      text = await this.storage.get(dbId, article.fileBase);
    }
    return { article, text };
  }

  async getOrFail(dbId, id) {
    const article = await this.repo.get(dbId, id);
    if (!article.meta("found")) {
      throw new Error("Article not found.");
    }
    return article;
  }

  async getText(dbId, id) {
    const article = await this.get(dbId, id);
    return article ? this.storage.get(dbId, article.fileBase) : "";
  }

  async find(dbId) {
    const load = true;
    const articles = await this.repo.find(dbId, load);
    return articles.reverse();
  }

  async delete(dbId, id) {
    const article = await this.getOrFail(dbId, id);

    await Promise.all([
      this.repo.delete(dbId, id),
      this.storage.delete(dbId, article.fileBase),
    ]);
  }
}

module.exports = {
  ArticleService,
};
