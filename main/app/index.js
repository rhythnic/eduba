/**
 * App is the dependency injection container
 * All providers are registered here, and any provider can call
 * any other provider.
 */

const { ipcMain, clipboard, dialog } = require("electron");
const { Emitter } = require("../../lib/emitter");
const config = require("../config");
const { App, fromClass } = require("../../lib/app");
const { PersistedMap } = require("../../lib/persisted-map");
const { Logger } = require("../lib/logger");
const { ArticleService } = require("../services/article.service");
const { BookmarkService } = require("../services/bookmark.service");
const { ImageService } = require("../services/image.service");
const { PublisherService } = require("../services/publisher.service");
const { UserService } = require("../services/user.service");
const { Api } = require("../api/api.js");
const { enableAppEffects } = require("./app-effects");
const { SubscriptionService } = require("../services/subscription.service");
const { UserPublisherService } = require("../services/user-publisher.service");
const { UploadService } = require("../services/upload.service");
const { Controller } = require("../controllers");
const { EdubaScheme } = require("../schemes/eduba.scheme");
const holepunch = require("./holepunch");
const { AudioService } = require("../services/audio.service");
const { VideoService } = require("../services/video.service");
const { PersistToUtf8File } = require("../../lib/persist/persist-to-utf8-file");
const { UserSettingService } = require("../services/user-setting.service");
const { BackupService } = require("../services/backup.service");

const app = new App();

const logger = new Logger({
  level: config.logger.level,
  storage: new PersistToUtf8File(config.logger.file, ""),
});

const events = new Emitter();

app
  .register({
    // Config
    config,

    // Electron providers
    ipcMain,
    clipboard,
    dialog,

    // Event Emitter
    events,

    // Logger
    logger,

    // Schemes
    edubaScheme: fromClass(EdubaScheme),

    // Key-value map stored to local file
    machineState: new PersistedMap({
      storage: new PersistToUtf8File(config.machineState.file, "[]"),
    }),

    // Holepunch dependencies
    ...holepunch,

    // Services
    userSettingService: fromClass(UserSettingService),
    publisherService: fromClass(PublisherService),
    backupService: fromClass(BackupService),
    userService: fromClass(UserService),
    subscriptionService: fromClass(SubscriptionService),
    userPublisherService: fromClass(UserPublisherService),
    articleService: fromClass(ArticleService),
    audioService: fromClass(AudioService),
    bookmarkService: fromClass(BookmarkService),
    imageService: fromClass(ImageService),
    uploadService: fromClass(UploadService),
    videoService: fromClass(VideoService),

    // Controllers
    controller: fromClass(Controller),

    // Wire up public API
    api: fromClass(Api),
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

// App effects
enableAppEffects(app, config);

module.exports = {
  app,
};
