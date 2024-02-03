import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { SidebarStore } from "@/renderer/stores";
import { SidebarTab } from "@/renderer/stores/sidebar.store";
import { inject, injectable } from "inversify";

@injectable()
export class SidebarController extends ComponentController<never> {
    constructor(
        @inject(SidebarStore) private readonly sidebarStore: SidebarStore
    ) {
        super()
    }

    selectTab = ({ currentTarget }: Event) => {
        if (currentTarget instanceof HTMLAnchorElement) {
            this.sidebarStore.selectTab(currentTarget.dataset.tab as SidebarTab);
        }
    };
}