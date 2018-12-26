<template>
  <v-content>
    <v-alert
      :value="displaySuccess"
      type="success"
      dismissible
    >
      {{ successMessage }}
    </v-alert>
    <v-alert
      :value="displayFailure"
      type="success"
      dismissible
    >
      {{ failureMessage }}
    </v-alert>
    <v-alert
      :value="displayInfo"
      type="info"
      dismissible
    >
      {{ infoMessage }}
    </v-alert>
    <v-layout mt-4 justify-center align-center row>
      <v-flex xs12 sm8>
        <v-dialog v-model="dialog" max-width="500px" scrollable>
          <v-card>
            <v-card-title>Save the file you edited</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                single-line
                v-model="userEditedFileName"
                :rules="fileNameRules"
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat :disabled="!validFileName" @click="renameAndDownload()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-tabs
          slot="extension"
          v-model="tab"
          grow
        >
          <v-tabs-slider></v-tabs-slider>
  
          <v-tab>
            Settings
          </v-tab>
          <v-tab-item>
            <v-layout row>
            <v-flex>
              <v-card>
                <v-layout  align-center ref="frequencyForm">
                  <h1 class="headline">Sync Frequency</h1>
                  <v-flex ml-2 xs1>
                    <v-text-field
                      aria-label="How often to check for new files and folders"
                      ref="localSyncFrequency"
                      v-model="localSyncFrequency"
                      :rules="[() => parseInt(localSyncFrequency) > 0 || 'Must be greater than zero']"
                      required
                      class="mt-0 headline"
                      type="number"
                    ></v-text-field>          
                  </v-flex>
                  <v-btn v-if="validSyncFrequency" @click="updateSyncFrequency">Save</v-btn>        
                  <v-btn v-else disabled>Save</v-btn>        
                </v-layout>
                <v-layout ma-2 justify-center align-center>
                  <v-btn :loading="loadingRebuild" color="blue" large @click="rebuild">REBUILD! GET EVERYTHING AGAIN</v-btn>                       
                </v-layout>
                <v-layout ma-2 justify-center align-center>
                  <v-btn :loading="loadingDisconnect" color="red" large @click="disconnect">LOGOUT AND ERASE ALL SETTINGS</v-btn>                       
                </v-layout>
                <v-layout mt-5 justify-center align-center>
                  <v-footer class=“pa-3” absolute>
                    <v-spacer></v-spacer>
                    <v-flex
                    py-3
                    text-xs-center
                    xs12
                  >CANVAS FILE SYNC &copy; v{{ version }}</v-flex>
                  </v-footer>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
          </v-tab-item>
          <v-tab>
            Conflicts
            <v-badge v-if="conflicts.length > 0" color="red">
              <span id="failuresSpan" slot="badge">{{ conflicts.length }}</span>
              <v-icon
                small
                color="grey"
              >
                attach_file
              </v-icon>
            </v-badge>
            <v-badge v-else color="green">
              <span id="failuresSpan" slot="badge">{{ conflicts.length }}</span>
              <v-icon
                small
                color="grey"
              >
                attach_file
              </v-icon>
            </v-badge>
          </v-tab>
          <v-tab-item>
            <v-layout row>
              <v-flex>
                <v-card>
                  <v-list>
                    <v-list-group
                      v-for="(conflict, index) in conflicts"
                      :key="conflict.filePath"
                      prepend-icon="file_copy"
                      no-action
                    >
                      <v-list-tile slot="activator">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ conflict.filePath }}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
          
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-layout pl-2>
                          <v-list-tile-title>Which version would you like to keep?</v-list-tile-title>  
                          </v-layout>
                        </v-list-tile-content>
          
                        <v-list-tile-action>
                          <v-icon></v-icon>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-layout justify-center align-center row wrap>
                            <v-flex>
                              <v-btn @click="removeConflict(index)">Mine</v-btn>                      
                            </v-flex>
                            <v-flex>
                              <v-btn @click="getTheirs(index)">Theirs</v-btn>                      
                            </v-flex>
                            <v-flex>
                              <v-btn @click="getBoth(index)">Both</v-btn>                      
                            </v-flex>
                          </v-layout>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list-group>
                  </v-list>
                  <v-layout mt-5 justify-center align-center>
                  <v-footer class=“pa-3” absolute>
                    <v-spacer></v-spacer>
                    <v-flex
                    py-3
                    text-xs-center
                    xs12
                  >CANVAS FILE SYNC &copy; v{{ version }}</v-flex>
                  </v-footer>
                </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import is from 'electron-is';
const log = require('electron-log');
const _ = require('lodash');
const path = require('path');

export default {
  name: 'Preferences',
  data() {
    return {
      tab: null,
      dialog: false,
      localSyncFrequency: 0,
      folder: 'Choose Folder',
      displayFailure: false,
      displaySuccess: false,
      displayInfo: false,
      successMessage: '',
      failureMessage: '',
      infoMessage: 'Update is available! Restart to Install',
      loadingRebuild: false,
      loadingDisconnect: false,
      conflicts: [],
      currentConflictIndex: null,
      fileNamesInFolder: [],
      fullFolderPath: null,
      userEditedFileName: '',
      fileNameRules: [
        v => !!v || 'auth token is required',
        v => !this.fileNamesInFolder.includes(v) || 'must be unique to folder',
      ],
    };
  },
  methods: {
    chooseFolder() {
      this.$electron.ipcRenderer.send('choose-folder');
    },
    removeConflict(conflictIndex) {
      this.$store.dispatch('removeConflict', this.conflicts[conflictIndex]).then(() => {
        this.conflicts = this.$store.getters.conflicts;
        this.$forceUpdate();
      });
    },
    getTheirs(conflictIndex) {
      this.$electron.ipcRenderer.send('download-conflict-file',
        { file: this.conflicts[conflictIndex], rootFolder: this.rootFolder });
    },
    getBoth(conflictIndex) {
      this.dialog = true;
      this.currentConflictIndex = conflictIndex;
      this.userEditedFileName = this.conflicts[conflictIndex].name;
      let folderPath;
      if (is.windows()) {
        const rawSplit = this.conflicts[conflictIndex].filePath.split(/\\/g);
        rawSplit.pop();
        folderPath = rawSplit.join('\\');
      } else {
        const rawSplit = this.conflicts[conflictIndex].filePath.split(/\//g);
        rawSplit.pop();
        folderPath = rawSplit.join('/');
      }
      this.fullFolderPath = path.join(this.rootFolder, folderPath);
      this.$electron.ipcRenderer.send('get-filenames-in-folder', this.fullFolderPath);
    },
    renameAndDownload() {
      const fullFilePath = path.join(this.rootFolder,
        this.conflicts[this.currentConflictIndex].filePath);
      const newFullFilePath = path.join(this.fullFolderPath, this.userEditedFileName);
      this.$electron.ipcRenderer.send('rename-file', { filePath: fullFilePath, newFilePath: newFullFilePath });
    },
    disconnect() {
      this.loadingDisconnect = true;
      this.$electron.ipcRenderer.send('disconnect');
    },
    rebuild() {
      this.loadingRebuild = true;
      this.$store.dispatch('connect').then(() => {
        console.log('done reconnecting');
        this.$router.push('/configure');
      });
    },
    updateSyncFrequency() {
      if (this.$refs.localSyncFrequency.validate(true)) {
        this.$store.dispatch('updateSyncFrequency', { newFrequency: this.localSyncFrequency })
          .then((response) => {
            this.displaySuccess = true;
            this.successMessage = response;
          })
          .catch((err) => {
            log.error(err);
            this.displayFailure = true;
            this.failureMessage = JSON.stringify(err);
          });
      }
    },
  },
  computed: {
    syncFrequency() {
      return this.$store.getters.syncFrequency;
    },
    validSyncFrequency() {
      if (parseInt(this.localSyncFrequency, 10) !== parseInt(this.syncFrequency, 10)) {
        return true;
      }
      return false;
    },
    version() {
      return this.$store.getters.version;
    },
    rootFolder() {
      return this.$store.getters.rootFolder;
    },
    validFileName() {
      if (this.fileNamesInFolder.includes(this.userEditedFileName)) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.$store.dispatch('loadSavedState').then(() => {
      this.folder = this.$store.getters.rootFolder;
      this.localSyncFrequency = this.$store.getters.syncFrequency;
      this.conflicts = this.$store.getters.conflicts;
      this.$electron.ipcRenderer.on('chose-folder', (event, data) => {
        this.folderChosen = true;
        this.folder = data[0];
      });
    });
    this.$electron.ipcRenderer.on('disconnected', () => {
      this.$store.dispatch('clearStateGoLogin');
      this.loadingDisconnect = false;
    });
    this.$electron.ipcRenderer.on('downloaded-conflict-file', (event, file) => {
      console.log(file);
      const conflictIndex = _.findIndex(this.conflicts, { filePath: file.filePath });
      this.removeConflict(conflictIndex);
      this.dialog = false;
    });
    this.$electron.ipcRenderer.on('returning-filenames', (event, filenames) => {
      this.fileNamesInFolder = filenames;
    });
    this.$electron.ipcRenderer.on('renamed-file', () => {
      this.getTheirs(this.currentConflictIndex);
    });
  },
};
</script>
