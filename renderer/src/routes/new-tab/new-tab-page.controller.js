import { SignalStateModel } from "../../lib/signal-state-model";
import { FormController } from "../../controllers/form.controller";
import { PersistToMap } from "../../../../lib/persist/persist-to-map";

export class NewTabPageController extends SignalStateModel {
  constructor(spec) {
    super({
      storage: new PersistToMap(spec.cache, spec.pageId),
    });

    this.form = new FormController({
      storage: this.sub("form", { cache: true }),
      onSubmit: this.insertPage,
      state: {
        href: { value: "", cache: true },
      },
    });

    this.navStore = spec.navStore;
  }

  async initialize() {
    await super.initialize();
    await this.form.initialize();
  }

  destroy() {
    this.form.destroy();
    super.destroy();
  }

  insertPage = ({ href }) => {
    this.navStore.insertPage({ href }, true);
  };
}
