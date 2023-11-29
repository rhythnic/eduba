const bip39 = require("bip39");
const { HdWallet } = require("./hd-wallet");
const constants = require("../../constants");

class MneumonicHdWallet extends HdWallet {
  generateMneumonic() {
    return bip39.generateMnemonic();
  }

  buildBip32() {
    const BIP32Factory = require("bip32").default;
    const ecc = require("tiny-secp256k1");
    return BIP32Factory(ecc);
  }

  async addressForPath({ phrase, password = "", bip44Params }) {
    if (!bip39.validateMnemonic(phrase)) {
      throw new Error("Recovery phrase is invalid");
    }

    switch (bip44Params.chain) {
      case "0": {
        const bitcoin = require("bitcoinjs-lib");
        const bip32 = this.buildBip32();

        const seed = bip39.mnemonicToSeedSync(phrase);
        const root = bip32.fromSeed(seed);
        const node = root.derivePath(this.buildPath(bip44Params));

        const address = bitcoin.payments.p2pkh({
          pubkey: node.publicKey,
        }).address;

        return address;
      }
      case "60": {
        const { HDNodeWallet } = require("ethers");
        const wallet = HDNodeWallet.fromPhrase(
          phrase,
          password,
          this.buildPath(bip44Params)
        );
        return wallet.address;
      }
      default:
        throw new Error(`Unsupported chain ${bip44Params.chain}`);
    }
  }

  async signMessage({ phrase, password = "", message, bip44Params }) {
    if (!bip39.validateMnemonic(phrase)) {
      throw new Error("Recovery phrase is invalid");
    }

    switch (bip44Params.chain) {
      case "0": {
        const bitcoin = require("bitcoinjs-lib");
        const bitcoinMessage = require("bitcoinjs-message");
        const bip32 = this.buildBip32();

        const seed = bip39.mnemonicToSeedSync(phrase);
        const root = bip32.fromSeed(seed);
        const node = root.derivePath(this.buildPath(bip44Params));

        var signature = bitcoinMessage.sign(message, node.privateKey);
        return signature.toString("base64");
      }
      case "60": {
        const { HDNodeWallet } = require("ethers");
        const wallet = HDNodeWallet.fromPhrase(
          phrase,
          password,
          this.buildPath(bip44Params)
        );
        return (await wallet.signMessage(message)).slice("0x".length);
      }
      default:
        throw new Error(`Unsupported chain ${bip44Params.chain}`);
    }
  }
}

require("../node-fork/child")(new MneumonicHdWallet());
