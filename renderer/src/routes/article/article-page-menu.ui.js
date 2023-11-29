import { h, Fragment } from "preact";
import { useContext } from "preact/hooks";
import {
  BookmarkIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  ShareIcon,
  SignalIcon,
  SignalSlashIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import TabLink from "../../components/tab-link.ui";
import { ArticlePageContext } from "./article-page.controller";

export default function ArticleMenu() {
  const ctrl = useContext(ArticlePageContext);

  const publisher = ctrl.state.publisher.value;
  const article = ctrl.state.article.value;
  const isPublisherArticle = ctrl.isPublisherArticle.value;

  return (
    <div class="dropdown dropdown-bottom dropdown-end">
      <label tabIndex={0} class="btn btn-ghost">
        <EllipsisVerticalIcon class="w-6 h-6 text-inherit" />
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a onClick={ctrl.shareArticle}>
            <ShareIcon class="w-6 h-6 text-inherit" />
            Share
          </a>
        </li>
        {isPublisherArticle && !publisher.subscribed && (
          <li>
            <a onClick={ctrl.subscribeToPublisher}>
              <StarIcon class="w-6 h-6 text-inherit" />
              Subscribe
            </a>
          </li>
        )}
        {isPublisherArticle && publisher.subscribed && (
          <li>
            <a onClick={ctrl.unsubscribeFromPublisher}>
              <StarIcon class="w-6 h-6 text-inherit" />
              Unsubscribe
            </a>
          </li>
        )}
        <li>
          <a onClick={ctrl.openEditBookmark}>
            <BookmarkIcon class="w-6 h-6 text-inherit" />
            Bookmark
          </a>
        </li>
        {!isPublisherArticle && (
          <li>
            <TabLink
              href={`${publisher.dbId}/articles/${publisher.article.id}`}
              newTab={true}
              class="join-item mr-4"
            >
              <UserCircleIcon class="w-6 h-6 text-inherit" />
              Publisher
            </TabLink>
          </li>
        )}
        {isPublisherArticle && (
          <li>
            <TabLink
              href={`${publisher.dbId}/articles`}
              newTab={true}
              pageTitle="Articles"
              class="join-item mr-4"
            >
              <UserCircleIcon class="w-6 h-6 text-inherit" />
              Articles
            </TabLink>
          </li>
        )}

        {article._writable && (
          <li>
            <TabLink
              pageTitle="Edit Article"
              href={`edit/articles/${article.dbId}/${article.id}`}
              replace={true}
              class="join-item mr-4"
            >
              <PencilSquareIcon class="w-6 h-6 text-inherit" />
              Edit
            </TabLink>
          </li>
        )}
      </ul>
    </div>
  );
}
