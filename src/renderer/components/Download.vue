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
const _ = require('lodash');
const path = require('path');

export default {
  name: 'download',
  data() {
    return {
      progressMessage: 'Creating Folders',
      tips: [
        'Need updates NOW? Click on the CFS icon in system tray and then "Sync Now"',
        'CFS will overwrite any changes you make to files in the sync folder. Copy them somwhere else if you need to edit them.',
        'Suggestions? Issues with the app? Tweet or DM @canvasfilesync',
      ],
      progress: 0,
      currentTip: 0,
      bytesToBeDownloaded: 0,
      bytesDownloaded: 0,
      foldersToBeCreated: [],
      filesToBeDownloaded: [],
      filesFailedToDownload: [],
      numFoldersCreated: 0,
      numFilesDownloaded: 0,
      foldersCreated: false,
      done: false,
    };
  },
  computed: {
    courses() {
      return this.$store.getters.itemsMap;
    },
    rootFolder() {
      return this.$store.getters.rootFolder;
    },
    generatedItemsMap() {
      return this.$store.getters.generatedItemsMap;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
    numFoldersToBeCreated() {
      return this.foldersToBeCreated.length;
    },
    numFilesToBeDownloaded() {
      return this.filesToBeDownloaded.length;
    },
  },
  mounted() {
    this.$electron.ipcRenderer.on('folder-created', () => {
      this.numFoldersCreated += 1;
      if (this.numFoldersCreated < this.numFoldersToBeCreated) {
        this.$electron.ipcRenderer.send('create-folder', this.foldersToBeCreated[this.numFoldersCreated]);
      }
    });
    this.$electron.ipcRenderer.on('file-downloaded', (e, file) => {
      _.remove(this.filesToBeDownloaded, (fileToBeDownloaded) => {
        return fileToBeDownloaded.fullPath === file.fullPath;
      });
      this.$store.dispatch('downloadedFile', file);
      this.bytesDownloaded += file.size;
      this.numFilesDownloaded += 1;
    });
    this.$electron.ipcRenderer.on('file-download-failed', (e, file) => {
      this.filesFailedToDownload.push(file);
    });
    const onlySyncable = _.filter(this.courses, (course) => { return course.sync; });
    _.forEach(onlySyncable, (course) => {
      const courseSum = _.sumBy(course.files, (file) => { return file.size; });
      this.bytesToBeDownloaded += courseSum;
      const filesArray = _.map(course.files, (file) => {
        return {
          url: file.url,
          filePath: file.filePath,
          fullPath: path.join(this.rootFolder, file.filePath),
          name: file.name,
          courseID: course.id,
          size: file.size,
        };
      });
      const foldersArray = _.map(course.folders, (folder) => {
        return path.join(this.rootFolder, folder.folderPath);
      });
      foldersArray.push(path.join(this.rootFolder, course.name));
      this.foldersToBeCreated = this.foldersToBeCreated.concat(foldersArray);
      this.filesToBeDownloaded = this.filesToBeDownloaded.concat(filesArray);
    });
    this.foldersToBeCreated = _.sortBy(this.foldersToBeCreated, (folder) => {
      return (folder.match(/\//g) || []).length;
    });
    // Send the first folder to be created. This will then ping-pong until all of them are created
    this.$electron.ipcRenderer.send('create-folder', this.foldersToBeCreated[0]);
    setInterval(() => {
      if (this.currentTip + 1 === this.tips.length) {
        this.currentTip = 0;
      } else {
        this.currentTip += 1;
      }
    }, 5000);
    setInterval(() => {
      let currentProgress = 0;
      if (!this.foldersCreated) {
        currentProgress = (this.numFoldersCreated / this.numFoldersToBeCreated) * 100;
      } else {
        currentProgress = (this.bytesDownloaded / this.bytesToBeDownloaded) * 100;
      }
      this.progress = currentProgress;
    }, 1000);
  },
  watch: {
    numFoldersCreated() {
      if (this.numFoldersCreated === this.numFoldersToBeCreated) {
        this.foldersCreated = true;
        this.progressMessage = 'Downloading';
        _.forEach(this.filesToBeDownloaded, (file) => {
          const options = {
            method: 'GET',
            uri: file.url,
            headers: { Authorization: `Bearer ${this.authToken}` },
            json: true,
            encoding: null,
          };
          this.$electron.ipcRenderer.send('download-file', { options, file });
        });
      }
    },
    numFilesDownloaded() {
      if (this.numFilesDownloaded === this.numFilesToBeDownloaded) {
        this.$store.dispatch('completedInitialSync').then(() => {
          this.done = true;
          this.progressMessage = 'DONE';
        });
      }
    },
  },
};
</script>

<style scoped>
 #main-content
  {
    margin-top: 2%;
  }
  </style>
