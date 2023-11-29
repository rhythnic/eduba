import { h } from "preact";
import { SignalStateModel } from "../../../lib/signal-state-model";
import { FormController } from "../../../controllers/form.controller";
import { effect } from "@preact/signals";
import { HdWalletType } from "../../../enums";
import { pick } from "ramda";

const bip44Params = pick(["chain", "account", "change", "index"]);

export class AuthController extends SignalStateModel {
  constructor(spec) {
    super({
      state: {
        modal: { value: false },
        address: { value: "" },
      },
    });

    this.appStore = spec.appStore;
    this.authStore = spec.authStore;

    this.form = new FormController({
      onSubmit: this.handleSubmit,
      state: {
        walletType: { value: HdWalletType.Mneumonic },
        phrase: { value: "" },
        password: { value: "" },
        chain: { value: "0" },
        account: { value: 0 },
        change: { value: 0 },
        index: { value: 0 },
      },
    });
  }

  initialize() {
    this.removeListeners = [
      effect(() => {
        this.refreshAddress(this.form.stateObject.value);
      }),
    ];
  }

  async refreshAddress(data) {
    if (data.walletType === HdWalletType.Mneumonic && !data.phrase) {
      return;
    }

    const request = {
      walletType: data.walletType,
      phrase: data.phrase,
      password: data.password,
      bip44Params: bip44Params(data),
    };

    const address = await window.api.getHdWalletAddress(request);
    this.setState({ address });
  }

  destroy() {
    this.removeListeners.forEach((fn) => fn());
  }

  generateMneumonic = async () => {
    const phrase = await window.api.generateMneumonic();
    this.form.setState({ phrase });
  };

  handleSubmit = async (data) => {
    try {
      const request = {
        walletType: data.walletType,
        phrase: data.phrase,
        password: data.password,
        bip44Params: bip44Params(data),
      };
      await window.api.signIn(request);
      this.closeModal();
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  closeModal = () => {
    this.resetState();
    this.form.resetState();
  };

  openModal = () => {
    this.setState({ modal: true });
  };
}
