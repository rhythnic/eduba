import { Alert } from "../events";
import { AlertType } from "../enums";

export class AppStore {
  constructor(spec) {
    this.events = spec.events;
  }

  reportError = (error, showAlert = true) => {
    console.error(error);
    window.rendererEvents.reportError(error.stack);

    if (showAlert) {
      this.events.emit(Alert, {
        type: AlertType.Error,
        message: error.message,
      });
    }
  };
}
