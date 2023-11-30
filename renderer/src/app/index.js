/**
 * Dependency injection container
 */

import { createContext } from "preact";
import { cacheKey } from "../constants";
import { App, fromClass } from "../../../lib/app";
import { Emitter } from "../../../lib/emitter";
import { AppStore } from "../stores/app.store";
import { NavStore } from "../stores/nav.store";
import { PublisherStore } from "../stores/publisher.store";
import { BookmarkStore } from "../stores/bookmark.store";
import { PersistedMap } from "../../../lib/persisted-map";
import { PersistToLocalStorage } from "../../../lib/persist/persist-to-local-storage";
import { AuthStore } from "../stores/auth.store";

export const app = new App();

export const AppContext = createContext(app);

app
  .register({
    // Key-value map stored to localstorage
    cache: new PersistedMap({
      storage: new PersistToLocalStorage(cacheKey, "[]"),
    }),

    events: fromClass(Emitter),

    edubaSdk: {
      ...window.api,
      publicEvents: window.publicEvents,
      rendererEvents: window.rendererEvents,
    },

    authStore: fromClass(AuthStore),
    appStore: fromClass(AppStore),
    navStore: fromClass(NavStore),
    publisherStore: fromClass(PublisherStore),
    bookmarkStore: fromClass(BookmarkStore),
  })
  .catch((err) => {
    console.error(err);
  });
