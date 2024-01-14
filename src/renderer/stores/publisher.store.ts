import { AppStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";
import { NavStore } from "./nav.store";
import { TYPES } from "../di/types";
import { IpcApi } from "@/api/ipc/types";
import { ArticleContentExtension } from "@/enums";
import { PopulatedPublisherDto } from "@/dtos/response/interfaces";

@injectable()
export class PublisherStore {
  constructor(
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(NavStore) private readonly navStore: NavStore,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
  ) {}

  createPublisher = async () => {
    const publisher = await this.ipcSdk.publisher.create({
      ext: ArticleContentExtension.Markdown
    });
    const href = `edit/${publisher._db}/articles/${publisher.article}`;
    this.navStore.insertTab({ title: "New Publisher", href });
  };

  togglePublisherPinned = async (publisher: PopulatedPublisherDto) => {
    try {
      await this.ipcSdk.publisher.updateUserPublisher({
        _id: publisher._db,
        pinned: !publisher._pinned,
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}