/**
 * The EdubaSchema class provides the functionality for the custom "eduba"
 * schema that serves files to the renderer based on their location
 * as specified in the Eduba protocol.
 */

const { protocol, dialog } = require("electron");
const { parse: parsePath } = require("node:path");
const Constants = require("../constants.js");
const pump = require("pump");
const { createWriteStream } = require("node:fs");

class EdubaScheme {
  constructor({ logger, driveService }) {
    this.logger = logger.namespace(EdubaScheme.name);
    this.driveService = driveService;
  }

  initialize() {
    protocol.registerSchemesAsPrivileged([
      { scheme: "eduba", privileges: { bypassCSP: true, stream: true } },
    ]);
  }

  registerHandler() {
    protocol.handle("eduba", this.handle.bind(this));
  }

  async download(url) {
    try {
      const parsed = this._parseUrl(url);

      if (!parsed) {
        throw new Error(`Invalid URL: ${url}`);
      }

      const { dbId, path, base } = parsed;
      const drive = await this.driveService.load(dbId);
      const exists = await this.driveService.waitForKeyToExist(drive, path);

      if (!exists) {
        throw new Error(`Not found: ${url}`);
      }

      // @TODO: determine entity, fetch JSON to get recommended or original file name
      const opts = {
        title: "Download",
        defaultPath: base,
        properties: ["createDirectory", "showOverwriteConfirmation"],
      };

      const { canceled, filePath } = await dialog.showSaveDialog(opts);

      if (canceled) return;

      const source = drive.createReadStream(path);
      const dest = createWriteStream(filePath);

      pump(source, dest, function (err) {
        if (err) {
          this.logger.warn("Download failed in transfer", err);
        }
      });
    } catch (err) {
      // @TODO: emit event to renderer and show toast
      this.logger.warn("Download failed", err);
    }
  }

  async handle(request) {
    try {
      const parsed = this._parseUrl(request.url);

      if (!parsed) {
        return new Response("", {
          status: 400,
          statusText: "Invalid eduba URL",
        });
      }

      const { dbId, path } = parsed;
      const drive = await this.driveService.load(dbId);
      const exists = await this.driveService.waitForKeyToExist(drive, path);

      if (!exists) {
        return new Response("", {
          status: 404,
          statusText: "Not found.",
        });
      }

      return new Response(drive.createReadStream(path));
    } catch (err) {
      this.logger.error("Handle failed", err);

      return new Response("", {
        status: 500,
        statusText: "Server Error",
      });
    }
  }

  _parseUrl(url) {
    const rgx = /^eduba:\/\/?([0-9a-z]{52})\/([\/.0-9a-z_-]+)$/i;
    const parts = rgx.exec(url);

    if (!parts) return null;

    const path = `/${Constants.App}/${parts[2]}`;
    const parsed = parsePath(path);

    return {
      dbId: parts[1],
      path,
      base: parsed.base,
      name: parsed.name,
    };
  }
}

module.exports = {
  EdubaScheme,
};
