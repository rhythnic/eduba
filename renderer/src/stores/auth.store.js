import { SignalStateModel } from "../lib/signal-state-model";
import { SessionStatus } from "../enums";

export class AuthStore extends SignalStateModel {
  constructor() {
    super({
      state: {
        sessionActive: { value: false },
      },
    });
  }

  async initialize() {
    await super.initialize();

    const { status } = await window.api.sessionStatus();

    this.setState({ sessionActive: status === SessionStatus.Active });

    window.publicEvents.onSessionStarted(() => {
      this.setState({ sessionActive: true });
    });

    window.publicEvents.onSessionEnded(() => {
      this.setState({ sessionActive: false });
    });
  }

  generateRecoveryPhrase = async () => {
    return window.api.generateRecoveryPhrase();
  };

  signIn(params) {
    return window.api.signIn(params);
  }

  signOut = async () => {
    await window.api.signOut();
  };
}
