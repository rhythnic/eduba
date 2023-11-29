import { createContext } from "preact";
import { PersistToMap } from "../../../../lib/persist/persist-to-map";
import { SignalStateModel } from "../../lib/signal-state-model";
import { computed } from "@preact/signals";
import { Alert } from "../../events";
import { AlertType } from "../../enums";

export const ArticlePageContext = createContext();

export class ArticlePageController extends SignalStateModel {
  constructor(spec) {
    super({
      storage: new PersistToMap(spec.cache, spec.pageId),
      state: {
        publisher: { value: null, cache: true },
        article: { value: null, cache: true },
        markdown: { value: "", cache: true },
        bookmarkInEdit: { value: null, cache: true },
      },
    });

    this.displayMarkdown = computed(() => {
      const { title } = this.state.article.value;
      const markdown = this.state.markdown.value;
      return title ? `# ${title}\n\n${markdown}` : markdown;
    });

    this.isPublisherArticle = computed(() => {
      const publisher = this.state.publisher.value;
      const article = this.state.article.value;
      return publisher && article && publisher.article.id === article.id;
    });

    this.appStore = spec.appStore;
    this.navStore = spec.navStore;
    this.publisherStore = spec.publisherStore;
    this.events = spec.events;
  }

  async initialize() {
    try {
      await super.initialize();

      const publisher = await window.api.getPublisher(this.props.dbId);
      const { article, text: markdown } = await window.api.getArticleWithText(
        this.props.dbId,
        this.props.articleId
      );

      this.setState({ article, markdown, publisher });

      if (article) {
        this.navStore.updateActivePageTitle(article.title);
      }

      this.removeListeners = [
        window.publicEvents.onPublisherChanged(this.handlePublisherChanged),
        window.publicEvents.onArticleChanged(this.handleArticleChanged),
        window.publicEvents.onArticleTextChanged(this.handleTextChanged),
      ];
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  destroy() {
    super.destroy();
    this.removeListeners.forEach((fn) => fn());
  }

  handlePublisherChanged = async (evt) => {
    try {
      if (this.props.dbId === evt.dbId) {
        const publisher = await window.api.getPublisher(evt.dbId);
        if (publisher) {
          this.setState({ publisher });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  handleArticleChanged = async (evt) => {
    try {
      if (this.props.dbId === evt.dbId && this.props.articleId === evt.id) {
        const article = await window.api.getArticle(evt.dbId, evt.id);
        if (article) {
          this.setState({ article });
          this.navStore.updateActivePageTitle(article.title);
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  handleBookmarkEditDone = () => {
    this.setState({ bookmarkInEdit: null });
  };

  handleTextChanged = async (evt) => {
    try {
      if (this.props.dbId === evt.dbId && this.props.articleId === evt.id) {
        const markdown = await window.api.getArticleText(evt.dbId, evt.id);
        if (markdown) {
          this.setState({ markdown });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  openEditBookmark = () => {
    const article = this.state.article.peek();

    this.setState({
      bookmarkInEdit: {
        type: "bookmark",
        href: `${article.dbId}/articles/${article.id}`,
        title: article.title,
      },
    });
  };

  shareArticle = () => {
    const article = this.state.article.peek();

    window.rendererEvents.copyToClipboard(
      `${article.dbId}/articles/${article.id}`
    );

    this.events.emit(Alert, {
      type: AlertType.Success,
      message: "Copied to clipboard",
      timeout: 3000,
    });
  };

  subscribeToPublisher = async () => {
    try {
      await window.api.subscribe({ id: this.props.dbId });

      this.events.emit(Alert, {
        type: AlertType.Success,
        message: "Subscribed",
        timeout: 3000,
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  unsubscribeFromPublisher = async () => {
    try {
      await window.api.unsubscribe(this.props.dbId);

      this.events.emit(Alert, {
        type: AlertType.Success,
        message: "Unsubscribed",
        timeout: 3000,
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
