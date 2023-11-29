const { EventEmitter, captureRejectionSymbol } = require("events");

// Emitter
class Emitter extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](error, topic, ...args) {
    this.emit("error", error, topic, ...args);
  }
}

module.exports = {
  Emitter,
};
