import { Signal, computed } from "@preact/signals";
import { RouterOnChangeArgs } from "preact-router";
import { signalState } from "@/lib/signal-state";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { AppStore } from "@/renderer/stores";
import { LogFunctions } from "electron-log";
import log from 'electron-log/renderer';
import { IRoute } from "../types";

export interface Tab {
  pages: Page[];
  pageId?: string;
}

export interface Page {
  id: string;
  href: string;
  title: string;
}

export interface NavStoreState {
  tabs: Tab[];
  url: string;
}

export interface ActiveReport {
  tabIndex: number;
  tab: any;
  pageIndex: number;
  page: any;
}

@injectable()
export class NavStore {
  private readonly log: LogFunctions = log.scope("NavStore");

  public state = signalState<NavStoreState>({ tabs: [], url: "/" });

  public active: Signal<ActiveReport>;

  public canGoBack: Signal<boolean>;

  public canGoForward: Signal<boolean>;

  constructor(
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(TYPES.Route) private readonly route: IRoute
  ) {
    this.state._configure({ storage: this.storage, key: "NavStore" });

    this.active = computed<ActiveReport>(() => {
      const url = this.state.url.value || "/";
      if (url === "/") return null;
      const pageId = url.split("/")[1];
      const tabs = this.state.tabs.value;

      let tabIndex = -1;
      let pageIndex = -1;

      for (let i = 0; i < tabs.length; i++) {
        for (let j = 0; j < tabs[i].pages.length; j++) {
          if (tabs[i].pages[j].id === pageId) {
            tabIndex = i;
            pageIndex = j;
            break;
          }
        }
      }

      if (tabIndex < 0) return null;

      return {
        tabIndex,
        tab: tabs[tabIndex],
        pageIndex,
        page: tabs[tabIndex].pages[pageIndex],
      };
    });

    this.canGoBack = computed(() => {
      const active = this.active.value;
      return !!active && active.pageIndex > 0;
    });

    this.canGoForward = computed(() => {
      const active = this.active.value;
      return !!active && active.pageIndex < active.tab.pages.length - 1;
    });

    this.route(this.state.url.peek());
  }

  addNewTab = () => {
    this.insertTab({ title: "New Tab", href: "newtab" });
  };

  ensureActiveTab() {
    const active = this.active.peek();
    if (!active) {
      throw new Error("Not able to determine active tab");
    }
    return active;
  }

  handleRoute = ({ url }: RouterOnChangeArgs) => {
    // url is / on first render or if all tabs are closed
    if (url === "/" && this.state.tabs.peek().length) {
      // Tabs exist so this must be first render
      // Ignore so cached url is not replaced
      return;
    }

    this.state._set({ url });
  };

  goBack = () => {
    const { pageIndex } = this.ensureActiveTab();
    this.goToPageIndex(pageIndex - 1);
  };

  goForward = () => {
    const { pageIndex } = this.ensureActiveTab();
    this.goToPageIndex(pageIndex + 1);
  };

  goToPageIndex(index: number) {
    const { tab, tabIndex } = this.ensureActiveTab();
    const page = tab.pages[index];
    const tabs = this.state.tabs.peek();
    const modifiedTab: Tab = { ...tabs[tabIndex], pageId: page.id };
    this.state._set({
      tabs: [...tabs.slice(0, tabIndex), modifiedTab, ...tabs.slice(tabIndex + 1)]
    })
    this.route(`/${page.id}/${page.href}`);
  }

  insertPage(page: Partial<Page>, replaceActivePage: boolean) {
    const { tab, tabIndex, pageIndex } = this.ensureActiveTab();
    page = this.buildPage(page);
    const index = replaceActivePage ? pageIndex : pageIndex + 1;
    const pages = [...tab.pages.slice(0, index), page];

    for (const page of tab.pages.slice(index)) {
      this.clearPageStorage(page.id);
    }

    let tabs = this.state.tabs.peek();

    tabs = [
      ...tabs.slice(0, tabIndex),
      { pageId: page.id, pages },
      ...tabs.slice(tabIndex + 1)
    ]

    this.state._set({ tabs });

    this.route(`/${page.id}/${page.href}`);
  }

  insertTab(page: Partial<Page>): void {
    page = this.buildPage(page);
    const tabs = this.state.tabs.peek();
    const tab = { pageId: page.id, pages: [page] };
    this.state._set({ tabs: [...tabs, tab] });
    this.route(`/${page.id}/${page.href}`);
  }

  buildPage(data: Partial<Page>): Page {
    return {
      title: data.title || "",
      id: `page_${Date.now()}`,
      href: data.href.startsWith("/") ? data.href.slice(1) : data.href,
    };
  }

  removeActiveTab = () => {
    const { tabIndex } = this.ensureActiveTab();
    this.removeTab(tabIndex);
  };

  removeTab(index: number) {
    const tabs = this.state.tabs.peek();
    const { tabIndex } = this.ensureActiveTab();

    const nextTabs = [...tabs.slice(0, index), ...tabs.slice(index + 1)];
    this.state._set({ tabs: nextTabs });

    if (nextTabs.length) {
      if (index === tabIndex) {
        const nextTabIndex = Math.min(tabIndex, nextTabs.length - 1);
        const { pageId, pages } = nextTabs[nextTabIndex];
        const page = pages.find((p) => p.id === pageId);
        this.route(`/${page.id}/${page.href}`);
      }
    } else {
      this.route("/");
    }

    if (nextTabs.length) {
      for (const page of tabs[index].pages) {
        this.clearPageStorage(page.id);
      }
    } else {
      this.clearPageStorage();
    }
  }

  async clearPageStorage(pageId?: string) {
    try {
      if (pageId) {
        await this.storage.removeItem(pageId);
      } else {
        // Clear all pages from cache
        for (let i = 0; i < localStorage.length; i++){
          const key = localStorage.key(i);
          if (key.startsWith("page_")) {
            this.storage.removeItem(key);
          }
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  updatePageTitle(title: string) {
    const { tabIndex, page, pageIndex } = this.ensureActiveTab();
    let tabs = this.state.tabs.peek();
    const tab = tabs[tabIndex];
    const pages = [
      ...tab.pages.slice(0, pageIndex),
      { ...page, title },
      ...tab.pages.slice(pageIndex + 1)
    ]
    tabs = [
      ...tabs.slice(0, tabIndex),
      { ...tabs[tabIndex], pages },
      ...tabs.slice(tabIndex + 1)
    ];
    this.state._set({ tabs });
  }
}
