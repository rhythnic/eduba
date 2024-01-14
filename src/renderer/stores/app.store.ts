import { AlertEvent } from "@/events/renderer/AlertEvent";
import { AlertType } from "@/enums";
import { inject, injectable } from "inversify";
import { Emitter } from "@/lib/emitter";
import { TYPES } from "../di/types";
import { IpcEvents } from "@/api/ipc/types";

@injectable()
export class AppStore {
  constructor(
    @inject(TYPES.Events) private readonly events: Emitter,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents
  ) {}

  reportError = (error: Error, showAlert = true) => {
    console.error(error);
    this.ipcEvents.dispatch.RendererErrorEvent(error.stack);

    if (showAlert) {
      this.events.dispatch(new AlertEvent({
        type: AlertType.Error,
        message: error.message,
      }));
    }
  };
}
