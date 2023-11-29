const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const { listen } = require("@ledgerhq/logs");
const { HdWallet } = require("./hd-wallet");

class LedgerHdWallet extends HdWallet {
  _chainApp(chain, transport) {
    switch (chain) {
      case "0": {
        const BtcApp = require("@ledgerhq/hw-app-btc").default;
        return new BtcApp({ transport });
      }
      case "60":
        const EthApp = require("@ledgerhq/hw-app-eth").default;
        return new EthApp(transport);
      default:
        throw new Error(`Unsupported blockchain ${chain}`);
    }
  }

  async addressForPath({ bip44Params }) {
    const path = this.buildPath(bip44Params);
    const transport = await TransportNodeHid.open("");
    listen((log) => console.log(log));

    try {
      const ledgerApp = this._chainApp(bip44Params.chain, transport);
      let address;

      switch (bip44Params.chain) {
        case "0": {
          const result = await ledgerApp.getWalletPublicKey(path, {
            verify: false,
            format: "legacy",
          });

          address = result.bitcoinAddress;
          break;
        }
        case "60": {
          ({ address } = await ledgerApp.getAddress(path));
          break;
        }
      }

      await transport.close().catch((err) => console.err(err));

      return address;
    } catch (err) {
      await transport.close().catch((err) => console.err(err));
      throw err;
    }
  }

  async signMessage({ message, bip44Params }) {
    const path = this.buildPath(bip44Params);
    const messageHex = Buffer.from(message).toString("hex");
    const transport = await TransportNodeHid.open("");
    listen((log) => console.log(log));

    try {
      const ledgerApp = this._chainApp(bip44Params.chain, transport);
      let signedMessage;

      switch (bip44Params.chain) {
        case "0": {
          const result = await ledgerApp.signMessage(path, messageHex);
          signedMessage = `${result.r}${result.s}${result.v}`;
          break;
        }
        case "60": {
          const result = await ledgerApp.signPersonalMessage(path, messageHex);
          signedMessage = `${result.r}${result.s}${result.v}`;
          break;
        }
      }

      await transport.close().catch((err) => console.err(err));

      return signedMessage;
    } catch (err) {
      await transport.close().catch((err) => console.err(err));
      throw err;
    }
  }
}

require("../node-fork/child")(new LedgerHdWallet());
