import { h } from "preact";
import { PublisherArticlesPageController } from "./publisher-articles-page.controller";
import TabLink from "../../components/tab-link.ui";
import { useController } from "../../hooks/use-controller.hook";

export default function PublisherArticlesPage(props) {
  const ctrl = useController(PublisherArticlesPageController, props, [
    props.pageId,
  ]);

  return (
    <main class="page" key={props.pageId}>
      <ul>
        {ctrl.state.articles.value.map((article) => (
          <li class="my-1 mx-4 py-1 px-4 hover:bg-base-200 rounded">
            <TabLink
              href={`${article.dbId}/articles/${article.id}`}
              pageTitle={article.title}
              class="block w-full"
            >
              {article.title}
            </TabLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
