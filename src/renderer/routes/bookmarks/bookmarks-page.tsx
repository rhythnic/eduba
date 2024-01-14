import { h } from "preact";
import BookmarkEdit from "@/renderer/components/bookmark-edit/bookmark-edit";
import { useController } from "@/renderer/hooks/use-controller.hook";
import { BookmarksPageContext, BookmarksPageController, BookmarksPageProps } from "./bookmarks-page.ctrl";
import BookmarkRow from "./bookmark-row";
import BookmarkBreadcrumbs from "./bookmark-breadcrumbs";
import BookmarksPageMenu from "./bookmarks-page-menu";

export default function BookmarkManager(props: BookmarksPageProps) {
  const ctrl = useController<BookmarksPageProps, BookmarksPageController>(
    BookmarksPageController,
    props)
  ;

  return (
    <BookmarksPageContext.Provider value={ctrl}>
      <main class="page p-4" key={props.pageId}>
        <div class="flex justify-between items-center">
          <BookmarkBreadcrumbs />
          <BookmarksPageMenu />
        </div>
        <ul class="w-full">
          {ctrl.activeList.value.map((bookmark) => (
            <BookmarkRow
              key={bookmark._id}
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
    </BookmarksPageContext.Provider>
  );
}
