const CollectionName = {
  Article: "articles",
  Audio: "audio",
  Bookmark: "bookmarks",
  Image: "images",
  Publisher: "publishers",
  Subscription: "subscriptions",
  Upload: "uploads",
  UserPublisher: "user-publishers",
  UserSetting: "user-setting",
  Video: "video",
};

const BookmarkType = {
  Bookmark: "bookmark",
  Folder: "folder",
};

const ArticleContentExtension = {
  Markdown: ".md",
};

const ImageExtension = {
  Avif: ".avif",
  Bmp: ".bmp",
  Gif: ".gif",
  Jpeg: ".jpeg",
  Png: ".png",
  Svg: ".svg",
  Tif: ".tif",
  Webp: ".webp",
};

const AudioExtension = {
  Mp3: ".mp3",
  Ogg: ".ogg",
  Wav: ".wav",
};

const VideoExtension = {
  Mp4: ".mp4",
  Avi: ".avi",
  Ogv: ".ogv",
  Webm: ".webm",
};

const SessionStatus = {
  Active: "active",
  Inactive: "inactive",
};

const UserSettings = {};

const WalletType = {
  Mneumonic: "mneumonic",
  Ledger: "ledger",
};

module.exports = {
  CollectionName,
  BookmarkType,
  ArticleContentExtension,
  ImageExtension,
  AudioExtension,
  VideoExtension,
  SessionStatus,
  UserSettings,
  WalletType,
};
