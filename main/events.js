const { StorageChanged } = require("./lib/holepunch/events");

module.exports = {
  StorageChanged,
  ArticleChanged: "ArticleChanged",
  AudioChanged: "AudioChanged",
  AudioFileChanged: "AudioFileChanged",
  ArticleTextChanged: "ArticleTextChanged",
  BookmarkChanged: "BookmarkChanged",
  ImageChanged: "ImageChanged",
  ImageFileChanged: "ImageFileChanged",
  PublisherChanged: "PublisherChanged",
  RendererEvent: "RendererEvent",
  SessionEnded: "SessionEnded",
  SessionStarted: "SessionStarted",
  SubscriptionChanged: "SubscriptionChanged",
  UserPublisherChanged: "UserPublisherChanged",
  UserSettingChanged: "UserSettingChanged",
  UploadChanged: "UploadChanged",
  VideoChanged: "VideoChanged",
  VideoFileChanged: "VideoFileChanged",
};
