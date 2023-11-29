const { createHash } = require("crypto");
const z32 = require("z32");
const Constants = require("../constants");
const { SessionStatus, WalletType } = require("../enums");
const { SessionStarted, SessionEnded } = require("../events");
const { hdWalletForType } = require("../lib/hd-wallet");

class UserService {
  constructor(spec) {
    this.corestore = spec.corestore;
    this.driveService = spec.driveService;
    this.beeService = spec.beeService;
    this.machineState = spec.machineState;
    this.subscriptionService = spec.subscriptionService;
    this.userPublisherService = spec.userPublisherService;
    this.events = spec.events;
    this.logger = spec.logger.namespace(UserService.name);
  }

  get sessionDbId() {
    return this._sessionDbId;
  }

  get sessionStore() {
    return this._sessionStore;
  }

  async resumeExistingSession() {
    let primaryKey = await this.machineState.get(Constants.Session);
    if (primaryKey) {
      await this.startSession(z32.decode(primaryKey));
    }
  }

  sessionStatus() {
    return {
      status: this.sessionDbId ? SessionStatus.Active : SessionStatus.Inactive,
    };
  }

  async generateMneumonic() {
    const hdWallet = hdWalletForType(WalletType.Mneumonic);
    const result = await hdWallet.generateMneumonic();
    return result;
  }

  async getHdWalletAddress({ walletType, ...params }) {
    const hdWallet = hdWalletForType(walletType);
    const result = await hdWallet.addressForPath(params);
    return result;
  }

  async signIn({ walletType, ...params }) {
    const message = "Eduba Sign In";

    const hdWallet = hdWalletForType(walletType);
    const signedMessage = await hdWallet.signMessage({ ...params, message });

    const hash = createHash("sha256");
    hash.update(signedMessage);
    const primaryKey = hash.digest();

    await this.startSession(primaryKey);
    return this.sessionStatus();
  }

  async signOut() {
    this._sessionDbId = void 0;

    await Promise.all([
      this.driveService.endSession(),
      this.beeService.endSession(),
      this.machineState.delete(Constants.Session),
    ]);

    this.logger.debug("session ended");
    this.events.emit(SessionEnded);
    return this.sessionStatus();
  }

  async startSession(primaryKey) {
    this._sessionStore = this.corestore.session({ primaryKey });
    this.driveService.startSession(this._sessionStore);
    this.beeService.startSession(this._sessionStore);

    await this.machineState.set(Constants.Session, z32.encode(primaryKey));

    const core = await this._sessionStore.get({ name: Constants.User });
    await core.ready();
    this._sessionDbId = core.id;
    this.logger.debug("session hyperbee", core.id);

    await Promise.all([
      this.userPublisherService.joinAllToSwarm(),
      this.subscriptionService.subscribeAllToSwarm(),
    ]);

    this.events.emit(SessionStarted);
  }
}

module.exports = {
  UserService,
};
