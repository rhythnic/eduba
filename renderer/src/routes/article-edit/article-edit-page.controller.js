import { SignalStateModel } from "../../lib/signal-state-model";
import { PersistToMap } from "../../../../lib/persist/persist-to-map";
import { FormController } from "../../controllers/form.controller";
import { createContext, createRef } from "preact";
import { computed } from "@preact/signals";

export const ArticleEditPageContext = createContext();

export const EditToolType = {
  Article: "article",
  Audio: "audio",
  Image: "image",
  Upload: "upload",
  Video: "video",
};

export class ArticleEditPageController extends SignalStateModel {
  constructor(spec) {
    super({
      storage: new PersistToMap(spec.cache, spec.pageId),
      state: {
        article: { value: null, cache: true },
        markdown: { value: "", cache: true },
        warning: { value: false, cache: false },
        toolModal: { value: "", cache: true },
      },
    });

    this.form = new FormController({
      storage: this.sub("form", { cache: true }),
      onSubmit: this.handleSubmit,
      state: {
        title: { value: "", cache: true },
        markdown: { value: "", cache: true },
      },
    });

    this.displayMarkdown = computed(() => {
      const title = this.form.state.title.value;
      const markdown = this.form.state.markdown.value;
      return title ? `# ${title}\n\n${markdown}` : markdown;
    });

    for (const type in Object.values(EditToolType)) {
      this[`${type}ToolModal`] = computed(
        () => this.state.toolModal.value === type
      );
    }

    this.appStore = spec.appStore;
    this.navStore = spec.navStore;

    this.textarea = createRef();
  }

  async initialize() {
    try {
      await super.initialize();
      await this.form.initialize();

      const { dbId, articleId } = this.props;

      if (dbId && articleId) {
        const article = await window.api.getArticle(dbId, articleId);
        const markdown = await window.api.getArticleText(dbId, articleId);

        this.setState({ article, markdown });

        if (!this.form.revived) {
          this.form.setState({ title: article.title || "", markdown });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  cancelEdit = () => {
    const article = this.state.article.peek();

    if (article) {
      const page = {
        href: `${article.dbId}/articles/${article.id}`,
      };
      this.navStore.insertPage(page, true);
    } else {
      this.navStore.removeActiveTab();
    }
  };

  handleSubmit = async (data) => {
    try {
      let { dbId, articleId } = this.props;
      let article = this.state.article.peek();

      if (!dbId) {
        const publisher = await window.api.createPublisher({
          ext: ".md",
          title: data.title,
        });

        dbId = publisher.dbId;
        articleId = publisher.article;
      } else if (!articleId) {
        const article = await window.api.createArticle({
          dbId,
          title: data.title,
          ext: ".md",
          tags: [],
        });

        articleId = article.id;
      } else if (article.title !== data.title) {
        await window.api.updateArticle({ dbId, articleId, title: data.title });
      }

      const markdown = this.state.markdown.peek();

      if (!markdown || markdown !== data.markdown) {
        await window.api.putArticleText(dbId, articleId, data.markdown);
      }

      const page = { href: `${dbId}/articles/${articleId}` };
      this.navStore.insertPage(page, true);
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  setTextarea = (text) => {
    this.textarea.current.value = text;
    if (text !== this.form.state.markdown.value) {
      this.form.setState({ markdown: text });
    }
  };

  insertText = (text) => {
    const textarea = this.textarea.current;
    let value = textarea.value;

    if (textarea.selectionStart || textarea.selectionStart == "0") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      value = `${value.slice(0, start)}${text}${value.slice(end)}`;
    } else {
      value += text;
    }

    this.setTextarea(value);
  };

  openToolModal(evt) {
    const type = evt.target.data.type;
    this.setState({ toolModal: type });
  }
}
