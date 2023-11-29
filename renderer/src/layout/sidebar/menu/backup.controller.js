import { SignalStateModel } from "../../../lib/signal-state-model";
import { PersistToMap } from "../../../../../lib/persist/persist-to-map";
import { FormController } from "../../../controllers/form.controller";
import { Alert } from "../../../events";
import { AlertType } from "../../../enums";

export const BackupAction = {
  Backup: "Backup",
  Restore: "Restore",
};

export class BackupController extends SignalStateModel {
  constructor(spec) {
    super({
      storage: new PersistToMap(spec.cache, BackupController.name),
      state: {
        backupInProgress: { value: false, cache: true },
      },
    });

    this.form = new FormController({
      storage: this.sub("form", { cache: true }),
      onSubmit: this.handleSubmit,
      state: {
        backupDir: { value: "", cache: true },
        action: { value: BackupAction.Backup, cache: true },
      },
    });

    this.appStore = spec.appStore;
    this.authStore = spec.authStore;
    this.events = spec.events;
  }

  async initialize() {
    await super.initialize();
    await this.form.initialize();
  }

  destroy() {
    this.form.destroy();
    super.destroy();
  }

  handleSubmit = ({ backupDir, action }) => {
    switch (action) {
      case BackupAction.Backup:
        this.backupData(backupDir);
        break;
      case BackupAction.Restore:
        this.restoreData(backupDir);
        break;
    }
  };

  backupData(backupDir) {
    if (this.state.backupInProgress.peek()) return;

    window.api
      .backupData({ backupDir })
      .then(() => {
        this.setState({ backupInProgress: false });
        this.events.emit(Alert, {
          type: AlertType.Success,
          message: "Backup finished",
          timeout: 3000,
        });
      })
      .catch(this.appStore.reportError)
      .finally(() => {
        console.log("FINALLY done");
        this.props.onDone();
      });
  }

  restoreData(backupDir) {
    if (this.state.backupInProgress.peek()) return;

    window.api
      .restoreData({ backupDir })
      .then(() => {
        this.setState({ backupInProgress: false });
        this.events.emit(Alert, {
          type: AlertType.Success,
          message: "Restore finished",
          timeout: 3000,
        });
      })
      .catch(this.appStore.reportError)
      .finally(this.props.onDone);
  }

  selectBackupDir = async () => {
    try {
      this.form.setState({ backupDir: await window.api.selectBackupDir() });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
