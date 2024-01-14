import { effect } from "@preact/signals";
import { signalState } from "@/lib/signal-state";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { PopulatedPublisherDto } from "@/dtos/response/interfaces";
import { AppStore, PublisherStore, AuthStore } from "@/renderer/stores";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { ArticleChangeEvent } from "@/events/common/main";

export interface SidebarPublishersControllerState {
  userPublishers: PopulatedPublisherDto[];
  subscribedPublishers: PopulatedPublisherDto[];
}

@injectable()
export class SidebarPublishersController extends ComponentController<never>{
  public state = signalState<SidebarPublishersControllerState>({
    userPublishers: [],
    subscribedPublishers: []
  });

  constructor(
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(AuthStore) private readonly authStore: AuthStore,
    @inject(PublisherStore) private readonly publisherStore: PublisherStore
  ) {
    super();

    this.listeners = [
      this.ipcEvents.on.UserPublisherChangeEvent(
        this.handleUserPublisherChanged
      ),
      this.ipcEvents.on.ArticleChangeEvent(this.handleArticleChange),
      this.ipcEvents.on.SubscriptionChangeEvent(this.handleSubscriptionChanged),
      effect(() => {
        this.initializeWithSession(this.authStore.state.sessionActive.value);
      }),
    ];
  }

  async initializeWithSession(sessionActive: boolean) {
    if (!sessionActive) {
      this.state._set({
        subscribedPublishers: [],
        userPublishers: [],
      });
      return;
    }

    try {
      this.state._set({
        subscribedPublishers: await this.ipcSdk.publisher.findSubscribed(),
        userPublishers: await this.ipcSdk.publisher.findUserPublishers(),
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  handleUserPublisherChanged = async () => {
    this.state._set({
      userPublishers: await this.ipcSdk.publisher.findUserPublishers(),
    });
  };

  handleArticleChange = async ({ db, id }: ArticleChangeEvent) => {
    if (!this.authStore.state.sessionActive.peek()) {
      return;
    }

    const publisher = await this.ipcSdk.publisher.load(db);
    if (publisher._writable && publisher.article._id === id) {
      this.state._set({ userPublishers: await this.ipcSdk.publisher.findUserPublishers() });
    }
  };

  handleSubscriptionChanged = async () => {
    if (!this.authStore.state.sessionActive.peek()) {
      return;
    }

    this.state._set({
      subscribedPublishers: await this.ipcSdk.publisher.findSubscribed(),
    });
  };
}
