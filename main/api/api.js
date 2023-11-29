/**
 * The Api class setups the interface between main and renderer
 * Api coordinates with Preloader to expose 3 objects on window
 *   window.api - All methods exposed by controllers
 *   window.publicEvents - Main events exposed to the renderer
 *   window.rendererEvents - Events from renderer listened to by main
 */

const { RendererEvent } = require("../events");
const { PublicEventNames, RendererEventType } = require("./api-events");

class Api {
  constructor(deps) {
    this.events = deps.events;
    this.ipcMain = deps.ipcMain;
    this.controller = deps.controller;
    this.clipboard = deps.clipboard;
    this.logger = deps.logger.namespace(Api.name);
  }

  initialize() {
    this.events.on(RendererEvent, this.handleRendererEvent.bind(this));
  }

  handleRendererEvent({ topic, args }) {
    switch (topic) {
      case RendererEventType.CopyToClipboard: {
        const [text] = args;
        this.clipboard.writeText(text);
        break;
      }

      case RendererEventType.ReportError: {
        const [errorStack] = args;
        this.logger.error("renderer", errorStack);
        break;
      }
    }
  }

  exposePublicApi(webContents) {
    const { controller } = this;

    const publicApi = Object.getOwnPropertyNames(
      Object.getPrototypeOf(controller)
    ).filter(
      (name) => typeof controller[name] === "function" && name !== "constructor"
    );

    for (const name of publicApi) {
      // first arg is an event we don't need
      this.ipcMain.handle(name, async (_, ...args) => {
        try {
          return await controller[name](...args);
        } catch (err) {
          // this.logger.warn("API call failed", err);
          throw err;
        }
      });
    }

    // Handle messages from renderer to main
    for (const topic of Object.values(RendererEventType)) {
      this.ipcMain.on(topic, (_, ...args) => {
        this.events.emit(RendererEvent, { topic, args });
      });
    }

    // Forward public events to the renderer
    for (const name of PublicEventNames) {
      this.events.on(name, (data) => webContents.send(name, data));
    }

    // Describe to Preloader which APIs to expose on window
    this.ipcMain.handle("api-spec", () => ({
      api: publicApi,
      rendererEvents: Object.values(RendererEventType),
      publicEvents: PublicEventNames,
    }));
  }
}

module.exports = {
  Api,
};
