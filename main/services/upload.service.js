const mime = require("mime/lite");
const { StorageChanged, UploadChanged } = require("../events");
const { Upload } = require("../models/upload.model");
const { DocumentRepository } = require("../lib/holepunch");
const { CollectionName } = require("../enums");

class UploadService {
  constructor(spec) {
    this.events = spec.events;
    this.dialog = spec.dialog;
    this.driveJsonStorage = spec.driveJsonStorage;
    this.driveFileStorage = spec.driveFileStorage;
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.driveJsonStorage.sub(CollectionName.Upload),
      Entity: Upload,
    });

    this.storage = this.driveFileStorage.sub(CollectionName.Upload);

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(UploadChanged, { type, dbId, id });
    });
  }

  async selectFile() {
    const opts = {
      message: "Upload file",
      properties: ["openFile"],
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }) {
    const upload = new Upload(props);
    upload.generateId();
    upload.createdAt = new Date().toISOString();
    upload.setExtension(file);

    await this.repo.put(upload);
    this.storage.putFile(upload.meta("dbId"), upload.fileBase, file);

    return upload;
  }

  async update({ file, dbId, id, ...props }) {
    const upload = this.getOrFail(dbId, id);

    if (file) {
      upload.setExtension(file);
    }

    Object.assign(upload, props);

    await this.repo.put(upload);

    if (file) {
      this.storage.putFile(dbId, upload.fileBase, file);
    }

    return image;
  }

  async get(dbId, id) {
    const upload = await this.repo.load(dbId, id);
    if (upload.ext) {
      upload.meta("type", mime.getType(upload.ext));
    }
    return upload;
  }

  async getOrFail(dbId, id) {
    const upload = await this.get(dbId, id);
    if (!upload) {
      throw new Error("Upload not found");
    }
    return upload;
  }
}

module.exports = {
  UploadService,
};
