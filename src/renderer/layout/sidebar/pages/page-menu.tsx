import { h } from "preact";
import { useContext } from "preact/hooks";
import {
  BookmarkIcon,
  PencilSquareIcon,
  ShareIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import TabLink from "@/renderer/components/tab-link";
import { useProvider } from "@/renderer/hooks";
import { AuthStore } from "@/renderer/stores";
import { Page } from "@/renderer/stores/sidebar.store";
import { PagesContext } from "./pages.ctrl";

export interface PageMenuProps {
  page: Page
}

export default function PageMenu(props: PageMenuProps) {
  const ctrl = useContext(PagesContext);
  const authStore = useProvider<AuthStore>(AuthStore);

  const { article, publisher, isPublisherArticle } = props.page;
  const signedIn = authStore.state.sessionActive.value;

  return (
    <ul
      tabIndex={0}
      class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li>
        <a onClick={() => ctrl.share(props.page)}>
          <ShareIcon class="w-6 h-6 text-inherit" />
          Share
        </a>
      </li>

      {signedIn && isPublisherArticle && !publisher._subscribed && !publisher._writable &&(
        <li>
          <a onClick={() => ctrl.subscribeToPublisher(props.page)}>
            <StarIcon class="w-6 h-6 text-inherit" />
            Subscribe
          </a>
        </li>
      )}

      {signedIn && publisher?._subscribed && isPublisherArticle && (
        <li>
          <a onClick={() => ctrl.unsubscribeFromPublisher(props.page)}>
            <StarIcon class="w-6 h-6 text-inherit" />
            Unsubscribe
          </a>
        </li>
      )}

      {signedIn && (
        <li>
          <a onClick={() => ctrl.openEditBookmark(props.page)}>
            <BookmarkIcon class="w-6 h-6 text-inherit" />
            Bookmark
          </a>
        </li>
      )}

      {publisher && !isPublisherArticle && (
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

        {publisher && isPublisherArticle && (
          <li>
            <TabLink
              href={`${publisher._db}/articles`}
              pageTitle={`${publisher.article.title} - Articles`}
              class="join-item mr-4"
            >
              <UserCircleIcon class="w-6 h-6 text-inherit" />
              Articles
            </TabLink>
          </li>
        )}

        {signedIn && article?._writable && (
          <li>
            <TabLink
              pageTitle={`Edit - ${article.title}`}
              href={`edit/articles/${article._db}/${article._id}`}
              class="join-item mr-4"
            >
              <PencilSquareIcon class="w-6 h-6 text-inherit" />
              Edit
            </TabLink>
          </li>
        )}
    </ul>
  );
}
