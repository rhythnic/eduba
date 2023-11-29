import { h } from "preact";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import TabLink from "../../../components/tab-link.ui";
import BookmarkRow from "../../../components/bookmark/bookmark-row.ui";
import BookmarkBreadcrumbs from "../../../components/bookmark/bookmark-breadcrumbs.ui";
import { useProviders } from "../../../hooks/use-providers.hook";
import { useController } from "../../../hooks/use-controller.hook";
import {
  BookmarksContext,
  BookmarksController,
} from "../../../controllers/bookmarks.controller";

export default function SidebarBookmarks(props) {
  const ctrl = useController(BookmarksController, props);

  const [authStore] = useProviders(["authStore"]);

  return (
    <BookmarksContext.Provider value={ctrl}>
      <div>
        <div class="flex justify-between items-center h-12">
          <BookmarkBreadcrumbs />
          {authStore.state.sessionActive.value && (
            <TabLink
              href="bookmarks"
              newTab={true}
              pageTitle="Bookmarks Manager"
              class="ml-3 mr-1"
            >
              <PencilSquareIcon class="w-6 h-6 text-inherit" />
            </TabLink>
          )}
        </div>
        <ul class="w-full">
          {ctrl.activeList.value.map((bookmark) => (
            <BookmarkRow
              key={bookmark.id}
              bookmark={bookmark}
              showMenu={false}
            />
          ))}
        </ul>
      </div>
    </BookmarksContext.Provider>
  );
}
