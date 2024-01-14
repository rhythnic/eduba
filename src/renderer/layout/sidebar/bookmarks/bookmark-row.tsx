import { h } from "preact";
import { useContext } from "preact/hooks";
import { BookmarkIcon, FolderIcon } from "@heroicons/react/24/solid";
import TabLink from "@/renderer/components/tab-link";
import { styles } from "@/renderer/utils";
import { SidebarBookmarksContext, SidebarBookmarksController } from "./sidebar-bookmarks.ctrl";

export interface BookmarkRowProps {
  bookmark: any;
  class?: string;
}

export default function BookmarkRow({ bookmark, class: className = "" }: BookmarkRowProps) {
  const ctrl = useContext<SidebarBookmarksController>(SidebarBookmarksContext);

  const isFolder = bookmark.type === "folder";

  const icon = isFolder ? (
    <FolderIcon class="w-6 h-6 text-inherit mr-4" />
  ) : (
    <BookmarkIcon class="w-6 h-6 text-inherit mr-4" />
  );

  const title = isFolder ? (
    <a
      class="flex-1 cursor-pointer"
      data-id={bookmark._id}
      onClick={ctrl.openFolder}
    >
      {bookmark.title}
    </a>
  ) : (
    <TabLink href={bookmark.href} newTab={true} class="flex-1">
      {bookmark.title}
    </TabLink>
  );

  return (
    <li
      class={styles({
        [className]: !!className,
        "my-2 pl-2 flex items-center": true,
      })}
    >
      {icon}
      {title}
    </li>
  );
}
