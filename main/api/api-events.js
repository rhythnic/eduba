const Events = require("../events");

// Events exposed to the renderer
const PublicEventNames = [
  Events.ArticleChanged,
  Events.ArticleTextChanged,
  Events.AudioChanged,
  Events.AudioFileChanged,
  Events.BookmarkChanged,
  Events.ImageChanged,
  Events.ImageFileChanged,
  Events.PublisherChanged,
  Events.SessionStarted,
  Events.SessionEnded,
  Events.SubscriptionChanged,
  Events.UserPublisherChanged,
  Events.UserSettingChanged,
  Events.UploadChanged,
  Events.VideoChanged,
];

// Events emitted by the renderer
const RendererEventType = {
  CopyToClipboard: "copyToClipboard",
  ReportError: "reportError",
};

module.exports = {
  PublicEventNames,
  RendererEventType,
};
