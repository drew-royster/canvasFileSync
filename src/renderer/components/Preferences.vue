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
    <v-layout mt-5 justify-center align-center row>
      <v-flex xs12 sm8>
        <v-layout row>
          <v-flex text-xs-center>
            <h1 class="display-3" text-xs-center>
            Preferences
            </h1>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-card>
              <v-layout ma-2 align-center ref="frequencyForm">
                <h1 class="headline">Sync Frequency</h1>
                <v-flex ml-2 xs1>
                  <v-text-field
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
                <v-btn color="blue" large @click="rebuild">REBUILD! GET EVERYTHING AGAIN</v-btn>                       
              </v-layout>
              <v-layout ma-2 justify-center align-center>
                <v-btn color="red" large @click="disconnect">LOGOUT AND ERASE ALL SETTINGS</v-btn>                       
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
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
const log = require('electron-log');

export default {
  name: 'Preferences',
  data() {
    return {
      localSyncFrequency: 0,
      folder: 'Choose Folder',
      displayFailure: false,
      displaySuccess: false,
      displayInfo: false,
      successMessage: '',
      failureMessage: '',
      infoMessage: 'Update is available! Restart to Install',
    };
  },
  methods: {
    chooseFolder() {
      this.$electron.ipcRenderer.send('choose-folder');
    },
    disconnect() {
      this.$electron.ipcRenderer.send('disconnect');
    },
    rebuild() {
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
  },
  mounted() {
    this.$store.dispatch('loadSavedState').then(() => {
      this.folder = this.$store.getters.rootFolder;
      this.localSyncFrequency = this.$store.getters.syncFrequency;
      this.$electron.ipcRenderer.on('chose-folder', (event, data) => {
        this.folderChosen = true;
        this.folder = data[0];
      });
    });
    this.$electron.ipcRenderer.on('disconnected', () => {
      this.$store.dispatch('clearStateGoLogin');
    });
  },
};
</script>
