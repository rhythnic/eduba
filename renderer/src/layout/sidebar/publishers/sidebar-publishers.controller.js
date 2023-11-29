import { effect } from "@preact/signals";
import { SignalStateModel } from "../../../lib/signal-state-model";

export class SidebarPublishersController extends SignalStateModel {
  constructor(spec) {
    super({
      state: {
        userPublishers: { value: [] },
        subscribedPublishers: { value: [] },
      },
    });

    this.appStore = spec.appStore;
    this.authStore = spec.authStore;
    this.publisherStore = spec.publisherStore;
  }

  initialize() {
    super.initialize();

    this.removeListeners = [
      window.publicEvents.onUserPublisherChanged(
        this.handleUserPublisherChanged
      ),
      window.publicEvents.onArticleChanged(this.handleArticleChange),
      window.publicEvents.onSubscriptionChanged(this.handleSubscriptionChanged),
      effect(() => {
        this.initializeWithSession(this.authStore.state.sessionActive.value);
      }),
    ];
  }

  async initializeWithSession(sessionActive) {
    if (!sessionActive) {
      this.setState({
        subscribedPublishers: [],
        userPublishers: [],
      });
      return;
    }

    try {
      this.setState({
        subscribedPublishers: await window.api.findSubscribedPublishers(),
        userPublishers: await window.api.findUserPublishers(),
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  destroy() {
    super.destroy();
    this.removeListeners.forEach((fn) => fn());
  }

  handleUserPublisherChanged = async () => {
    this.setState({
      userPublishers: await window.api.findUserPublishers(),
    });
  };

  handleArticleChange = async ({ dbId, id }) => {
    if (!this.authStore.state.sessionActive.peek()) {
      return;
    }

    const publisher = await window.api.getPublisher(dbId);
    if (publisher._writable && publisher.article.id === id) {
      this.setState({ userPublishers: await window.api.findUserPublishers() });
    }
  };

  handleSubscriptionChanged = async () => {
    if (!this.authStore.state.sessionActive.peek()) {
      return;
    }

    this.setState({
      subscribedPublishers: await window.api.findSubscribedPublishers(),
    });
  };
}
