import { computed, effect, signal } from "@preact/signals";

export class SignalStateModel {
  constructor({ storage, state: stateSpec = {} }) {
    this.storage = storage;
    this.ready = signal(false);
    this.revived = false;
    this.stateSpec = stateSpec;
    this.stateObject = signal({});
    this.state = {};
    this.defineState(stateSpec);
  }

  async initialize() {
    if (!this.storage) {
      this.ready.value = true;
      return;
    }

    this.cancelStateEffect = effect(() => {
      if (!this.ready.value) return;

      const state = this.stateObject.value;
      const cachedState = {};

      for (const key in this.stateSpec) {
        if (this.stateSpec[key].cache) {
          cachedState[key] = state[key];
        }
      }

      this.storage.write(cachedState);
    });

    let persistedState = await this.storage.read();
    if (!persistedState) {
      this.ready.value = true;
      return;
    }

    if (typeof persistedState !== "object") {
      throw new Error("Cached state must be an object");
    }

    this.revived = true;
    const cachedState = {};

    for (const key in this.stateSpec) {
      let { cache } = this.stateSpec[key];

      if (cache === true && typeof persistedState[key] !== "undefined") {
        cachedState[key] = persistedState[key];
      }
    }

    this.setState(cachedState);

    this.ready.value = true;
  }

  destroy() {
    if (this.cancelStateEffect) this.cancelStateEffect();
  }

  setState(obj) {
    const value = { ...this.stateObject.peek() };
    for (const key in obj) {
      if (key in this.stateSpec) {
        value[key] = obj[key];
      }
    }
    this.stateObject.value = value;
  }

  sub(key, spec = {}) {
    if (this.stateSpec[key]) {
      throw new Error(`SignalStateModel sub key already taken (${key})`);
    }

    this.defineState({ [key]: spec });

    const storage = {
      read: () => this.state[key].peek(),
      write: (value) => {
        this.setState({ [key]: value });
      },
    };

    return storage;
  }

  resetState() {
    const state = {};
    for (const key in this.stateSpec) {
      state[key] = this.stateSpec[key].value;
    }
    this.setState(state);
  }

  defineState(stateSpec) {
    Object.assign(this.stateSpec, stateSpec);

    const state = {};

    for (const key in stateSpec) {
      state[key] = this.stateSpec[key].value;
    }

    this.stateObject.value = { ...this.stateObject.peek(), ...state };

    for (const key in stateSpec) {
      this.state[key] = computed(() => this.stateObject.value[key]);
    }
  }
}
