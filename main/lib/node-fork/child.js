module.exports = function proxyParentCalls(libInstance) {
  process.on("message", async ({ method, args }) => {
    try {
      const result = await libInstance[method](...args);
      process.send({ ok: true, result });
    } catch (err) {
      process.send({ ok: false, error: err.toString() });
    }
  });
};
