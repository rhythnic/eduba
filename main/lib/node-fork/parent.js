const { fork } = require("child_process");

function forkModule(modulePath) {
  return new Proxy(
    {},
    {
      get(_, method) {
        return (...args) =>
          new Promise((resolve, reject) => {
            const n = fork(modulePath);

            n.on("message", ({ ok, error, result }) => {
              if (ok) {
                resolve(result);
              } else {
                reject(new Error(error));
              }
              n.kill();
            });

            n.on("error", (err) => {
              reject(err);
              n.kill();
            });

            n.send({ method, args });
          });
      },
    }
  );
}

module.exports = {
  forkModule,
};
