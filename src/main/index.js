/* eslint-disable */
// const { app, BrowserWindow, Menu, dialog, Tray } = require("electron");
import { app, Menu, dialog, ipcMain, BrowserWindow, Tray, ipcRenderer } from 'electron' // eslint-disable-line
import canvasIntegration from '../utils/canvasIntegration';
const path = require('path');
const _ = require('lodash');
const applicationMenu = require('./application-menus');
const dataStorageFile = require('../utils/dataStorage');
const moment = require('moment');
const dataStorage = dataStorageFile.default;
const fs = require('fs');
const request = require('request-promise');
const PrettyError = require('pretty-error');
const pe = new PrettyError();


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
let tray;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

const notConnectedMenu = [
  {
    label: 'Connect',
    enabled: true,
  },
  {
    label: 'Sign Out',
    enabled: false,
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
      label: 'Sign Out',
      enabled: true,
    },
    {
      label: 'Quit',
    },
  ];
};

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    webPreferences: { webSecurity: false },
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  } else {
    Menu.setApplicationMenu(applicationMenu);
  }
  console.log(__static); // eslint-disable-line
  tray = new Tray(
    path.join(__static, 'icons_normal/icons/png/32x32@2x.png') // eslint-disable-line
  );
  tray.setPressedImage(
    path.join(__static, 'icons_inverted/icons/png/32x32@2x.png') // eslint-disable-line
  );

  if (await dataStorage.isConnected()) {
    if (app.dock) app.dock.hide();
    console.log(await dataStorage.getLastSynced());
    updateMenu(getUpdatedConnectedMenu(await dataStorage.getLastSynced()));
  } else {
    updateMenu(notConnectedMenu);
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (app.dock) app.dock.hide();
});

ipcMain.on('choose-folder', (event) => {
  const folder = dialog.showOpenDialog({ properties: ['openDirectory'] });
  event.sender.send('chose-folder', folder);
});

ipcMain.on('download-file', async (e, args) => {
  downloadFile(e, args, 'file-downloaded');
});

ipcMain.on('download-first-file', async (e, args) => {
  downloadFile(e, args, 'first-file-downloaded');
});

const downloadFile = async (e, args, ipcReceiver) => {
  const { options, file } = args;
  try {
    // console.log(file.projectedDownloadTime);
    const timeout = new Promise(function(resolve) {
      setTimeout(resolve, file.projectedDownloadTime, 'Timed out');
    });
    const downloadPromise = new Promise((resolve, reject) => {
      let downloadStream = request.get(options)
        .on('response', () => {
          e.sender.send('request-done', file);
        })
        .on('error', (err) => {
          console.error(pe.render(err));
          reject('failing on request');
        })
        .pipe(fs.createWriteStream(file.fullPath, 'utf8'));
      downloadStream
        .on('error', () => {
          console.error('failing on write stream');
          reject('failing on write stream');
        })
        .on('finish', () => {
          resolve('Download Finished');
        })
    });
    Promise.race([timeout, downloadPromise])
      .then((response) => {
        if (response === 'Download Finished') {
          return e.sender.send(ipcReceiver, file);
        } else {
          return e.sender.send('file-download-failed', file);
        }
      })
      .catch((err) => {
        console.error(pe.render(err));
        return e.sender.send('file-download-failed', file);
      });
  } catch (err) {
    console.error('general exception');
    console.error(pe.render(err));
    return e.sender.send('file-download-failed', file);
  }
}

ipcMain.on('completed-initial-sync', async () => {
  updateMenu(getUpdatedConnectedMenu(await dataStorage.getLastSynced()));
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
  const courses = await dataStorage.getSyncableCourses();
  const authToken = await dataStorage.getAuthToken();
  const rootURL = await dataStorage.getRootURL();
  const rootFolder = await dataStorage.getRootFolder();
  const { coursesWithNewFolders, newFolders } = await getNewFolders(authToken,
    rootURL, courses, lastSynced);
  const foldersToBeCreated = _.flatten(newFolders);
  console.log(foldersToBeCreated.length);
  console.log('last');
  await createNewFolders(rootFolder, foldersToBeCreated);
  const { coursesWithNewFilesAndFolders, newOrUpdatedFiles } = await getNewFiles(authToken,
    rootURL, coursesWithNewFolders, lastSynced);
  console.log(newOrUpdatedFiles);
};

// const filterCoursesWithNewFolders = async (lastSynced, courses, authToken, rootURL) => {
//   const coursesWithNewFolders = [];
//   /* eslint-disable no-await-in-loop */
//   for (let i = 0; i < courses.length; i += 1) {
//     const courseHasNewFolder = await canvasIntegration.hasNewFolder(authToken,
//       rootURL,
//       courses[i].id,
//       lastSynced,
//     );
//     if (courseHasNewFolder) {
//       coursesWithNewFolders.push(courses[i]);
//     }
//   }
//   return coursesWithNewFolders;
// };

const getNewFiles = async (authToken, rootURL, courses, lastSynced) => {
  const coursesWithNewFilesAndFolders = JSON.parse(JSON.stringify(courses));
  const newOrUpdatedFiles = [];
  try {
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < coursesWithNewFilesAndFolders.length; i += 1) {
      const courseHasNewFile = await canvasIntegration.hasNewFile(authToken,
        rootURL,
        coursesWithNewFilesAndFolders[i].id,
        lastSynced);
      if (courseHasNewFile) {
        // console.log('has new file(s)');
        const courseFiles = await canvasIntegration.getAllNewOrUpdatedFiles(authToken, coursesWithNewFilesAndFolders[i], lastSynced);
        // console.log(`num new or updated course files: ${courseFiles.length}`);
        for (let j = 0; j < courseFiles.length; j += 1) {
          const fileIndex = _.findIndex(coursesWithNewFilesAndFolders[i].files,
            { filePath: courseFiles[j]. filePath });
          newOrUpdatedFiles.push(courseFiles[j]);
          if (fileIndex >= 0) {
            // console.log('updating file');
            coursesWithNewFilesAndFolders[i].files[fileIndex] = courseFiles[j];
          } else {
            coursesWithNewFilesAndFolders[i].files.push(courseFiles[j]);
          }
        }
      } else {
        console.log('no new files');
      }
    }
    return { coursesWithNewFilesAndFolders, newOrUpdatedFiles };
  } catch (err) {
    console.error('Error getting new files');
    // console.log(courses);
    console.error(pe.render(err));
    return { coursesWithNewFilesAndFolders, newOrUpdatedFiles };
  }
};

const getNewFolders = async (authToken, rootURL, courses, lastSynced) => {
  const newFolders = [];
  const coursesWithNewFolders = JSON.parse(JSON.stringify(courses));
  try {
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < coursesWithNewFolders.length; i += 1) {
      const courseNewFolders = await canvasIntegration.getNewFolders(authToken,
        rootURL, coursesWithNewFolders[i], lastSynced);
      for (let j = 0; j < courseNewFolders.length; j += 1) {
        const folderIndex = _.findIndex(coursesWithNewFolders[i].folders,
          { folderPath: courseNewFolders[j].folderPath });
        if (folderIndex >= 0) {
          // console.log('updating folder');
          coursesWithNewFolders[i].folders[folderIndex] = courseNewFolders[j];
        } else {
          // console.log('brand new folder');
          coursesWithNewFolders[i].folders.push(courseNewFolders[j]);
          newFolders.push(courseNewFolders[j]);
        }
      }
    }
    return { coursesWithNewFolders, newFolders };
  } catch (err) {
    console.error('Error getting new folders');
    console.error(pe.render(err));
    return { coursesWithNewFolders, newFolders };
  }
};

const createNewFolders = async (rootFolder, folders) => {
  return Promise.all(
    _.forEach(folders, async (folder) => {
      try {
        await fs.accessSync(path.join(rootFolder, folder.folderPath), fs.constants.F_OK);
        return await fs.mkdirSync(path.join(rootFolder, folder.folderPath));
      } catch (err) {
        console.error('Folder already exists');
        return 'Folder already exists';
      }
    }));
};

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
