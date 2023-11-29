import { computed } from "@preact/signals";
import { createContext } from "preact";
import { last, omit } from "ramda";
import { Alert } from "../events";
import { AlertType } from "../enums";
import { SignalStateModel } from "../lib/signal-state-model";
import { PersistToMap } from "../../../lib/persist/persist-to-map";

export const BookmarksContext = createContext();

export const ClipType = {
  Copy: "copy",
  Cut: "cut",
};

export class BookmarksController extends SignalStateModel {
  constructor(spec) {
    super({
      storage: spec.pageId && new PersistToMap(spec.cache, spec.pageId),
      state: {
        openFolderPath: { value: [], cache: true },
        bookmarkInEdit: { value: null, cache: true },
        clippedBookmark: { value: null, cache: true },
      },
    });

    this.bookmarkStore = spec.bookmarkStore;
    this.appStore = spec.appStore;
    this.events = spec.events;

    this.activeList = computed(() => {
      const bookmarks = this.bookmarkStore.state.bookmarks.value;
      const clipped = this.state.clippedBookmark.value;
      const openFolderId = last(this.state.openFolderPath.value);
      const activeBookmarks = openFolderId
        ? bookmarks.filter((x) => x.parent === openFolderId)
        : bookmarks.filter((x) => !x.parent);
      return clipped && clipped.type === ClipType.Cut
        ? activeBookmarks.filter((x) => x.id !== clipped.id)
        : activeBookmarks;
    });

    this.openFolders = computed(() => {
      return this.state.openFolderPath.value.map((id) =>
        this.bookmarkStore.state.bookmarks.value.find((x) => x.id === id)
      );
    });
  }

  addBookmarkInternal(type) {
    const openFolderId = last(this.state.openFolderPath.peek());
    const bookmark = { type, href: "", title: "" };
    if (openFolderId) {
      bookmark.parent = openFolderId;
    }
    this.setState({ bookmarkInEdit: bookmark });
  }

  addBookmark = () => {
    this.addBookmarkInternal("bookmark");
  };

  addFolder = () => {
    this.addBookmarkInternal("folder");
  };

  closeOpenFolder = () => {
    this.setState({ openFolderPath: [] });
  };

  copyBookmark = (evt) => {
    const { id } = evt.target.dataset;
    this.setState({ clippedBookmark: { id, type: ClipType.Copy } });
    this.events.emit(Alert, {
      type: AlertType.Info,
      message: "Bookmark copied",
      timeout: 3000,
    });
  };

  cutBookmark = (evt) => {
    const { id } = evt.target.dataset;
    this.setState({ clippedBookmark: { id, type: ClipType.Cut } });
    this.events.emit(Alert, {
      type: AlertType.Info,
      message: "Bookmark cut",
      timeout: 3000,
    });
  };

  deleteBookmark = async (evt) => {
    try {
      const { id } = evt.target.dataset;
      await window.api.deleteBookmark(id);
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  editBookmark = (evt) => {
    const { id } = evt.target.dataset;
    const bookmark = this.bookmarkStore.state.bookmarks
      .peek()
      .find((x) => x.id === id);
    this.setState({ bookmarkInEdit: bookmark });
  };

  handleBookmarkEditDone = () => {
    this.setState({ bookmarkInEdit: null });
  };

  openFolder = (evt) => {
    const { id } = evt.target.dataset;
    const openFolderPath = this.state.openFolderPath.peek();
    const openIndex = openFolderPath.indexOf(id);
    if (openIndex > -1) {
      this.setState({ openFolderPath: openFolderPath.slice(0, openIndex + 1) });
    } else {
      this.setState({ openFolderPath: [...openFolderPath, id] });
    }
  };

  pasteBookmark = async () => {
    try {
      const clipped = this.state.clippedBookmark.peek();
      if (!clipped) return;

      const bookmark = this.bookmarkStore.state.bookmarks
        .peek()
        .find((x) => x.id === clipped.id);
      if (!bookmark) return;

      const parent = last(this.state.openFolderPath.peek());
      bookmark.parent = parent;

      switch (clipped.type) {
        case ClipType.Copy:
          await this.bookmarkStore.createBookmark(omit(["id"], bookmark));
          break;
        case ClipType.Cut:
          await this.bookmarkStore.updateBookmark(bookmark);
          break;
      }

      this.setState({ clippedBookmark: null });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
