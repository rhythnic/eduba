import { PageAddedEvent } from "@/events/renderer";
import { Emitter } from "@/lib/emitter";
import { signalState } from "@/lib/signal-state";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { TYPES } from "@/renderer/di";
import { inject, injectable } from "inversify";

export enum SidebarTab {
    Subscriptions = "Subscriptions",
    UserMenu = "UserMenu",
    Pages = "Pages"
}

export interface SidebarControllerState {
    tab: SidebarTab
}

@injectable()
export class SidebarController extends ComponentController<never> {
    public state = signalState<SidebarControllerState>({
        tab: SidebarTab.Pages
    });

    constructor(
        @inject(TYPES.Events) private readonly events: Emitter
    ) {
        super()

        this.events.on(PageAddedEvent.name, this.handlePageAdded)
    }

    destroy() {
        this.events.off(PageAddedEvent.name, this.handlePageAdded)
    }

    handlePageAdded = () => {
        this.state._set({ tab: SidebarTab.Pages })
    }

    selectTab = ({ currentTarget }: Event) => {
        if (currentTarget instanceof HTMLAnchorElement) {
            this.state._set({ tab: currentTarget.dataset.tab as SidebarTab });
        }
    };
}