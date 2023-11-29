class HdWallet {
  buildPath({ chain = 0, account = 0, change = 0, index = 0 }) {
    return `m/44'/${chain}'/${account}'/${change}/${index}`;
  }
}

module.exports = {
  HdWallet,
};
