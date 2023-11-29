const { CollectionName } = require("../enums");
const { StorageChanged, UserSettingChanged } = require("../events");
const { DocumentRepository } = require("../lib/holepunch");
const { UserSetting } = require("../models/user-setting.model");

class UserSettingService {
  constructor(spec) {
    this.userService = spec.userService;
    this.driveService = spec.driveService;
    this.events = spec.events;
    this.beeJsonStorage = spec.beeJsonStorage;
    this.logger = spec.logger.namespace(UserSettingService.name);
  }

  initialize() {
    this.repo = new DocumentRepository({
      storage: this.beeJsonStorage.sub(CollectionName.UserSetting),
      Entity: UserSetting,
    });

    this.repo.storage.on(StorageChanged, ({ type, dbId, name: id }) => {
      this.events.emit(UserSettingChanged, { type, dbId, id });
    });
  }

  async create(dto) {
    const userSetting = new UserSetting(dto);
    userSetting.generateId();
    userSetting.meta("dbId", this.userService.sessionDbId);
    await this.repo.put(userSetting);
    return userSetting;
  }

  async delete(id) {
    const userSetting = await this.getOrFail(id);
    await this.repo.delete(userSetting.meta("dbId"), userSetting.meta("id"));
  }

  async find(tag) {
    const settings = this.repo.find(this.userService.sessionDbId);
    if (tag) {
      return settings.filter((s) => s.tags.includes(tag));
    }
    return settings;
  }

  async get(id) {
    return this.repo.get(this.userService.sessionDbId, id);
  }

  async getOrFail(id) {
    const userSetting = await this.get(id);

    if (!userSetting.meta("found")) {
      throw new Error("User setting not found");
    }

    return userSetting;
  }
}

module.exports = {
  UserSettingService,
};
