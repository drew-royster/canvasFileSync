
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
    this.$electron.ipcRenderer.on('folder-created', () => {
      this.numFoldersCreated += 1;
      if (this.numFoldersCreated < this.numFoldersToBeCreated) {
        this.$electron.ipcRenderer.send('create-folder', this.foldersToBeCreated[this.numFoldersCreated]);
      }
    });
    this.$electron.ipcRenderer.on('file-downloaded', (e, file) => {
      file.downloadEndTime = Date.now();
      console.log(`File Name: ${file.name}`);
      console.log(`Start Time: ${file.downloadStartTime}`);
      console.log(`End Time: ${file.downloadStartTime}`);
      const downloadTime = (file.downloadEndTime - file.downloadStartTime);
      console.log(`Difference: ${prettyMs(downloadTime)}`);
      console.log(`File Size: ${prettyBytes(file.size)}`);
      const projectedDownloadSpeed = (file.size / downloadTime) -
        ((file.size / downloadTime) * 0.5);
      console.log(`Estimated Download Speed Bytes/Second: ${prettyBytes(projectedDownloadSpeed * 1000)}`);
      this.filesDownloaded.push(file);
      this.$store.dispatch('downloadedFile', file);
      this.bytesDownloaded += file.size;
      this.numFilesDownloaded += 1;
      console.log(`sending ${projectedDownloadSpeed} to downloadFile`);
      this.downloadFile(projectedDownloadSpeed);
    });
    this.$electron.ipcRenderer.on('file-download-failed', (e, file) => {
      // this.numFilesFailed += 1;
      const currentIndex = this.numFilesFailed + this.numFilesDownloaded;
      this.filesToBeDownloaded[currentIndex] = file;
      this.downloadFile(200); // low end estimate 200Bytes/MS
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
          retries: 3,
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
  },
  watch: {
    numFoldersCreated() {
      if (this.numFoldersCreated === this.numFoldersToBeCreated) {
        this.foldersCreated = true;
        this.progressMessage = 'Downloading';
        if (this.filesToBeDownloaded.length > 0) {
          const downloadSpeed = 200; // low end estimate 200Bytes/MS
          this.downloadFile(downloadSpeed);
        }
      }
    },
  },
  methods: {
    downloadFile(projectedDownloadSpeed) {
      const currentIndex = this.numFilesDownloaded + this.numFilesFailed;
      if (currentIndex !== this.numFilesToBeDownloaded) {
        if (this.filesToBeDownloaded[currentIndex].retries > 0) {
          // this is the formula to estimate how long it will take to download
          this.filesToBeDownloaded[currentIndex].projectedDownloadTime =
            (this.filesToBeDownloaded[currentIndex].size /
            projectedDownloadSpeed) + 5000; // in ms * adding 5 seconds

          // setting now as the start time of download
          this.filesToBeDownloaded[currentIndex].downloadStartTime = Date.now();

          // decrementing retry count
          this.filesToBeDownloaded[currentIndex].retries -= 1;
          const file = this.filesToBeDownloaded[currentIndex];
          const options = {
            method: 'GET',
            uri: file.url,
            headers: { Authorization: `Bearer ${this.authToken}` },
            json: true,
            encoding: null,
          };
          console.log(`File size: ${prettyBytes(file.size)}`);
          console.log(`MS expected to take: ${prettyMs(file.projectedDownloadTime)}`);
          console.log(projectedDownloadSpeed);
          console.log(`Download Speed: ${prettyBytes(projectedDownloadSpeed * 1000)}/s`);
          this.$electron.ipcRenderer.send('download-file', { options, file });
        } else {
          this.filesFailedToDownload.push(this.filesToBeDownloaded[currentIndex]);
          this.numFilesFailed += 1;
          this.downloadFile(200); // low end estimate 200Bytes/MS
        }
      } else {
        this.$electron.ipcRenderer.send('completed-initial-sync');
        const payload = {
          successes: this.numFilesDownloaded,
          failures: this.numFilesFailed,
        };
        this.$store.dispatch('completedInitialSync', payload).then(() => {
          this.done = true;
          this.progressMessage = 'DONE';
        });
      }
    },
  },
};
</script>
