import { h, Fragment } from "preact";
import { useContext } from "preact/hooks";
import {
  BookmarkIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  ShareIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import TabLink from "@/renderer/components/tab-link";
import { ArticlePageContext, ArticlePageController } from "./article-page.ctrl";
import { useProvider } from "@/renderer/hooks";
import { AuthStore } from "@/renderer/stores";

export default function ArticleMenu() {
  const ctrl = useContext<ArticlePageController>(ArticlePageContext);
  const authStore = useProvider<AuthStore>(AuthStore);

  const publisher = ctrl.state.publisher.value;
  const article = ctrl.state.article.value;
  const isPublisherArticle = ctrl.isPublisherArticle.value;
  const signedIn = authStore.state.sessionActive.value;

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
        {signedIn && isPublisherArticle && !publisher._subscribed && !publisher._writable &&(
          <li>
            <a onClick={ctrl.subscribeToPublisher}>
              <StarIcon class="w-6 h-6 text-inherit" />
              Subscribe
            </a>
          </li>
        )}
        {signedIn && isPublisherArticle && publisher._subscribed && (
          <li>
            <a onClick={ctrl.unsubscribeFromPublisher}>
              <StarIcon class="w-6 h-6 text-inherit" />
              Unsubscribe
            </a>
          </li>
        )}
        {signedIn && (
          <li>
            <a onClick={ctrl.openEditBookmark}>
              <BookmarkIcon class="w-6 h-6 text-inherit" />
              Bookmark
            </a>
          </li>
        )}
        {!isPublisherArticle && (
          <li>
            <TabLink
              href={`${publisher._db}/articles/${publisher.article._id}`}
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
              href={`${publisher._db}/articles`}
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
              href={`edit/articles/${article._db}/${article._id}`}
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
