import { EventEmitter, captureRejectionSymbol } from "events";

export class Event {
  constructor(init: Record<string, unknown>) {
      Object.assign(this, init);
  }
}

// Emitter
export class Emitter extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](error: Error, event: string, ...args: any[]) {
    this.emit("error", error, event, ...args);
  }

  dispatch(event: Event) {
    this.emit(event.constructor.name, event);
  }
}
