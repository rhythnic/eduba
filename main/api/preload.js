/**
 * Preloader
 * Fetch the spec for the public API and build the objects on window
 * https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
 */

const { contextBridge, ipcRenderer } = require("electron");

class Preloader {
  constructor({ contextBridge, ipcRenderer }) {
    this.contextBridge = contextBridge;
    this.ipcRenderer = ipcRenderer;
  }

  async proxyPublicApi() {
    const apiSpec = await this.ipcRenderer.invoke("api-spec");

    this.contextBridge.exposeInMainWorld("api", this.buildApi(apiSpec.api));

    this.contextBridge.exposeInMainWorld(
      "rendererEvents",
      this.buildRendererEventEmitters(apiSpec.rendererEvents)
    );

    this.contextBridge.exposeInMainWorld(
      "publicEvents",
      this.buildPublicEventSubscribers(apiSpec.publicEvents)
    );
  }

  /*
   * Build an object of methods proxied to the main controllers
   */
  buildApi(Api) {
    return Api.reduce((acc, methodName) => {
      acc[methodName] = (...args) =>
        this.ipcRenderer.invoke(methodName, ...args);
      return acc;
    }, {});
  }

  /**
   * Expose all public main events as window.publicEvents
   */
  buildPublicEventSubscribers(publicEvents) {
    return publicEvents.reduce((acc, topic) => {
      acc[`on${topic}`] = (callback) => {
        const listener = (_, ...args) => {
          callback(...args);
        };
        this.ipcRenderer.on(topic, listener);
        return () => this.ipcRenderer.removeListener(topic, listener);
      };
      return acc;
    }, {});
  }

  /*
   * Setup window.rendererEvents to forward certain renderer events to main
   */
  buildRendererEventEmitters(rendererEvents) {
    return rendererEvents.reduce((acc, topic) => {
      acc[topic] = (...args) => ipcRenderer.send(topic, ...args);
      return acc;
    }, {});
  }
}

function main() {
  const preloader = new Preloader({ contextBridge, ipcRenderer });
  preloader.proxyPublicApi();
}

main();
