import { app, Menu, dialog, ipcMain, BrowserWindow, Tray } from 'electron' // eslint-disable-line
import { autoUpdater } from 'electron-updater';
import * as Sentry from '@sentry/electron';
import canvasIntegration from '../utils/canvasIntegration';

Sentry.init({ dsn: 'https://312e7fd7b4784962ba2948b19547c3cc@sentry.io/1311555' });
const Promise = require('bluebird');
const path = require('path');
const log = require('electron-log');
const _ = require('lodash');
const applicationMenu = require('./application-menus');
const dataStorageFile = require('../utils/dataStorage');
const moment = require('moment');
const dataStorage = dataStorageFile.default;
const fs = require('fs');
const request = require('request-promise');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
autoUpdater.autoDownload = true;
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

log.info('started main process');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow = null;
let tray;
let syncing = false;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    webPreferences: { webSecurity: false },
  });

  log.info('window created');
  mainWindow.loadURL(winURL);
  log.info('loaded url');

  mainWindow.on('closed', () => {
    if (app.dock) app.dock.hide();
    mainWindow = null;
  });
};

const notConnectedMenu = [
  {
    label: 'Connect',
    enabled: true,
    click() {
      if (mainWindow === null) {
        createWindow();
      }
    },
  },
  {
    label: 'Quit',
    click() {
      app.quit();
    },
    accelerator: 'CommandOrControl+Q',
  },
];

const syncingMenu = [
  {
    label: 'Syncing...',
    icon: path.join(__static, 'icons_normal/loading.png'),
    enabled: false,
  },
  {
    label: 'Preferences',
    enabled: true,
    click() {
      if (mainWindow === null) {
        createWindow();
      }
    },
  },
  {
    label: 'Quit',
    click() {
      app.quit();
    },
    accelerator: 'CommandOrControl+Q',
  },
];

const getUpdatedConnectedMenu = (lastSynced) => {
  return [
    {
      label: `Last Synced: ${moment(lastSynced).fromNow()}`,
      enabled: false,
    },
    {
      label: 'Sync Now',
      enabled: true,
      click() {
        sync(lastSynced);
      },
    },
    {
      label: 'Preferences',
      enabled: true,
      click() {
        if (mainWindow === null) {
          createWindow();
        }
      },
    },
    {
      label: 'Restart',
      enabled: true,
      click() {
        app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
        app.exit(0);
      },
    },
    {
      label: 'Quit',
      enabled: true,
      click() {
        app.quit();
      },
    },
  ];
};

app.on('ready', async () => {
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  } else {
    Menu.setApplicationMenu(applicationMenu);
  }
  tray = new Tray(
    path.join(__static, 'icons_normal/icons/png/32x32@2x.png') // eslint-disable-line
  );
  tray.setPressedImage(
    path.join(__static, 'icons_inverted/icons/png/32x32@2x.png') // eslint-disable-line
  );

  // handles windows
  tray.on('right-click', async () => {
    if (await dataStorage.isConnected() && !syncing) {
      updateMenu(getUpdatedConnectedMenu(await dataStorage.getLastSynced()));
    }
  });

  // handles mac
  tray.on('mouse-enter', async () => {
    if (await dataStorage.isConnected() && !syncing) {
      updateMenu(getUpdatedConnectedMenu(await dataStorage.getLastSynced()));
    }
  });

  if (await dataStorage.isConnected()) {
    if (app.dock) app.dock.hide();
    updateMenu(getUpdatedConnectedMenu(await dataStorage.getLastSynced()));
  } else {
    updateMenu(notConnectedMenu);
    createWindow();
  }
  // handles recurring sync
  let delay = 60 * 1000;
  setTimeout(async function changeTimeout() {
    if (process.env.NODE_ENV === 'production') {
      autoUpdater.checkForUpdates();
    }
    if (await dataStorage.isConnected()) {
      // multiple by 60000 because syncfreq is in minutes
      delay = 60000 * (await dataStorage.getSyncFrequency());
      sync(await dataStorage.getLastSynced());
    }
    setTimeout(changeTimeout, delay);
  }, delay);
});

app.on('window-all-closed', () => {
  if (app.dock) app.dock.hide();
});

ipcMain.on('choose-folder', (event) => {
  let folder = dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (folder === undefined) {
    folder = 'No folder chosen';
  }
  event.sender.send('chose-folder', folder);
});

ipcMain.on('download-file', async (e, args) => {
  try {
    return downloadFile(e, args, 'file-downloaded');
  } catch (err) {
    log.error(pe.render(err));
    return e.sender.send('file-download-failed', args.file);
  }
});

ipcMain.on('download-first-file', async (e, args) => {
  downloadFile(e, args, 'first-file-downloaded');
});

const downloadFile = async (e, args, ipcReceiver) => {
  const { options, file } = args;
  try {
    const timeout = new Promise((resolve) => {
      setTimeout(resolve, file.projectedDownloadTime, 'Timed out');
    });
    const downloadPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await request.get(options);
        const buffer = Buffer.from(response, 'utf8');
        await fs.writeFileSync(file.fullPath, buffer);
        resolve('Download Finished');
      } catch (err) {
        log.error(pe.render(err));
        reject(err);
      }
    });
    return Promise.race([timeout, downloadPromise])
      .then((response) => {
        if (response === 'Download Finished') {
          return e.sender.send(ipcReceiver, file);
        }
        return e.sender.send('file-download-failed', file);
      })
      .catch((err) => {
        log.error(pe.render(err));
        return e.sender.send('file-download-failed', file);
      });
  } catch (err) {
    log.error('general exception');
    log.error(pe.render(err));
    return e.sender.send('file-download-failed', file);
  }
};

const syncDownloadFiles = async (files, rootFolder) => {
  return Promise.map(files, async (file) => {
    try {
      const options = {
        method: 'GET',
        uri: file.url,
        json: true,
        encoding: null,
      };
      const response = await request.get(options);
      const buffer = Buffer.from(response, 'utf8');
      await fs.writeFileSync(path.join(rootFolder, file.filePath), buffer);
      return file;
    } catch (err) {
      log.error(err);
      return file;
    }
  });
};

ipcMain.on('completed-initial-sync', async () => {
  updateMenu(getUpdatedConnectedMenu(await dataStorage.getLastSynced()));
});

ipcMain.on('disconnect', async (e) => {
  dataStorage.wipeState();
  updateMenu(notConnectedMenu);
  e.sender.send('disconnected');
});

ipcMain.on('create-folder', (event, folder) => {
  fs.access(path.resolve(folder), fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(folder, () => {
        event.sender.send('folder-created', folder);
      });
    } else {
      event.sender.send('folder-created', folder);
    }
  });
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const updateMenu = (template) => {
  const menu = Menu.buildFromTemplate(template);
  tray.setContextMenu(menu);
};

const sync = async (lastSynced) => {
  try {
    syncing = true;
    updateMenu(syncingMenu);
    const courses = await dataStorage.getSyncableCourses();
    const authToken = await dataStorage.getAuthToken();
    const rootURL = await dataStorage.getRootURL();
    const rootFolder = await dataStorage.getRootFolder();
    const updatedCourses = await Promise.all(_.map(courses, async (course) => {
      let currentCourse = course;
      let allNewFolders = [];
      let allNewFiles = [];
      // getting any new modules - adding them to courses object
      const { courseWithNewModules, newModules, hasUpdates } = await getNewModules(authToken,
        rootURL, course);
      log.info(newModules);
      // log.info(`Course: ${course.name} has updates: ${hasUpdates}`);
      if (hasUpdates) {
        allNewFolders = allNewFolders.concat(_.map(newModules, (newModule) => {
          return newModule.modulePath;
        }));
        const { updatedModulesFiles, courseWithModulesFiles } = await canvasIntegration
          .getUpdatedModulesFiles(authToken, newModules, courseWithNewModules, lastSynced);
        allNewFiles = allNewFiles.concat(_.flatten(updatedModulesFiles));
        currentCourse = courseWithModulesFiles;
      }
      // getting new folders
      const { courseWithNewFolders, newFolders } = await getNewFolders(authToken,
        rootURL, currentCourse, lastSynced);
      currentCourse = courseWithNewFolders;
      allNewFolders = allNewFolders.concat(_.flatten(_.map(newFolders, (newFolder) => {
        return newFolder.folderPath;
      })));

      // create folders from both the modules view and from the files view
      await createNewFolders(rootFolder, allNewFolders);
      if (course.hasFilesTab) {
        // get new or updated files from files view
        const { courseWithNewFilesAndFolders, newOrUpdatedFiles } = await getNewFiles(authToken,
          rootURL, currentCourse, lastSynced);
        allNewFiles = allNewFiles.concat(newOrUpdatedFiles);
        currentCourse = courseWithNewFilesAndFolders;
      }
      const downloadedFiles = await syncDownloadFiles(allNewFiles, rootFolder);
      await Promise.all(_.forEach(downloadedFiles, async (file) => {
        const fileIndex = _.findIndex(currentCourse.files,
          { filePath: file.filePath });
        currentCourse.files[fileIndex].lastUpdated = Date.now();
      }));
      return currentCourse;
    }));
    await dataStorage.updateCourses(updatedCourses);
    await dataStorage.updateLastSynced();
    syncing = false;
    updateMenu(getUpdatedConnectedMenu(await dataStorage.getLastSynced()));
  } catch (err) {
    log.error(pe.render(err));
  }
};

const getNewFiles = async (authToken, rootURL, course, lastSynced) => {
  const courseWithNewFilesAndFolders = JSON.parse(JSON.stringify(course));
  const newOrUpdatedFiles = [];
  try {
    if (courseWithNewFilesAndFolders.hasFilesTab) {
      const courseHasNewFile = await canvasIntegration.hasNewFile(authToken,
        rootURL,
        courseWithNewFilesAndFolders.id,
        lastSynced);
      if (courseHasNewFile) {
        log.info('has new file(s)');
        const courseFiles = await canvasIntegration.getAllNewOrUpdatedFiles(authToken,
          courseWithNewFilesAndFolders, lastSynced);
        log.info(`num new or updated course files: ${courseFiles.length}`);
        for (let j = 0; j < courseFiles.length; j += 1) {
          const fileIndex = _.findIndex(courseWithNewFilesAndFolders.files,
            { filePath: courseFiles[j].filePath });
          const fileWithID = JSON.parse(JSON.stringify(courseFiles[j]));
          fileWithID.courseID = courseWithNewFilesAndFolders.id;
          newOrUpdatedFiles.push(fileWithID);
          if (fileIndex >= 0) {
            log.info('updating file');
            courseWithNewFilesAndFolders.files[fileIndex] = courseFiles[j];
          } else {
            courseWithNewFilesAndFolders.files.push(courseFiles[j]);
          }
        }
      } else {
        // log.info('no new files');
      }
    }
    return { courseWithNewFilesAndFolders, newOrUpdatedFiles };
  } catch (err) {
    log.error('Error getting new files');
    log.error(pe.render(err));
    return { courseWithNewFilesAndFolders, newOrUpdatedFiles };
  }
};

const getNewFolders = async (authToken, rootURL, course, lastSynced) => {
  const newFolders = [];
  const courseWithNewFolders = JSON.parse(JSON.stringify(course));
  try {
    if (courseWithNewFolders.hasFilesTab) {
      const courseNewFolders = await canvasIntegration.getNewFolders(authToken,
        rootURL, courseWithNewFolders, lastSynced);
      for (let j = 0; j < courseNewFolders.length; j += 1) {
        const folderIndex = _.findIndex(courseWithNewFolders.folders,
          { folderPath: courseNewFolders[j].folderPath });
        if (folderIndex >= 0) {
          log.info('updating folder');
          courseWithNewFolders.folders[folderIndex] = courseNewFolders[j];
        } else {
          log.info('brand new folder');
          courseWithNewFolders.folders.push(courseNewFolders[j]);
          newFolders.push(courseNewFolders[j]);
        }
      }
    }
    return { courseWithNewFolders, newFolders };
  } catch (err) {
    log.error('Error getting new folders');
    log.error(pe.render(err));
    return { courseWithNewFolders, newFolders };
  }
};

const getNewModules = async (authToken, rootURL, course) => {
  let newModules = [];
  let hasUpdates = false;
  const courseWithNewModules = JSON.parse(JSON.stringify(course));
  try {
    if (courseWithNewModules.hasModulesTab) {
      const modules = await canvasIntegration.getModules(authToken,
        rootURL, courseWithNewModules);
      if (modules.length > courseWithNewModules.modules.length) {
        courseWithNewModules.modules = modules;
        newModules = newModules.concat(modules);
        hasUpdates = true;
      } else {
        log.info('no new modules. checking for new module items');
        for (let j = 0; j < modules.length; j += 1) {
          if (modules[j].items_count !== courseWithNewModules.modules[j].items_count) {
            courseWithNewModules.modules[j] = modules[j];
            newModules.push(modules[j]);
            hasUpdates = true;
          }
        }
      }
    }
    return { courseWithNewModules, newModules, hasUpdates };
  } catch (err) {
    log.error('Error getting new modules');
    log.error(pe.render(err));
    return { courseWithNewModules, newModules, hasUpdates };
  }
};

const createNewFolders = async (rootFolder, folders) => {
  return Promise.all(
    _.forEach(folders, async (folder) => {
      try {
        await fs.accessSync(path.join(rootFolder, folder), fs.constants.F_OK);
        return 'Folder already exists';
      } catch (err) {
        log.error('Folder does not exist');
        return fs.mkdirSync(path.join(rootFolder, folder));
      }
    }));
};

app.setLoginItemSettings({ openAtLogin: true, openAsHidden: true });
