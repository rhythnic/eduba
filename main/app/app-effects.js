/**
 * Side effects of main (error logging)
 */

function enableAppEffects(app, config) {
  const logger = app.resolve("logger");
  const events = app.resolve("events");

  const emitters = [
    "driveService",
    "beeService",
    "beeJsonStorage",
    "driveJsonStorage",
    "driveFileStorage",
    "driveTextStorage",
  ];

  for (const name of emitters) {
    app.resolve(name).on("error", (...args) => {
      events.emit("error", ...args);
    });
  }

  events.on("error", (error, topic, ...args) => {
    logger.error(error, topic, ...args);
  });

  /** Log config at debug level */
  logger.debug("Config:", JSON.stringify(config));
}

module.exports = {
  enableAppEffects,
};
