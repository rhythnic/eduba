const mime = require("mime/lite");
const { StorageChanged, ImageChanged, ImageFileChanged } = require("../events");
const { Image } = require("../models/image.model");
const { ImageExtension, CollectionName } = require("../enums");
const { DocumentRepository } = require("../lib/holepunch");

class ImageService {
  constructor(spec) {
    this.events = spec.events;
    this.dialog = spec.dialog;
    this.driveJsonStorage = spec.driveJsonStorage;
    this.driveFileStorage = spec.driveFileStorage;
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.driveJsonStorage.sub(CollectionName.Image),
      Entity: Image,
    });

    this.storage = this.driveFileStorage.sub(CollectionName.Image);

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(ImageChanged, { type, dbId, id });
    });

    this.storage.on(StorageChanged, ({ type, dbId, name: id, base }) => {
      this.events.emit(ImageFileChanged, { type, dbId, id, base });
    });
  }

  async selectFile() {
    const opts = {
      message: "Select image",
      properties: ["openFile"],
      filters: {
        name: "Images",
        extensions: Object.values(ImageExtension),
      },
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }) {
    const image = new Image(props);
    image.generateId();
    image.createdAt = new Date().toISOString();
    image.setExtension(file);
    await this.repo.put(image);
    this.storage.putFile(image.meta("dbId"), image.fileBase, file);

    return image;
  }

  async update({ file, dbId, id, ...props }) {
    const image = this.getOrFail(dbId, id);

    if (file) {
      image.setExtension(file);
    }

    Object.assign(image, props);

    await this.repo.put(image);

    if (file) {
      this.storage.putFile(dbId, image.fileBase, file);
    }

    return image;
  }

  async get(dbId, id, load = false) {
    const image = await (load
      ? this.repo.load(dbId, id)
      : this.repo.get(dbId, id));

    if (image.ext) {
      image.meta("type", mime.getType(image.ext));
    }

    return image;
  }

  async getOrFail(dbId, id) {
    const image = await this.get(dbId, id);
    if (!image.meta("found")) {
      throw new Error("Image not found.");
    }
    return image;
  }
}

module.exports = {
  ImageService,
};
