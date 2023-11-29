const mime = require("mime/lite");
const { StorageChanged, VideoChanged, VideoFileChanged } = require("../events");
const { VideoExtension, CollectionName } = require("../enums");
const { DocumentRepository } = require("../lib/holepunch");
const { Video } = require("../models/video.model");

class VideoService {
  constructor(spec) {
    this.events = spec.events;
    this.dialog = spec.dialog;
    this.driveJsonStorage = spec.driveJsonStorage;
    this.driveFileStorage = spec.driveFileStorage;
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.driveJsonStorage.sub(CollectionName.Video),
      Entity: Video,
    });

    this.storage = this.driveFileStorage.sub(CollectionName.Video);

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(VideoChanged, { type, dbId, id });
    });

    this.storage.on(StorageChanged, ({ type, dbId, name: id, base }) => {
      this.events.emit(VideoFileChanged, { type, dbId, id, base });
    });
  }

  async selectFile() {
    const opts = {
      message: "Select video",
      properties: ["openFile"],
      filters: {
        name: "Video",
        extensions: Object.values(VideoExtension),
      },
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }) {
    const video = new Video(props);
    video.generateId();
    video.createdAt = new Date().toISOString();
    video.setExtension(file);
    await this.repo.put(video);
    this.storage.putFile(video.meta("dbId"), video.fileBase, file);

    return video;
  }

  async update({ file, dbId, id, ...props }) {
    const video = this.getOrFail(dbId, id);

    if (file) {
      video.setExtension(file);
    }

    Object.assign(video, props);

    await this.repo.put(video);

    if (file) {
      this.storage.putFile(dbId, video.fileBase, file);
    }

    return video;
  }

  async get(dbId, id, load = false) {
    const video = await (load
      ? this.repo.load(dbId, id)
      : this.repo.get(dbId, id));

    if (video.ext) {
      video.meta("type", mime.getType(video.ext));
    }

    return video;
  }

  async getOrFail(dbId, id) {
    const video = await this.get(dbId, id);
    if (!video.meta("found")) {
      throw new Error("Video not found.");
    }
    return video;
  }
}

module.exports = {
  VideoService,
};
