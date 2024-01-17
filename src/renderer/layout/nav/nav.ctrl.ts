import { NavStore } from "@/renderer/stores";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { inject, injectable } from "inversify";
import { createContext } from "preact";

export const NavContext = createContext(null);

@injectable()
export class NavController extends ComponentController<never> {
  constructor(
    @inject(NavStore) public readonly navStore: NavStore
  ) {
    super();
  }

  handleCloseClick = (evt: { currentTarget: HTMLElement }) => {
    this.navStore.removeTab(parseInt(evt.currentTarget.dataset.index));
  };
}
