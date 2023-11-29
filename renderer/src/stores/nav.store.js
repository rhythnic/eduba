import { computed } from "@preact/signals";
import { route } from "preact-router";
import { adjust, always } from "ramda";
import { SignalStateModel } from "../lib/signal-state-model";
import { PersistToMap } from "../../../lib/persist/persist-to-map";

export class NavStore extends SignalStateModel {
  constructor(spec) {
    super({
      storage: new PersistToMap(spec.cache, NavStore.name),
      state: {
        tabs: { value: [], cache: true },
        url: { value: "/", cache: true },
      },
    });

    this.appStore = spec.appStore;
    this.cache = spec.cache;

    this.active = computed(() => {
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
  }

  async initialize() {
    await super.initialize();
    route(this.state.url.peek());
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

  handleRoute = ({ url }) => {
    // url is / on first render or if all tabs are closed
    if (url === "/" && this.state.tabs.peek().length) {
      // Tabs exist so this must be first render
      // Ignore so cached url is not replaced
      return;
    }

    this.setState({ url });
  };

  goBack = () => {
    const { pageIndex } = this.ensureActiveTab();
    this.goToPageIndex(pageIndex - 1);
  };

  goForward = () => {
    const { pageIndex } = this.ensureActiveTab();
    this.goToPageIndex(pageIndex + 1);
  };

  goToPageIndex(index) {
    let { tab, tabIndex } = this.ensureActiveTab();
    const page = tab.pages[index];
    const tabs = this.state.tabs.peek();
    this.setState({
      tabs: adjust(tabIndex, always({ ...tab, pageId: page.id }), tabs),
    });
    route(`/${page.id}/${page.href}`);
  }

  insertPage(page, replaceActivePage) {
    let { tab, tabIndex, pageIndex } = this.ensureActiveTab();
    page = this.createPage(page);
    const index = replaceActivePage ? pageIndex : pageIndex + 1;
    const pages = [...tab.pages.slice(0, index), page];

    for (const page of tab.pages.slice(index)) {
      this.clearPageStorage(page.id);
    }

    this.setState({
      tabs: adjust(
        tabIndex,
        always({ pageId: page.id, pages }),
        this.state.tabs.peek()
      ),
    });

    route(`/${page.id}/${page.href}`);
  }

  insertTab(page) {
    page = this.createPage(page);
    const tabs = this.state.tabs.peek();
    let tab = { pageId: page.id, pages: [page] };
    this.setState({ tabs: [...tabs, tab] });
    route(`/${page.id}/${page.href}`);
  }

  createPage(data) {
    return {
      ...data,
      id: `${Date.now()}`,
      href: data.href.startsWith("/") ? data.href.slice(1) : data.href,
    };
  }

  removeActiveTab = () => {
    const { tabIndex } = this.ensureActiveTab();
    this.removeTab(tabIndex);
  };

  removeTab(index) {
    const tabs = this.state.tabs.peek();
    const { tabIndex } = this.ensureActiveTab();

    const nextTabs = [...tabs.slice(0, index), ...tabs.slice(index + 1)];
    this.setState({ tabs: nextTabs });

    if (nextTabs.length) {
      if (index === tabIndex) {
        const nextTabIndex = Math.min(tabIndex, nextTabs.length - 1);
        const { pageId, pages } = nextTabs[nextTabIndex];
        const page = pages.find((p) => p.id === pageId);
        route(`/${page.id}/${page.href}`);
      }
    } else {
      route("/");
    }

    if (nextTabs.length) {
      for (const page of tabs[index].pages) {
        this.clearPageStorage(page.id);
      }
    } else {
      this.clearPageStorage();
    }
  }

  async clearPageStorage(pageId) {
    try {
      if (pageId) {
        await this.cache.delete(pageId);
      } else {
        const pageIdRegex = /\d+/;
        let keys = Array.from(await this.cache.keys());
        keys = keys.filter((key) => pageIdRegex.test(key));
        await Promise.all(keys.map((key) => this.cache.delete(key)));
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  updateActivePageTitle(title) {
    const { tabIndex, page, pageIndex } = this.ensureActiveTab();
    const tabs = this.state.tabs.peek();
    const tab = tabs[tabIndex];
    const pages = adjust(pageIndex, always({ ...page, title }), tab.pages);
    this.setState({ tabs: adjust(tabIndex, always({ ...tab, pages }), tabs) });
  }
}
