import { h } from "preact";
import ArticleViewer from "../../components/article-viewer.ui";
import BookmarkEdit from "../../components/bookmark/bookmark-edit.ui";
import ArticlePageMenu from "./article-page-menu.ui";
import { useController } from "../../hooks/use-controller.hook";
import {
  ArticlePageController,
  ArticlePageContext,
} from "./article-page.controller";

export default function ArticlePage(props) {
  const ctrl = useController(ArticlePageController, props, [props.pageId]);

  if (!(ctrl.state.publisher.value && ctrl.state.article.value)) return;

  return (
    <ArticlePageContext.Provider value={ctrl}>
      <main class="page p-4" key={props.pageId}>
        <div class="flex justify-end items-center mb-4">
          <ArticlePageMenu />
        </div>
        <ArticleViewer
          markdown={ctrl.displayMarkdown}
          mediaCache={ctrl.mediaCache}
        />
        <BookmarkEdit
          bookmarkSignal={ctrl.state.bookmarkInEdit}
          disableHrefEdit={true}
          onDone={ctrl.handleBookmarkEditDone}
        />
      </main>
    </ArticlePageContext.Provider>
  );
}
