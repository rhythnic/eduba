import { SignalStateModel } from "../../lib/signal-state-model";

export class PublisherArticlesPageController extends SignalStateModel {
  constructor(spec) {
    super({
      state: {
        articles: { value: [] },
      },
    });

    this.appStore = spec.appStore;
  }

  async initialize() {
    await super.initialize();

    this.removeListeners = [
      window.publicEvents.onArticleChanged(this.handleArticleChanged),
    ];

    this.refreshArticles();
  }

  destroy() {
    super.destroy();
    this.removeListeners.forEach((fn) => fn());
  }

  handleArticleChanged = async ({ dbId }) => {
    if (dbId === this.props.dbId) {
      this.refreshArticles();
    }
  };

  async refreshArticles() {
    try {
      const articles = await window.api.findArticles(this.props.dbId, {
        reverse: true,
      });
      this.setState({ articles });
    } catch (err) {
      this.appStore.reportError(err);
    }
  }
}
