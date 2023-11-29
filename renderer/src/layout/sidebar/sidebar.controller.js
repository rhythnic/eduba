import { SignalStateModel } from "../../lib/signal-state-model";
import { PersistToMap } from "../../../../lib/persist/persist-to-map";

export class SidebarController extends SignalStateModel {
  constructor(spec) {
    super({
      storage: new PersistToMap(spec.cache, SidebarController.name),
      state: {
        tabIndex: { value: 0, cache: true },
      },
    });

    this.authStore = spec.authStore;
  }

  selectTab = ({ target }) => {
    if (target.tagName !== "A") return;
    this.setState({ tabIndex: parseInt(target.dataset.index) });
  };
}
