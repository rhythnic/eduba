import { batch, computed, effect, signal } from "@preact/signals";

export class Store {
  constructor({ storage, state = {} } = {}) {
    this.storage = storage;
    this.revived = false;

    let persistedState;
    if (typeof storage === "string") {
      persistedState = window.localStorage.getItem(storage);
      if (persistedState) {
        persistedState = JSON.parse(persistedState);
        this.revived = true;
      }
    }

    this._reset(state, persistedState);
  }

  initialize() {
    // no op
  }

  destroy() {
    if (this.cancelStateEffect) this.cancelStateEffect();
  }

  setState(obj) {
    batch(() => {
      for (const key of Object.keys(obj)) {
        this.state[key].value = obj[key];
      }
    });
  }

  subController(key, constructor, spec) {
    if (!this.state[key]) {
      throw new Error(`Missing state at ${key} for sub-controller`);
    }

    return new constructor({
      ...spec,
      state: this._reviveState(spec.state, this.state[key].peek()),
      storage: (value) => {
        this.state[key].value = value;
      },
    });
  }

  _reset(initialState, persistedState) {
    if (this.cancelStateEffect) this.cancelStateEffect();

    const state = this._reviveState(initialState, persistedState);
    this.state = {};

    for (const key in state) {
      this.state[key] = signal(state[key]);
    }

    if (this.storage) {
      this.stateObject = computed(() => {
        const result = {};
        for (const key in this.state) {
          result[key] = this.state[key].value;
        }
        return result;
      });

      if (typeof this.storage === "string") {
        this.cancelStateEffect = effect(() => {
          window.localStorage.setItem(
            this.storage,
            JSON.stringify(this.stateObject.value)
          );
        });
      } else {
        this.cancelStateEffect = effect(() => {
          this.storage(this.stateObject.value);
        });
      }
    }
  }

  _reviveState(state, persistedState) {
    const result = {};

    for (const key in state) {
      result[key] =
        persistedState && typeof persistedState[key] !== "undefined"
          ? persistedState[key]
          : state[key];
    }

    return result;
  }
}
