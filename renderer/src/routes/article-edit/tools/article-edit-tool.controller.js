import { FormController } from "../../../controllers/form.controller";
import { SignalStateModel } from "../../../lib/signal-state-model";

export class ArticleEditToolController extends SignalStateModel {
  constructor(spec) {
    super({
      storage: spec.storage,
      state: {
        open: { value: false },
      },
    });

    this.form = new FormController({
      storage: this.sub("form", { cache: true }),
      onSubmit: this.insertText,
      state: this._defineState(),
    });

    this.appStore = spec.appStore;
  }

  openModal = (evt) => {
    evt.preventDefault();
    this.setState({ open: true });
  };

  cancel = () => {
    this.setState({ open: false });
    this.form.resetState();
  };

  insertText = async (formState) => {
    try {
      this.parentController.insertText(
        await this.buildInsertionText(formState)
      );
      this.cancel();
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
