import { h } from "preact";
import { useContext } from "preact/hooks";
import { BookmarkIcon, FolderIcon } from "@heroicons/react/24/solid";
import { BookmarksContext } from "../../controllers/bookmarks.controller";
import TabLink from "../tab-link.ui";
import { styles } from "../../lib/utils";
import { BookmarkRowMenu } from "./bookmark-row-menu.ui";

export default function BookmarkRow({ bookmark, showMenu, class: className }) {
  const ctrl = useContext(BookmarksContext);

  const isFolder = bookmark.type === "folder";

  const icon = isFolder ? (
    <FolderIcon class="w-6 h-6 text-inherit mr-4" />
  ) : (
    <BookmarkIcon class="w-6 h-6 text-inherit mr-4" />
  );

  const title = isFolder ? (
    <a
      class="flex-1 cursor-pointer"
      data-id={bookmark.id}
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
      {!!showMenu && (
        <BookmarkRowMenu bookmark={bookmark} isFolder={isFolder} />
      )}
    </li>
  );
}
