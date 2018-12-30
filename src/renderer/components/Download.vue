<template>
  <v-content>
    <v-layout mt-5 justify-center align-center row>
      <v-flex xs12 sm10 text-xs-center>
        <v-progress-circular
          :rotate="180"
          :size="400"
          :width="30"
          :value="progress"
          color="#F79520"
        >
          <h1 display-4 text-xs-center>
            {{ progressMessage }}
          </h1>
        </v-progress-circular>  
      </v-flex>
    </v-layout>
    <v-layout v-if="!done" mt-5 justify-center align-center row>
      <v-flex xs12 sm10 text-xs-center>
        <p>{{ tips[currentTip] }}</p>
      </v-flex>
    </v-layout>
    <v-layout v-else mt-5 justify-center align-center row>
      <v-flex xs12 sm10 text-xs-center>
        <p>Feel free to close this window. We'll keep you up to date behind the scenes</p>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import is from 'electron-is';
const _ = require('lodash');
const path = require('path');
// const prettyMs = require('pretty-ms');
// const prettyBytes = require('pretty-bytes');
const log = require('electron-log');

export default {
  name: 'download',
  data() {
    return {
      progressMessage: 'Creating Folders',
      tips: [
        'Need updates NOW? Click on the CFS icon in system tray and then "Sync Now".',
        'CFS will overwrite any changes you make to files in the sync folder. Copy them somwhere else if you need to edit them.',
        'Suggestions? Issues with the app? Tweet or DM @canvasfilesync',
        'This first download may take a while. Leave this window open, but feel free to go about your business.',
      ],
      progress: 0,
      currentTip: 0,
      projectedDownloadSpeed: null,
      foldersToBeCreated: [],
      filesToBeDownloaded: [],
      filesDownloading: [],
      filesDownloaded: [],
      filesFailedToDownload: [],
      numFoldersCreated: 0,
      numFilesDownloaded: 0,
      numFilesFailed: 0,
      numFilesToBeDownloaded: 0,
      foldersCreated: false,
      done: false,
    };
  },
  computed: {
    courses() {
      return this.$store.getters.courses;
    },
    rootFolder() {
      return this.$store.getters.rootFolder;
    },
    gotAllCourses() {
      return this.$store.getters.gotAllCourses;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
    numFoldersToBeCreated() {
      return this.foldersToBeCreated.length;
    },
  },
  mounted() {
    this.$electron.ipcRenderer.send('syncing');
    this.$electron.ipcRenderer.send('download-started');
    this.$electron.ipcRenderer.on('folders-created', () => {
      this.foldersCreated = true;
      this.progressMessage = 'Downloading';
      if (this.filesToBeDownloaded.length > 0) {
        // const downloadSpeed = 200; // low end estimate 200Bytes/MS
        this.projectedDownloadSpeed = 200;
        this.$electron.ipcRenderer.send('download-files', this.filesToBeDownloaded);
      }
    });
    this.$electron.ipcRenderer.on('update-progress', (e, currentProgress) => {
      this.progress = currentProgress;
    });
    this.$electron.ipcRenderer.on('download-report', (e, { filesDownloaded, failedDownloads }) => {
      this.numFilesDownloaded = filesDownloaded;
      this.numFilesFailed = failedDownloads;
      this.signalDone();
    });
    const onlySyncable = _.filter(this.courses, (course) => { return course.sync; });
    _.forEach(onlySyncable, (course) => {
      // this applies for both modules view and the other views
      const filesArray = _.map(course.files, (file) => {
        return {
          url: file.url,
          filePath: file.filePath,
          fullPath: path.join(this.rootFolder, file.filePath),
          name: file.name,
          courseID: course.id,
          size: file.size,
          retries: 3,
        };
      });

      let foldersArray = [];
      // add modules
      if (course.hasModulesTab) {
        foldersArray = foldersArray.concat(_.map(course.modules, (courseModule) => {
          return path.join(this.rootFolder, courseModule.modulePath);
        }));
      }
      // non-modules view
      foldersArray = foldersArray.concat(_.map(course.folders, (folder) => {
        return path.join(this.rootFolder, folder.folderPath);
      }));
      // adding course as folder
      foldersArray.push(path.join(this.rootFolder, course.name));
      this.foldersToBeCreated = this.foldersToBeCreated.concat(foldersArray);
      this.filesToBeDownloaded = this.filesToBeDownloaded.concat(filesArray);
    });
    this.numFilesToBeDownloaded = this.filesToBeDownloaded.length;
    if (is.windows()) {
      this.foldersToBeCreated = _.sortBy(this.foldersToBeCreated, (folder) => {
        return (folder.match(/\\/g) || []).length;
      });
    } else {
      this.foldersToBeCreated = _.sortBy(this.foldersToBeCreated, (folder) => {
        return (folder.match(/\//g) || []).length;
      });
    }

    // Send the first folder to be created. This will then ping-pong until all of them are created
    // this.$electron.ipcRenderer.send('create-folder', this.foldersToBeCreated[0]);
    this.$electron.ipcRenderer.send('create-folders', this.foldersToBeCreated);
    setInterval(() => {
      if (this.currentTip + 1 === this.tips.length) {
        this.currentTip = 0;
      } else {
        this.currentTip += 1;
      }
    }, 5 * 1000);
  },
  methods: {
    signalDone() {
      log.info('Done Downloading');
      this.$electron.ipcRenderer.send('completed-initial-sync');
      const payload = {
        successes: this.numFilesDownloaded,
        failures: this.numFilesFailed,
      };
      this.$store.dispatch('completedInitialSync', payload).then(() => {
        this.done = true;
        this.progressMessage = 'DONE';
      });
    },
  },
};
</script>
