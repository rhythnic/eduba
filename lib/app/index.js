/**
 * App is a class for dependency injection management.
 * 
 * Usage:
 * 
 * class TodoService{
 *   constructor({ events, defaultLimit }) {
 *     this.appEvents = events;
 *     this.defaultLimit = defaultLimit
 *   }
 *   initialize() {
 *     this.appEvents.on("topic")
 *   }
 *   find() {}
 * }
 * 
 * const app =  new App();

 * app.register({
 *   events: new EventEmitter(),
 *   todoService: fromClass(TodoService, { defaultLimit: 50 })
 * });
 * 
 * const todos = await app.resolve('todoService').find();
 * 
 * App has a small footprint but requires that providers
 * aren't called in the constructors.  Use the "initialize"
 * method to initialize class instances
 */

const AppSymbol = Symbol("App");

class ProviderClass {
  constructor(_class, opts) {
    this._class = _class;
    this.opts = opts;
  }
}

function fromClass(...args) {
  return new ProviderClass(...args);
}

class App {
  constructor() {
    // Map<string, unknown> - Instantiated providers
    this.providers = new Map();
  }

  inject(instance) {
    for (const [prop, value] of Object.entries(instance)) {
      if (typeof value === "symbol" && this.providers.has(value.description)) {
        instance[prop] = this.providers.get(value.description);
      }
    }
  }

  instantiate(_class, opts) {
    const self = this;

    const proxy = new Proxy(opts, {
      get(target, prop) {
        if (prop === AppSymbol) return app;

        let name = prop;
        if (typeof target[prop] === "symbol") {
          name = target[prop].name;
        }

        const provider = self.providers.get(name);

        return provider || target[prop];
      },
    });

    return new _class(proxy);
  }

  /**
   * Register providers.  Template is an object where keys are the provider name
   * and value is either an instantiated provider, or an array of [class, options]
   * @param {object} providerTemplate
   */
  async register(providerTemplate) {
    // Array of provider names
    const registeredNames = Object.keys(providerTemplate);

    for (const name of registeredNames) {
      // Check if the name has already been registered
      if (this.providers.has(name)) {
        throw new Error(`Registered same provider twice: ${name}`);
      }

      if (providerTemplate[name] instanceof ProviderClass) {
        this.providers.set(name, Symbol(name));
      } else {
        this.providers.set(name, providerTemplate[name]);
      }
    }

    // Instantiate providers
    for (const name of registeredNames) {
      if (providerTemplate[name] instanceof ProviderClass) {
        const { _class, opts = {} } = providerTemplate[name];
        this.providers.set(name, this.instantiate(_class, opts));
      }
    }

    // Replace the dependency placeholders with the initialized classes
    for (const name of registeredNames) {
      this.inject(this.providers.get(name));
    }

    // Call the initialize method if it exists in the provider
    for (const name of registeredNames) {
      const instance = this.providers.get(name);
      if (typeof instance.initialize === "function") {
        await instance.initialize();
      }
    }
  }

  /**
   * Resolve a name to the dependency instance
   * @param {string} name
   * @returns
   */
  resolve(name) {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider not found: ${name}`);
    }
    return provider;
  }
}

module.exports = {
  App,
  AppSymbol,
  fromClass,
};
