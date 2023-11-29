const { join } = require("path");
const { WalletType } = require("../../enums");
const { forkModule } = require("../node-fork/parent");

function hdWalletForType(walletType) {
  switch (walletType) {
    case WalletType.Mneumonic:
      return forkModule(join(__dirname, "./mneumonic.hd-wallet.js"));
    case WalletType.Ledger:
      return forkModule(join(__dirname, "./ledger.hd-wallet.js"));
    default:
      throw new Error(`Unsupported HD Wallet type ${walletType}`);
  }
}

module.exports = {
  hdWalletForType,
};
