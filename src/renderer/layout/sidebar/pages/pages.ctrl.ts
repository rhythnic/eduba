import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { SidebarStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";

@injectable()
export class PagesController extends ComponentController<never> {
    constructor(
        @inject(SidebarStore) private readonly sidebarStore: SidebarStore
    ){
        super()
    }
    
    closePage = (evt: Event): void => {
        if (!(evt.currentTarget instanceof HTMLButtonElement)) {
            return;
        }
        
        const pageId = evt.currentTarget.dataset.page;

        if (pageId) {
            this.sidebarStore.closePage(pageId);
        }
    }
}