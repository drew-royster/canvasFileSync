<template>
  <v-content>
    <v-layout mt-5 justify-center align-center row>
      <v-flex xs12 sm10>
        <v-layout v-if="!generatedItemsMap" justify-center align-center>
          <v-flex>
            <v-progress-circular
              :rotate="180"
              :size="400"
              :width="30"
              :value="progress"
              color="#F79520"
            >
              <h1>
                {{ progressMessage }}
              </h1>
            </v-progress-circular>  
          </v-flex>
        </v-layout>
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
      progressMessage: 'Downloading Now',
      progress: 0,
      tips: [
        'Need updates NOW? Click on the CFS icon in system tray and then "Sync Now"',
        'CFS will overwrite any changes you make to files in the sync folder. Copy them somwhere else if you need to edit them.',
        'Suggestions? Issues with the app? Tweet or DM @canvasfilesync',
      ],
      bytesToBeDownloaded: 0,
      foldersToBeCreated: [],
      filesToBeDownloaded: [],
      numFoldersCreated: 0,
      numFilesDownloaded: 0,
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
    numFoldersToBeCreated() {
      return this.foldersToBeCreated.length;
    },
    numFilesToBeDownloaded() {
      return this.filesToBeDownloaded.length;
    },
  },
  mounted() {
    const onlySyncable = _.filter(this.courses, (course) => { return course.sync; });
    _.forEach(onlySyncable, (course) => {
      const courseSum = _.sumBy(course.files, (file) => { return file.size; });
      this.bytesToBeDownloaded += courseSum;
      const filesArray = _.map(course.files, (file) => {
        return {
          url: file.url,
          fullPath: path.join(this.rootFolder, file.filePath),
          name: file.name,
          courseID: course.id,
          size: file.size,
        };
      });
      const foldersArray = _.map(course.folders, (folder) => {
        // console.log(folder);
        return path.join(this.rootFolder, folder.folderPath);
      });
      // console.log(foldersArray);
      this.foldersToBeCreated = this.foldersToBeCreated.concat(foldersArray);
      this.filesToBeDownloaded = this.filesToBeDownloaded.concat(filesArray);
    });
    _.forEach(this.foldersToBeCreated, (folder) => {
      this.$electron.ipcRenderer.send('create-folder', folder);
    });
  },
  watch: {
    numSynced() {
      console.log(`numSynced:${this.numSynced} - numSyncable:${this.numSyncableCourses}`);
      if (this.numSynced === this.numSyncableCourses) {
        this.progressMessage = 'Done';
        this.$store.dispatch('saveStateToDisk');
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
