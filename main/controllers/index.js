/**
 * Controller handles all calls from window.api in the renderer
 */

const { assert, string, pattern } = require("superstruct");
const RequestDto = require("../dtos/request");
const ResponseDto = require("../dtos/response");
const { dbIdRegex } = require("../lib/holepunch/entity");

class Controller {
  constructor(spec) {
    this.publisherService = spec.publisherService;
    this.userPublisherService = spec.userPublisherService;
    this.subscriptionService = spec.subscriptionService;
    this.articleService = spec.articleService;
    this.bookmarkService = spec.bookmarkService;
    this.imageService = spec.imageService;
    this.uploadService = spec.uploadService;
    this.audioService = spec.audioService;
    this.videoService = spec.videoService;
    this.userService = spec.userService;
    this.userSettingService = spec.userSettingService;
    this.backupService = spec.backupService;
  }

  async createPublisher(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreatePublisherDto());
    const publisher = await this.publisherService.create(dto);
    return new ResponseDto.PublisherDto(publisher);
  }

  async findSubscribedPublishers() {
    sessionGuard.call(this);
    const publishers = await this.publisherService.findSubscribed();
    return publishers.map((p) => new ResponseDto.PublisherDto(p));
  }

  async findUserPublishers() {
    sessionGuard.call(this);
    const publishers = await this.publisherService.findUserPublished();
    return publishers.map((p) => new ResponseDto.PublisherDto(p));
  }

  async getPublisher(publisherId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    const publisher = await this.publisherService.load(publisherId);
    return new ResponseDto.PublisherDto(publisher);
  }

  async subscribe(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateSubscriptionDto());
    const subscription = await this.subscriptionService.create(dto);
    return new ResponseDto.SubscriptionDto(subscription);
  }

  async unsubscribe(id) {
    sessionGuard.call(this);
    assert(id, string());
    await this.subscriptionService.delete(id);
  }

  async findArticles(publisherId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    const articles = await this.articleService.find(publisherId);
    return articles.map((a) => new ResponseDto.ArticleDto(a));
  }

  async createArticle(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateArticleDto());
    const article = await this.articleService.create(dto);
    return new ResponseDto.ArticleDto(article);
  }

  async updateArticle(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateArticleDto());
    const article = await this.articleService.update(dto);
    return new ResponseDto.ArticleDto(article);
  }

  async getArticle(publisherId, articleId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(articleId, string());
    const article = await this.articleService.get(publisherId, articleId, true);
    return new ResponseDto.ArticleDto(article);
  }

  async getArticleWithText(publisherId, articleId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(articleId, string());
    const { article, text } = await this.articleService.loadWithText(
      publisherId,
      articleId
    );
    return { article: new ResponseDto.ArticleDto(article), text };
  }

  async deleteArticle(publisherId, articleId) {
    sessionGuard.call(this);
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(articleId, string());
    await this.articleService.delete(publisherId, articleId);
  }

  async putArticleText(publisherId, articleId, text) {
    sessionGuard.call(this);
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(articleId, string());
    assert(text, string());
    await this.articleService.putText(publisherId, articleId, text);
  }

  async getArticleText(publisherId, articleId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(articleId, string());
    return this.articleService.getText(publisherId, articleId);
  }

  async findBookmarks() {
    sessionGuard.call(this);
    const bookmarks = await this.bookmarkService.find();
    return bookmarks.map((b) => new ResponseDto.BookmarkDto(b));
  }

  async createBookmark(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateBookmarkDto());
    const bookmark = await this.bookmarkService.create(dto);
    return new ResponseDto.BookmarkDto(bookmark);
  }

  async updateBookmark(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateBookmarkDto());
    const bookmark = await this.bookmarkService.update(dto);
    return new ResponseDto.BookmarkDto(bookmark);
  }

  async deleteBookmark(bookmarkId) {
    sessionGuard.call(this);
    assert(bookmarkId, string());
    await this.bookmarkService.delete(bookmarkId);
  }

  async createImage(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateImageDto());
    const image = await this.imageService.create(dto);
    return new ResponseDto.ImageDto(image);
  }

  async updateImage(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateImageDto());
    const image = await this.imageService.update(dto);
    return new ResponseDto.ImageDto(image);
  }

  async selectImageFile() {
    sessionGuard.call(this);
    return this.imageService.selectFile();
  }

  async getImage(publisherId, imageId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(imageId, string());
    const image = await this.imageService.get(publisherId, imageId, true);
    return new ResponseDto.ImageDto(image);
  }

  async getUpload(publisherId, uploadId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(uploadId, string());
    const upload = await this.uploadService.get(publisherId, uploadId);
    return new ResponseDto.UploadDto(upload);
  }

  async createUpload(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateUploadDto());
    const upload = await this.uploadService.create(dto);
    return new ResponseDto.UploadDto(upload);
  }

  async updateUpload(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateUploadDto());
    const upload = await this.uploadService.update(dto);
    return new ResponseDto.UploadDto(upload);
  }

  async selectUploadFile() {
    sessionGuard.call(this);
    return this.uploadService.selectFile();
  }

  async createAudio(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateAudioDto());
    const audio = await this.audioService.create(dto);
    return new ResponseDto.AudioDto(audio);
  }

  async updateAudio(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateAudioDto());
    const audio = await this.audioService.update(dto);
    return new ResponseDto.AudioDto(audio);
  }

  async selectAudioFile() {
    sessionGuard.call(this);
    return this.audioService.selectFile();
  }

  async getAudio(publisherId, audioId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(audioId, string());
    const audio = await this.audioService.get(publisherId, audioId, true);
    return new ResponseDto.AudioDto(audio);
  }

  async createVideo(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateVideoDto());
    const video = await this.videoService.create(dto);
    return new ResponseDto.VideoDto(video);
  }

  async updateVideo(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateVideoDto());
    const video = await this.videoService.update(dto);
    return new ResponseDto.VideoDto(video);
  }

  async selectVideoFile() {
    sessionGuard.call(this);
    return this.videoService.selectFile();
  }

  async getVideo(publisherId, videoId) {
    assert(publisherId, pattern(string(), dbIdRegex));
    assert(videoId, string());
    const video = await this.videoService.get(publisherId, videoId, true);
    return new ResponseDto.VideoDto(video);
  }

  async sessionStatus() {
    return this.userService.sessionStatus();
  }

  async signIn(dto) {
    assert(dto, RequestDto.SignInDto());
    return this.userService.signIn(dto);
  }

  async signOut() {
    sessionGuard.call(this);
    return this.userService.signOut();
  }

  async generateMneumonic() {
    return this.userService.generateMneumonic();
  }

  async findUserSettings() {
    sessionGuard.call(this);
    return this.userSettingService.find();
  }

  async createUserSetting(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.CreateUserSettingDto());
  }

  async updateUserSetting(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateUserSettingDto());
  }

  async selectBackupDir() {
    return this.backupService.selectBackupDir();
  }

  async backupData(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.RunBackupRequest());
    return this.backupService.backupData(dto);
  }

  async restoreData(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.RestoreBackupRequest());
    return this.backupService.restoreData(dto);
  }

  async updateUserPublisher(dto) {
    sessionGuard.call(this);
    assert(dto, RequestDto.UpdateUserPublisherRequest());
    const userPublisher = await this.userPublisherService.update(dto);
    return new ResponseDto.UserPublisherDto(userPublisher);
  }

  async getHdWalletAddress(dto) {
    assert(dto, RequestDto.GetHdWalletAddressRequest());
    return this.userService.getHdWalletAddress(dto);
  }
}

module.exports = {
  Controller,
};

function sessionGuard() {
  if (!this.userService.sessionDbId) {
    throw new Error("Session required.");
  }
}
