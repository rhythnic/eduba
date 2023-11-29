import { h } from "preact";
import { Router } from "preact-router";
import { createHashHistory } from "history";
import PublisherArticlesPage from "./routes/publisher-articles/publisher-articles-page.ui";
import NotFoundPage from "./routes/not-found/not-found-page.ui";
import NewTabPage from "./routes/new-tab/new-tab-page.ui";
import HomePage from "./routes/home/home-page.ui";
import ArticlePage from "./routes/article/article-page.ui";
import ArticleEditPage from "./routes/article-edit/article-edit-page.ui";
import BookmarksPage from "./routes/bookmarks/bookmarks-page.ui";
import { useProviders } from "./hooks/use-providers.hook";

export default function AppRouter() {
  const [navStore] = useProviders(["navStore"]);

  return (
    <Router history={createHashHistory()} onChange={navStore.handleRoute}>
      <HomePage path="/" />
      <NewTabPage path="/:pageId/newtab" />
      <ArticlePage path="/:pageId/:dbId/articles/:articleId" />
      <ArticleEditPage path="/:pageId/edit/articles/:dbId?/:articleId?" />
      <PublisherArticlesPage path="/:pageId/:dbId/articles" />
      <BookmarksPage path="/:pageId/bookmarks" />
      <NotFoundPage default />
    </Router>
  );
}
