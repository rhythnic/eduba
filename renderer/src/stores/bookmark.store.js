import { effect } from "@preact/signals";
import { omit } from "ramda";
import { SignalStateModel } from "../lib/signal-state-model";

const stripBookmarkMeta = (dto) =>
  omit([...Object.keys(dto).filter((key) => key.startsWith("_")), "dbId"], dto);

export class BookmarkStore extends SignalStateModel {
  constructor(spec) {
    super({
      state: {
        bookmarks: { value: [] },
      },
    });

    this.appStore = spec.appStore;
    this.authStore = spec.authStore;
  }

  async initialize() {
    window.publicEvents.onBookmarkChanged(this.refreshBookmarks);

    effect(() => {
      this.handleSessionStatusChange(this.authStore.state.sessionActive.value);
    });
  }

  async handleSessionStatusChange(sessionActive) {
    if (!sessionActive) {
      this.setState({ bookmarks: [] });
      return;
    }

    this.refreshBookmarks();
  }

  createBookmark(dto) {
    return window.api.createBookmark(stripBookmarkMeta(dto));
  }

  refreshBookmarks = async () => {
    try {
      this.setState({ bookmarks: await window.api.findBookmarks() });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  updateBookmark(dto) {
    return window.api.updateBookmark(stripBookmarkMeta(dto));
  }
}
