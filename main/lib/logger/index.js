/**
 * Logger is a minimal logger that persists to some
 * async read/write interface in the background.
 * It also logs to console.
 */

const Levels = ["error", "warn", "info", "debug"];

class Logger {
  /**
   *
   * @param {object} spec
   * @param {object} spec.storage - persist lib derived class
   * @param {string} level - Lowest priority level that will be shown
   * @param {string} namespace - Namespace log prefix
   */
  constructor({ storage, level = "info", namespace }) {
    this.storage = storage;
    this.level = level;
    this._namespace = namespace;
    this.levelIndex = Levels.indexOf(level);

    if (this.levelIndex < 0) {
      throw new Error(`Unknown log level: ${level}`);
    }
  }

  /** Log at error level */
  error(...args) {
    this.log("error", ...args);
  }

  /** Log at warn level */
  warn(...args) {
    if (this.levelIndex < 1) return;
    this.log("warn", ...args);
  }

  /** Log at info level */
  info(...args) {
    if (this.levelIndex < 2) return;
    this.log("info", ...args);
  }

  /** Log at debug level */
  debug(...args) {
    if (this.levelIndex < 3) return;
    this.log("debug", ...args);
  }

  /**
   * Send a log to the console
   * If async read/write provided, append to persisted text
   * @param {string} level
   * @param  {...unknown} args
   */
  log(level, ...args) {
    if (!Levels.includes(level)) {
      throw new Error(`Unknown log level: ${level}`);
    }

    const time = new Date().toLocaleString();
    const ns = this._namespace ? `${this._namespace} ` : "";
    console[level](time, level, ns, ...args);
    setImmediate(() => this.append(time, level, ...args));
  }

  /**
   * Append log to persisted logs
   * @param {string} time
   * @param {string} level
   * @param  {...unknown} args
   * @returns
   */
  async append(time, level, ...args) {
    if (!this.storage) return;

    try {
      let logs = await this.storage.read();

      // Build a string from the args array
      const argString = args.reduce((acc, arg) => {
        if (arg instanceof Error) {
          arg = arg.toString();
        } else if (typeof arg === "object") {
          arg = JSON.stringify(arg);
        }
        return `${acc} ${arg}`;
      }, "");

      const ns = this._namespace ? `${this._namespace} ` : "";
      logs += `${time} ${level} ${ns}${argString}\r\n`;
      await this.storage.write(logs);
    } catch (error) {
      console.error("Failed to append log", error);
    }
  }

  /** Erase all persisted logs */
  async erase() {
    if (this.storage) {
      await this.storage.write("");
    }
  }

  /**
   * Returns a new logger with a different namespace
   * @param {string} namespace
   * @returns
   */
  namespace(namespace) {
    return new Logger({
      storage: this.storage,
      level: this.level,
      namespace,
    });
  }
}

module.exports = {
  Logger,
};
