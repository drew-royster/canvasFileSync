<template>
  <v-content>
    <v-layout id="main-content" row>
      <v-flex xs2></v-flex>
      <v-flex xs8>
        <v-container>
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1">What to sync?</v-stepper-step>
        
              <v-divider></v-divider>
        
              <v-stepper-step :complete="step > 2" step="2">Where to sync it?</v-stepper-step>
        
              <v-divider></v-divider>
        
              <v-stepper-step step="3">How often?</v-stepper-step>
            </v-stepper-header>
        
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card
                  class="mb-5"
                >
                <h1><i>Coming Soon!</i></h1>
                </v-card>
        
                <v-btn
                  color="primary"
                  @click="step = 2"
                >
                  Continue
                </v-btn>
        
                <v-btn flat>Cancel</v-btn>
              </v-stepper-content>
        
              <v-stepper-content step="2">
                <v-card
                  class="mb-5"
                >
                  <v-flex large text-xs-center>
                    <v-btn @click="chooseFolder">{{ folder }}</v-btn>
                  </v-flex>
                </v-card>
        
                <v-btn
                  color="primary"
                  @click="step = 3"
                >
                  Continue
                </v-btn>
        
                <v-btn flat>Cancel</v-btn>
              </v-stepper-content>
        
              <v-stepper-content step="3">
                <v-card
                  class="mb-5"
                >
                <v-layout align-baseline row>
                  <v-flex xs7>
                    <h1>I would like to sync every</h1>
                  </v-flex>
                  <v-flex xs1>
                    <v-text-field
                      v-model="syncFrequency"
                      class="mt-0 headline"
                      type="number"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <h1>minutes</h1>
                  </v-flex>
                  <v-flex xs2></v-flex>
                </v-layout>
                </v-card>
        
                <v-btn
                  color="primary"
                  @click="beginSync"
                >
                  Continue
                </v-btn>
        
                <v-btn flat>Cancel</v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-container>
      </v-flex>
      <v-flex xs2></v-flex>
    </v-layout>
  </v-content>
</template>

<script>
  const request = require('request-promise');
  export default {
    name: 'configure',
    data() {
      return {
        step: 0,
        syncFrequency: 5,
        folder: 'Choose Folder',
        folderChosen: false,
      };
    },
    watch: {
      search(val) {
        // Items have already been loaded
        // if (this.items.length > 0) return;
        if (this.school && val !== this.school.name) {
          this.school = null;
        }
        this.isLoading = true;
        // Lazily load input items
        const options = {
          method: 'GET',
          uri: `https://canvas.instructure.com/api/v1/accounts/search?name=${val}`,
          json: true,
        };
        request(options).then((res) => {
          console.log(res);
          console.log(res.length);
          this.count = res.length;
          this.schools = res;
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.isLoading = false;
        });
      },
    },
    methods: {
      chooseFolder() {
        this.$electron.ipcRenderer.send('choose-folder');
      },
      beginSync() {
        if (this.folderChosen) {
          this.$store.dispatch('beginInitialSync', { rootFolder: this.folder, syncFrequency: this.syncFrequency });
        }
      },
    },
    mounted() {
      this.$store.dispatch('generateFilesMap');
      this.$electron.ipcRenderer.on('chose-folder', (event, data) => {
        this.folderChosen = true;
        this.folder = data[0];
      });
    },
  };
</script>

<style scoped>
  .centered
  {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo
  {
    margin-top: 5%;
    max-width: 100%;
  }

  #main-content
  {
    margin-top: 2%;
  }

  .link-btn
  {
    width: 150px;
  }
</style>
