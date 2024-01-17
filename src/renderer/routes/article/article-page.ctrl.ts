import { createContext } from "preact";
import { Signal, computed } from "@preact/signals";
import { AlertType, BookmarkType } from "@/enums";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { Emitter } from "@/lib/emitter";
import { ArticleDto, PopulatedPublisherDto } from "@/dtos/response/interfaces";
import { CreateBookmarkRequest } from "@/dtos/request/interfaces";
import { signalState } from "@/lib/signal-state";
import { AppStore, NavStore } from "@/renderer/stores";
import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { AlertEvent } from "@/events/renderer";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { ArticleChangeEvent, ArticleTextChangeEvent, PublisherChangeEvent } from "@/events/common/main";

export const ArticlePageContext = createContext(null);

export interface ArticlePageProps {
  pageId: string;
  dbId: string;
  articleId: string;
}

export interface ArticlePageControllerState {
  publisher: PopulatedPublisherDto;
  article: ArticleDto;
  markdown: string;
  bookmarkInEdit: Partial<CreateBookmarkRequest>
}

@injectable()
export class ArticlePageController extends ComponentController<ArticlePageProps>{
  public state = signalState<ArticlePageControllerState>(
    {
      publisher: null,
      article: null,
      markdown: "",
      bookmarkInEdit: null
    }
  );

  public displayMarkdown: Signal<string>;

  public isPublisherArticle: Signal<boolean>;

  public loading: Signal<boolean>;

  constructor(
    @inject(TYPES.Events) private readonly events: Emitter,
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(NavStore) private readonly navStore: NavStore,
  ) {
    super();

    this.displayMarkdown = computed(() => {
      const { title } = this.state.article.value;
      const markdown = this.state.markdown.value;
      return title ? `# ${title}\n\n${markdown}` : markdown;
    });

    this.isPublisherArticle = computed(() => {
      const publisher = this.state.publisher.value;
      const article = this.state.article.value;
      return publisher && article && publisher.article._id === article._id;
    });

    this.loading = computed(() => !this.state.markdown.value);
  }


  async initialize(props: ArticlePageProps) {
    try {
      this.state._configure({ storage: this.storage, key: props.pageId });

      const publisher = await this.ipcSdk.publisher.load(props.dbId);
      const { article, text: markdown } = await this.ipcSdk.article.loadWithText(
        props.dbId,
        props.articleId
      );

      this.state._set({ article, markdown, publisher });

      if (article) {
        this.navStore.updateActivePageTitle(article.title);
      }

      this.listeners = [
        this.ipcEvents.on.PublisherChangeEvent(this.handlePublisherChanged),
        this.ipcEvents.on.ArticleChangeEvent(this.handleArticleChanged),
        this.ipcEvents.on.ArticleTextChangeEvent(this.handleTextChanged),
      ];
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  handlePublisherChanged = async (evt: PublisherChangeEvent) => {
    try {
      if (this.props.dbId === evt.db) {
        const publisher = await this.ipcSdk.publisher.load(evt.db);
        if (publisher) {
          this.state._set({ publisher });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  handleArticleChanged = async (evt: ArticleChangeEvent) => {
    try {
      if (this.props.dbId === evt.db && this.props.articleId === evt.id) {
        const article = await this.ipcSdk.article.load(evt.db, evt.id);
        if (article) {
          this.state._set({ article });
          this.navStore.updateActivePageTitle(article.title);
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  handleBookmarkEditDone = () => {
    this.state._set({ bookmarkInEdit: null });
  };

  handleTextChanged = async (evt: ArticleTextChangeEvent) => {
    try {
      if (this.props.dbId === evt.db && this.props.articleId === evt.id) {
        const markdown = await this.ipcSdk.article.getText(evt.db, evt.id);
        if (markdown) {
          this.state._set({ markdown });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  openEditBookmark = () => {
    const article = this.state.article.peek();

    this.state._set({
      bookmarkInEdit: {
        type: BookmarkType.Bookmark,
        href: `${article._db}/articles/${article._id}`,
        title: article.title,
      },
    });
  };

  shareArticle = () => {
    const article = this.state.article.peek();

    this.ipcEvents.dispatch.CopiedToClipboardEvent(
      `${article._db}/articles/${article._id}`
    );

    this.events.dispatch(new AlertEvent({
      type: AlertType.Success,
      message: "Copied to clipboard",
      timeout: 3000,
    }));
  };

  subscribeToPublisher = async () => {
    try {
      await this.ipcSdk.publisher.subscribe({ _id: this.props.dbId });

      this.events.dispatch(new AlertEvent({
        type: AlertType.Success,
        message: "Subscribed",
        timeout: 3000,
      }));
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  unsubscribeFromPublisher = async () => {
    try {
      await this.ipcSdk.publisher.unsubscribe(this.props.dbId);

      this.events.dispatch(new AlertEvent({
        type: AlertType.Success,
        message: "Unsubscribed",
        timeout: 3000,
      }));
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
