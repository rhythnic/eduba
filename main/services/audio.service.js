const mime = require("mime/lite");
const { StorageChanged, AudioChanged, AudioFileChanged } = require("../events");
const { AudioExtension, CollectionName } = require("../enums");
const { DocumentRepository } = require("../lib/holepunch");
const { Audio } = require("../models/audio.model");

class AudioService {
  constructor(spec) {
    this.events = spec.events;
    this.dialog = spec.dialog;
    this.driveJsonStorage = spec.driveJsonStorage;
    this.driveFileStorage = spec.driveFileStorage;
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.driveJsonStorage.sub(CollectionName.Audio),
      Entity: Audio,
    });

    this.storage = this.driveFileStorage.sub(CollectionName.Audio);

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(AudioChanged, { type, dbId, id });
    });

    this.storage.on(StorageChanged, ({ type, dbId, name: id, base }) => {
      this.events.emit(AudioFileChanged, { type, dbId, id, base });
    });
  }

  async selectFile() {
    const opts = {
      message: "Select audio",
      properties: ["openFile"],
      filters: {
        name: "Audio",
        extensions: Object.values(AudioExtension),
      },
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }) {
    const audio = new Audio(props);
    audio.generateId();
    audio.createdAt = new Date().toISOString();
    audio.setExtension(file);
    await this.repo.put(audio);
    this.storage.putFile(audio.meta("dbId"), audio.fileBase, file);

    return audio;
  }

  async update({ file, dbId, id, ...props }) {
    const audio = this.getOrFail(dbId, id);

    if (file) {
      audio.setExtension(file);
    }

    Object.assign(audio, props);

    await this.repo.put(audio);

    if (file) {
      this.storage.putFile(dbId, audio.fileBase, file);
    }

    return audio;
  }

  async get(dbId, id, load = false) {
    const audio = await (load
      ? this.repo.load(dbId, id)
      : this.repo.get(dbId, id));

    if (audio.ext) {
      audio.meta("type", mime.getType(audio.ext));
    }

    return audio;
  }

  async getOrFail(dbId, id) {
    const audio = await this.get(dbId, id);
    if (!audio.meta("found")) {
      throw new Error("Audio not found.");
    }
    return audio;
  }
}

module.exports = {
  AudioService,
};
