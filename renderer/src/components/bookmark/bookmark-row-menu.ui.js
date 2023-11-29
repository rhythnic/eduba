import { useContext } from "preact/hooks";
import { BookmarksContext } from "../../controllers/bookmarks.controller";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export function BookmarkRowMenu({ isFolder, bookmark }) {
  const ctrl = useContext(BookmarksContext);

  const editText = isFolder ? "Rename" : "Edit";

  return (
    <div class="dropdown dropdown-bottom dropdown-end">
      <label tabIndex={0} class="btn m-1">
        <EllipsisVerticalIcon class="w-6 h-6 text-inherit" />
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a data-id={bookmark.id} onClick={ctrl.editBookmark}>
            {editText}
          </a>
        </li>
        <li>
          <a data-id={bookmark.id} onClick={ctrl.deleteBookmark}>
            Delete
          </a>
        </li>
        <li>
          <a data-id={bookmark.id} onClick={ctrl.cutBookmark}>
            Cut
          </a>
        </li>
        <li>
          <a data-id={bookmark.id} onClick={ctrl.copyBookmark}>
            Copy
          </a>
        </li>
      </ul>
    </div>
  );
}
