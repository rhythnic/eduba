import { createContext, h } from "preact";

export const NavContext = createContext();

export class NavController {
  constructor(spec) {
    this.navStore = spec.navStore;
  }

  handleCloseClick = ({ currentTarget }) => {
    this.navStore.removeTab(parseInt(currentTarget.dataset.index));
  };
}
