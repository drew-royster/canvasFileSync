<template>
  <v-content>
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
              <!-- Disabling for now, because this would require more setup -->
              <!-- <v-layout ma-2 justify-start align-center row>
                <h1 class="headline">Sync Folder</h1>             
                <v-btn large @click="chooseFolder">{{ folder }}</v-btn>                       
              </v-layout> -->
              <v-layout ma-2 align-center>
                <h1 class="headline">Sync Frequency</h1>
                <v-flex ml-2 xs1>
                  <v-text-field
                    v-model="localSyncFrequency"
                    class="mt-0 headline"
                    type="number"
                  ></v-text-field>          
                </v-flex>
                <v-btn v-if="changedSyncFrequency">Save</v-btn>        
                <v-btn v-else disabled>Save</v-btn>        
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>

export default {
  name: 'Preferences',
  data() {
    return {
      localSyncFrequency: 0,
      folder: 'Choose Folder',
    };
  },
  methods: {
    chooseFolder() {
      this.$electron.ipcRenderer.send('choose-folder');
    },
  },
  computed: {
    syncFrequency() {
      return this.$store.getters.syncFrequency;
    },
    changedSyncFrequency() {
      if (this.localSyncFrequency !== this.syncFrequency) {
        return true;
      }
      return false;
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
  },
};
</script>
