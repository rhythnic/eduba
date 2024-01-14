import { h } from "preact";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import TabLink from "@/renderer/components/tab-link";
import { useProvider } from "@/renderer/hooks/use-provider.hook";
import { useController } from "@/renderer/hooks/use-controller.hook";
import { AuthStore } from "@/renderer/stores";
import { SidebarBookmarksContext, SidebarBookmarksController } from "./sidebar-bookmarks.ctrl";
import BookmarkRow from "./bookmark-row";
import BookmarkBreadcrumbs from "./bookmark-breadcrumbs";

export default function SidebarBookmarks() {
  const ctrl = useController<never, SidebarBookmarksController>(
    SidebarBookmarksController
  );

  const authStore = useProvider<AuthStore>(AuthStore);

  return (
    <SidebarBookmarksContext.Provider value={ctrl}>
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
            <BookmarkRow key={bookmark._id} bookmark={bookmark} />
          ))}
        </ul>
      </div>
    </SidebarBookmarksContext.Provider>
  );
}
