const {
  object,
  optional,
  string,
  enums,
  array,
  pattern,
  boolean,
  any,
  number,
} = require("superstruct");
const {
  BookmarkType,
  ArticleContentExtension,
  WalletType,
} = require("../../enums");
const { dbIdRegex } = require("../../lib/holepunch/entity");
const { bookmarkHrefRegex } = require("../../models/bookmark.model");

const bip44Params = () =>
  object({
    chain: string(),
    account: number(),
    change: number(),
    index: number(),
  });

const CreatePublisherDto = () =>
  object({
    // Title of Publisher's default Article
    title: string(),
    // Content-type of Publisher's default Article
    ext: enums(Object.values(ArticleContentExtension)),
  });

const CreateArticleDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    // Title of Article
    title: optional(string()),
    // Content-type of Article
    ext: enums(Object.values(ArticleContentExtension)),
    // Tags/Keywords for article
    tags: array(string()),
  });

const UpdateArticleDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    id: string(),
    // Title of Article
    title: optional(string()),
    // Content-type of Article
    ext: enums(Object.values(ArticleContentExtension)),
    // Tags/Keywords for article
    tags: array(string()),
  });

const CreateBookmarkDto = () =>
  object({
    // Type (folder or bookmark)
    type: enums(Object.values(BookmarkType)),
    // Title
    title: string(),
    // Parent in tree of bookmark folders
    parent: optional(string()),
    // Href (publisherId/articles/articleId)
    href: optional(pattern(string(), bookmarkHrefRegex)),
  });

const UpdateBookmarkDto = () =>
  object({
    id: string(),
    // Type (folder or bookmark)
    type: optional(enums(Object.values(BookmarkType))),
    // Title
    title: optional(string()),
    // Parent in tree of bookmark folders
    parent: optional(string()),
    // Href (publisherId/articles/articleId)
    href: optional(pattern(string(), bookmarkHrefRegex)),
  });

const CreateAudioDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    // File path of audio on machine
    file: string(),
    // Title
    title: string(),
    // Tags to search for audio
    tags: array(string()),
  });

const UpdateAudioDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    id: string(),
    // File path of audio on machine
    file: optional(string()),
    // Alternate text
    title: optional(string()),
    // Tags to search for audio
    tags: optional(array(string())),
  });

const CreateImageDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    // File path of image to upload
    file: string(),
    // Alternate text
    alt: string(),
    // Tags to search for image
    tags: array(string()),
  });

const UpdateImageDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    id: string(),
    // File path of image to upload
    file: optional(string()),
    // Alternate text
    alt: optional(string()),
    // Tags to search for image
    tags: optional(array(string())),
  });

const CreateUploadDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    // Path of file to upload
    file: string(),
    // File name to suggest to user on download
    fileName: optional(string()),
  });

const UpdateUploadDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    id: string(),
    // Path of file to upload
    file: optional(string()),
    // File name to suggest to user on download
    fileName: optional(string()),
  });

const CreateSubscriptionDto = () =>
  object({
    id: pattern(string(), dbIdRegex),
  });

const CreateVideoDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    // File path of video on machine
    file: string(),
    // Title
    title: string(),
    // Tags to search for video
    tags: array(string()),
  });

const UpdateVideoDto = () =>
  object({
    dbId: pattern(string(), dbIdRegex),
    id: string(),
    // File path of video on machine
    file: optional(string()),
    // Alternate text
    title: optional(string()),
    // Tags to search for video
    tags: optional(array(string())),
  });

const CreateUserSettingDto = () =>
  object({
    tags: array(string()),
    value: any(),
  });

const UpdateUserSettingDto = () =>
  object({
    tags: optional(array(string())),
    value: optional(any()),
  });

const RunBackupRequest = () =>
  object({
    backupDir: string(),
  });

const RestoreBackupRequest = () =>
  object({
    backupDir: string(),
  });

const UpdateUserPublisherRequest = () =>
  object({
    id: pattern(string(), dbIdRegex),
    pinned: boolean(),
  });

const GetHdWalletAddressRequest = () =>
  object({
    walletType: enums(Object.values(WalletType)),
    phrase: optional(string()),
    password: optional(string()),
    bip44Params: bip44Params(),
  });

const SignInDto = () =>
  object({
    walletType: enums(Object.values(WalletType)),
    phrase: optional(string()),
    password: optional(string()),
    bip44Params: bip44Params(),
  });

module.exports = {
  CreatePublisherDto,
  CreateArticleDto,
  UpdateArticleDto,
  CreateBookmarkDto,
  UpdateBookmarkDto,
  CreateAudioDto,
  UpdateAudioDto,
  CreateImageDto,
  UpdateImageDto,
  CreateUploadDto,
  UpdateUploadDto,
  CreateSubscriptionDto,
  CreateVideoDto,
  UpdateVideoDto,
  SignInDto,
  CreateUserSettingDto,
  UpdateUserSettingDto,
  RunBackupRequest,
  RestoreBackupRequest,
  UpdateUserPublisherRequest,
  GetHdWalletAddressRequest,
};
