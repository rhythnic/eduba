import { signalState } from "@/lib/signal-state";
import log, { LogFunctions } from "electron-log";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di/types";
import { AppStore } from "./app.store";
import { IRoute } from "../types";
import { RouterOnChangeArgs } from "preact-router";

export enum SidebarTab {
    Subscriptions = "Subscriptions",
    UserMenu = "UserMenu",
    Pages = "Pages"
}

export interface Page {
    id: string;
    href: string;
    title: string;
}
  
export interface SidebarStoreState {
    pages: Page[];
    url: string;
    tab: SidebarTab
}

@injectable()
export class SidebarStore {
    private readonly log: LogFunctions = log.scope("SidebarStore");

    public state = signalState<SidebarStoreState>({
        pages: [],
        url: "/",
        tab: SidebarTab.Pages
    });

    constructor(
        @inject(TYPES.LocalStorage) private readonly storage: Storage,
        @inject(AppStore) private readonly appStore: AppStore,
        @inject(TYPES.Route) private readonly route: IRoute
    ) {
        this.state._configure({ storage: this.storage, key: "SidebarStore" })
            .then(() => {
                route(this.state.url.peek());
            })
    }

    addPage = (data: Partial<Page>): void => {
        const pages = this.state.pages.peek();
        const page = this.buildPage(data);

        this.state._set({
            tab: SidebarTab.Pages,
            pages: [...pages, page]
        });
        
        this.routeToPage(page);
    }

    closePage = (pageId: string): void => {
        let pages = this.state.pages.peek()
        const pageIndex = pages.findIndex(p => p.id === pageId);

        if (pageIndex < 1) {
            return;
        }

        const isActive = this.isActivePage(this.state.url.peek(), pages[pageIndex].id);

        pages = [
            ...pages.slice(0, pageIndex),
            ...pages.slice(pageIndex + 1)
        ]

        this.state._set({ pages });

        if (isActive) {
            if (pages.length) {
                const nextActiveIndex = Math.min(pageIndex, pages.length - 1);
                this.routeToPage(pages[nextActiveIndex]);
            } else {
                this.route("/newtab");
            }
        }
    }

    handleRoute = ({ url }: RouterOnChangeArgs) => {    
        this.state._set({ url });
    };

    replacePage = (pageId: string, data: Partial<Page>): void => {
        let pages = this.state.pages.peek()
        const pageIndex = pages.findIndex(p => p.id === pageId);

        if (pageIndex < 1) {
            this.addPage(data);
            return;
        }

        const isActive = this.isActivePage(this.state.url.peek(), pages[pageIndex].id);
        const page = this.buildPage(data);

        pages = [
            ...pages.slice(0, pageIndex),
            page,
            ...pages.slice(pageIndex + 1)
        ]

        this.state._set({ pages });

        if (isActive) {
            this.routeToPage(page);
        }
    }

    selectTab = ({ target }: Event) => {
        if (target instanceof HTMLElement) {
          if (target.tagName !== "A") return;
          this.state._set({ tab: target.dataset.tab });
        }
    };

    updatePageTitle = (pageId: string, title: string): void => {
        let pages = this.state.pages.peek();
        const pageIndex = pages.findIndex(p => p.id === pageId);

        if (pageIndex > -1) {
            const page = pages[pageIndex];
            pages = [
                ...pages.slice(0, pageIndex),
                { ...page, title },
                ...pages.slice(pageIndex + 1)
            ]

            this.state._set({ pages });
        }
    }

    private routeToPage(page: Page): void {
        this.route(`/${page.id}/${page.href}`);
    }

    private isActivePage(url: string, pageId: string): boolean {
        return url.startsWith(`/${pageId}`);
    }

    private buildPage(page: Partial<Page>): Page {
        return {
            title: page.title || "",
            id: `page_${Date.now()}`,
            href: page.href.startsWith("/") ? page.href.slice(1) : page.href,
        };
    }
}