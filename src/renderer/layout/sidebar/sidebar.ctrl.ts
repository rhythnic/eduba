import { signalState } from "@/lib/signal-state";
import { TYPES } from "@/renderer/di";
import { inject, injectable } from "inversify";
import { AuthStore } from "@/renderer/stores";
import { ComponentController } from "@/renderer/controllers/component.ctrl";

export interface SidebarControllerState {
  tabIndex: number;
}

@injectable()
export class SidebarController extends ComponentController<never>{
  public state = signalState<SidebarControllerState>({
    tabIndex: 0
  });

  constructor(
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(AuthStore) private readonly authStore: AuthStore
  ) {
    super();
  }

  initialize(): void {
    this.state._configure({ storage: this.storage, key: "SidebarController" });
  }

  selectTab = ({ target }: Event) => {
    if (target instanceof HTMLElement) {
      if (target.tagName !== "A") return;
      this.state._set({ tabIndex: parseInt(target.dataset.index) });
    }
  };
}
