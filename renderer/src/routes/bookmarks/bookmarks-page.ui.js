import { h } from "preact";
import {
  BookmarksContext,
  BookmarksController,
} from "../../controllers/bookmarks.controller";
import BookmarkEdit from "../../components/bookmark/bookmark-edit.ui";
import BookmarkRow from "../../components/bookmark/bookmark-row.ui";
import BookmarkBreadcrumbs from "../../components/bookmark/bookmark-breadcrumbs.ui";
import BookmarksPageMenu from "./bookmarks-page-menu.ui";
import { useController } from "../../hooks/use-controller.hook";

export default function BookmarkManager(props) {
  const ctrl = useController(BookmarksController, props);

  return (
    <BookmarksContext.Provider value={ctrl}>
      <main class="page p-4" key={props.pageId}>
        <div class="flex justify-between items-center">
          <BookmarkBreadcrumbs />
          <BookmarksPageMenu />
        </div>
        <ul class="w-full">
          {ctrl.activeList.value.map((bookmark) => (
            <BookmarkRow
              key={bookmark.id}
              bookmark={bookmark}
              class="bg-base-200"
              showMenu={true}
            />
          ))}
        </ul>
        <BookmarkEdit
          bookmarkSignal={ctrl.state.bookmarkInEdit}
          onDone={ctrl.handleBookmarkEditDone}
        />
      </main>
    </BookmarksContext.Provider>
  );
}
