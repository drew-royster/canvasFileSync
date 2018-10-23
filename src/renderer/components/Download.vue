
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
const prettyMs = require('pretty-ms');
const prettyBytes = require('pretty-bytes');

export default {
  name: 'download',
  data() {
    return {
      progressMessage: 'Creating Folders',
      tips: [
        'Need updates NOW? Click on the CFS icon in system tray and then "Sync Now"',
        'CFS will overwrite any changes you make to files in the sync folder. Copy them somwhere else if you need to edit them.',
        'Suggestions? Issues with the app? Tweet or DM @canvasfilesync',
        'This first download may take a while. Leave this window open, but feel free to go about your business.',
      ],
      progress: 0,
      currentTip: 0,
      bytesToBeDownloaded: 0,
      bytesDownloaded: 0,
      foldersToBeCreated: [],
      filesToBeDownloaded: [],
      filesDownloaded: [],
      filesFailedToDownload: [],
      filesSuccessfullyRequested: [],
      numFoldersCreated: 0,
      numFilesDownloaded: 0,
      numFilesFailed: 0,
      numFilesToBeDownloaded: 0,
      projectedDownloadSpeed: 0,
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
    this.$electron.ipcRenderer.on('folder-created', () => {
      this.numFoldersCreated += 1;
      if (this.numFoldersCreated < this.numFoldersToBeCreated) {
        this.$electron.ipcRenderer.send('create-folder', this.foldersToBeCreated[this.numFoldersCreated]);
      }
    });
    this.$electron.ipcRenderer.on('file-downloaded', (e, file) => {
      this.filesDownloaded.push(file);
      this.$store.dispatch('downloadedFile', file);
      this.bytesDownloaded += file.size;
      this.numFilesDownloaded += 1;
      this.downloadFiles();
    });
    this.$electron.ipcRenderer.on('file-download-failed', (e, file) => {
      // this.numFilesFailed += 1;
      const currentIndex = this.numFilesFailed + this.numFilesDownloaded;
      this.filesToBeDownloaded[currentIndex] = file;
      this.downloadFiles();
    });
    this.$electron.ipcRenderer.on('request-done', (e, file) => {
      this.filesSuccessfullyRequested.push(file);
    });
    this.$electron.ipcRenderer.on('first-file-downloaded', (e, file) => {
      this.filesDownloaded.push(file);
      file.downloadEndTime = Date.now();
      console.log(`File Name: ${file.name}`);
      console.log(`Start Time: ${file.downloadStartTime}`);
      console.log(`End Time: ${file.downloadStartTime}`);
      const downloadTime = (file.downloadEndTime - file.downloadStartTime);
      console.log(`Difference: ${prettyMs(downloadTime)}`);
      console.log(`File Size: ${prettyBytes(file.size)}`);
      this.projectedDownloadSpeed = (file.size / downloadTime) -
        ((file.size / downloadTime) * 0.75);
      console.log(`Estimated Download Speed Bytes/Second: ${prettyBytes(this.projectedDownloadSpeed)}`);
      this.$store.dispatch('downloadedFile', file);
      this.bytesDownloaded += file.size;
      this.numFilesDownloaded += 1;
      this.downloadFiles();
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
          retries: 1,
        };
      });
      const foldersArray = _.map(course.folders, (folder) => {
        return path.join(this.rootFolder, folder.folderPath);
      });
      foldersArray.push(path.join(this.rootFolder, course.name));
      this.foldersToBeCreated = this.foldersToBeCreated.concat(foldersArray);
      this.filesToBeDownloaded = this.filesToBeDownloaded.concat(filesArray);
    });
    this.numFilesToBeDownloaded = this.filesToBeDownloaded.length;
    this.foldersToBeCreated = _.sortBy(this.foldersToBeCreated, (folder) => {
      return (folder.match(/\//g) || []).length;
    });

    this.foldersToBeCreated = _.sortBy(this.foldersToBeCreated, (folder) => {
      return (folder.match(/\\/g) || []).length;
    });
    // Send the first folder to be created. This will then ping-pong until all of them are created
    this.$electron.ipcRenderer.send('create-folder', this.foldersToBeCreated[0]);
    setInterval(() => {
      if (this.currentTip + 1 === this.tips.length) {
        this.currentTip = 0;
      } else {
        this.currentTip += 1;
      }
    }, 5 * 1000);
    setInterval(() => {
      let currentProgress = 0;
      if (!this.foldersCreated) {
        currentProgress = (this.numFoldersCreated / this.numFoldersToBeCreated) * 100;
      } else {
        currentProgress = (this.bytesDownloaded / this.bytesToBeDownloaded) * 100;
      }
      this.progress = currentProgress;
    }, 1 * 1000);
    // setInterval(() => {
    //   if (this.foldersCreated) {
    //     this.retryFiles();
    //   }
    // }, 10 * 1000);
  },
  watch: {
    numFoldersCreated() {
      if (this.numFoldersCreated === this.numFoldersToBeCreated) {
        this.foldersCreated = true;
        this.progressMessage = 'Downloading';
        if (this.filesToBeDownloaded.length > 0) {
          const file = this.filesToBeDownloaded[0];
          const options = {
            method: 'GET',
            uri: file.url,
            headers: { Authorization: `Bearer ${this.authToken}` },
            json: true,
            encoding: null,
          };
          file.projectedDownloadTime = 300 * 1000;
          file.downloadStartTime = Date.now();
          this.$electron.ipcRenderer.send('download-first-file', { options, file });
        }
      }
    },
    numFilesDownloaded() {
      if (this.numFilesDownloaded === this.numFilesToBeDownloaded) {
        this.$store.dispatch('completedInitialSync').then(() => {
          this.done = true;
          this.progressMessage = 'DONE';
          this.$electron.ipcRenderer.send('completed-initial-sync');
        });
      }
    },
  },
  methods: {
    downloadFiles() {
      if (this.numFilesDownloaded !== this.numFilesToBeDownloaded) {
        const currentIndex = this.numFilesDownloaded + this.numFilesFailed;
        if (this.filesToBeDownloaded[currentIndex].retries > 0) {
          const projectedDownloadTime = (this.filesToBeDownloaded[currentIndex].size /
            this.projectedDownloadSpeed) + 5000; // in ms * adding 5 seconds
          this.filesToBeDownloaded[currentIndex].whenToExpect =
            Date.now() + projectedDownloadTime;
          this.filesToBeDownloaded[currentIndex].projectedDownloadTime =
            projectedDownloadTime;
          this.filesToBeDownloaded[currentIndex].retries -= 1;
          // console.log(`Time Now: ${Date.now()}`);
          // console.log(`When I should download it by: ${Date.now() + projectedDownloadTime}`);
          const file = this.filesToBeDownloaded[currentIndex];
          const options = {
            method: 'GET',
            uri: file.url,
            headers: { Authorization: `Bearer ${this.authToken}` },
            json: true,
            encoding: null,
          };
          console.log(`File size: ${prettyBytes(file.size)}`);
          console.log(`MS expected to take: ${prettyMs(projectedDownloadTime)}`);
          console.log(`Download Speed: ${prettyBytes(this.projectedDownloadSpeed)}`);
          this.$electron.ipcRenderer.send('download-file', { options, file });
        } else {
          this.filesFailedToDownload.push(this.filesToBeDownloaded[currentIndex]);
          this.numFilesFailed += 1;
        }
      }
    },
    retryFiles() {
      for (let i = 0; i < this.filesToBeDownloaded.length; i += 1) {
        if (Date.now() > this.filesToBeDownloaded[i].whenToExpect &&
          this.filesToBeDownloaded[i].retries > 0) {
          console.log(`Retrying: ${this.filesToBeDownloaded[i].name}`);
          this.filesToBeDownloaded[i].retries -= 1;
          const projectedDownloadTime = (this.filesToBeDownloaded[i].size /
            this.projectedDownloadSpeed); // in ms
          this.filesToBeDownloaded[i].whenToExpect = Date.now() + projectedDownloadTime;
          console.log(`MS expected to take: ${projectedDownloadTime}`);
          console.log(`Time Now: ${Date.now()}`);
          console.log(`When I should download it by: ${Date.now() + projectedDownloadTime}`);
          const file = this.filesToBeDownloaded[i];
          const options = {
            method: 'GET',
            uri: file.url,
            headers: { Authorization: `Bearer ${this.authToken}` },
            json: true,
            encoding: null,
          };
          this.$electron.ipcRenderer.send('download-file', { options, file });
        }
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
