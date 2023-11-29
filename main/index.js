const { app: electronApp, BrowserWindow, shell } = require("electron");
const { join } = require("path");
const { app } = require("./app/index.js");
const config = require("./config/index.js");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  electronApp.quit();
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "api", "preload.js"),
    },
  });

  // expose public api
  app.resolve("api").exposePublicApi(mainWindow.webContents);

  // Take up all monitor space (not full screen)
  mainWindow.maximize();

  if (config.mainWindow.url) {
    mainWindow.loadURL(config.mainWindow.url);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "./renderer/index.html"));
  }

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  const userSession = mainWindow.webContents.session;
  app.resolve("logger").debug("User agent:", userSession.getUserAgent());

  userSession.on("will-download", async (event, item, webContents) => {
    try {
      app.resolve("logger").debug("will-download:", item.getURL());
      event.preventDefault();

      const url = item.getURL();

      if (url.startsWith("eduba://")) {
        return app.resolve("edubaScheme").download(url);
      }
    } catch (err) {
      app.resolve("logger").error(`Download failed: ${err.message}`);
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electronApp.on("ready", async () => {
  try {
    const userService = app.resolve("userService");
    await userService.resumeExistingSession();

    createWindow();

    app.resolve("edubaScheme").registerHandler();
  } catch (err) {
    app.resolve("logger").error(err);
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electronApp.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electronApp.quit();
  }
});

electronApp.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
