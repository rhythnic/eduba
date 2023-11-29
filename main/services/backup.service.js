const Corestore = require("corestore");
const Constants = require("../constants");
const Hyperdrive = require("hyperdrive");
const { range } = require("ramda");

class BackupService {
  constructor(spec) {
    this.dialog = spec.dialog;
    this.driveService = spec.driveService;
    this.userService = spec.userService;
    this.userPublisherService = spec.userPublisherService;
    this.logger = spec.logger.namespace(BackupService.name);
  }

  async backupData({ backupDir }) {
    const startTime = Date.now();
    this.logger.debug("Starting backup");

    const backupStore = new Corestore(backupDir).namespace(Constants.App);
    await backupStore.ready();
    const { sessionStore } = this.userService;

    const backupStream = backupStore.replicate(true);
    const sessionStream = sessionStore.replicate(false);
    backupStream.pipe(sessionStream).pipe(backupStream);

    const userCoreBackup = backupStore.get(this.userService.sessionDbId);
    const userCore = sessionStore.get(this.userService.sessionDbId);

    await this._pullMissingRange(userCoreBackup, userCore);

    const userPublishers = await this.userPublisherService.find();

    await Promise.all(
      userPublishers.map(async (userPublisher) => {
        const publisherDrive = await this.driveService.db(
          userPublisher.meta("id")
        );

        const publisherDriveBackup = new Hyperdrive(
          backupStore,
          userPublisher.meta("id")
        );

        await this._pullMissingRange(
          publisherDriveBackup.core,
          publisherDrive.core
        );

        const blobs = await publisherDrive.getBlobs();
        const blobsBackup = await publisherDriveBackup.getBlobs();

        await this._pullMissingRange(blobsBackup.core, blobs.core);
      })
    );

    await backupStore.close();

    this.logger.debug("Backup complete", `${Date.now() - startTime}ms`);
  }

  async restoreData({ backupDir }) {
    const startTime = Date.now();
    this.logger.debug("Starting restore");

    const backupStore = new Corestore(backupDir).namespace(Constants.App);
    await backupStore.ready();
    const { sessionStore } = this.userService;

    const sessionStream = sessionStore.replicate(true);
    const backupStream = backupStore.replicate(false);
    sessionStream.pipe(backupStream).pipe(sessionStream);

    const userCoreBackup = backupStore.get(this.userService.sessionDbId);
    const userCore = sessionStore.get(this.userService.sessionDbId);

    await this._pullMissingRange(userCore, userCoreBackup);

    const userPublishers = await this.userPublisherService.find();

    await Promise.all(
      userPublishers.map(async (userPublisher) => {
        // Must get drive by name initially for it to be writable
        const publisherDrive = await this.driveService.db({
          name: userPublisher.coreName,
        });

        const publisherDriveBackup = new Hyperdrive(
          backupStore,
          userPublisher.meta("id")
        );

        await this._pullMissingRange(
          publisherDrive.core,
          publisherDriveBackup.core
        );

        const blobs = await publisherDrive.getBlobs();
        const blobsBackup = await publisherDriveBackup.getBlobs();

        await this._pullMissingRange(blobs.core, blobsBackup.core);
      })
    );

    await backupStore.close();
    this.logger.debug("Restore complete", `${Date.now() - startTime}ms`);
  }

  async selectBackupDir() {
    const opts = {
      message: "Select backup folder",
      properties: ["openDirectory"],
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async _pullMissingRange(dest, source) {
    await Promise.all([source.ready(), dest.ready()]);
    if (dest.length < source.length) {
      const blockRange = range(dest.length, source.length);
      await Promise.all(blockRange.map((i) => dest.get(i)));
    }
  }
}

module.exports = {
  BackupService,
};
