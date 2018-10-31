<template>
  <v-content>
    <v-layout mt-5 justify-center align-center row>
      <v-flex xs12 sm10>
        <v-layout v-if="!gotAllCourses" justify-center align-center>
          <v-progress-circular
            :size="400"
            :width="30"
            indeterminate
            color="#F79520"
          >
            <h1>
              Getting courses from Canvas
            </h1>
          </v-progress-circular>  
        </v-layout>
        <v-stepper v-else v-model="step" vertical>        
          <v-stepper-step :complete="step > 1" step="1">What will sync?</v-stepper-step>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card >
                <v-layout row>
                  <v-flex>
                    <v-toolbar primary dark>
                    <v-toolbar-title>Courses</v-toolbar-title>
                    </v-toolbar>
                    <v-list>
                      <v-list-tile
                      v-for="course in courses"
                      :key="course.id"
                      >
                      <v-list-tile-action>
                        <v-btn v-if="course.sync" icon ripple>
                          <v-icon color="green">class</v-icon>
                        </v-btn>
                        <v-btn v-else icon ripple>
                          <v-icon color="red">class</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                      <v-list-tile-content>
                      <v-list-tile-title v-if="course.sync">
                        {{ course.name }}
                      </v-list-tile-title>
                      <v-list-tile-title v-else>
                        {{ course.name }} - <v-tooltip bottom>
                          <span slot="activator"><i>Disabled</i></span>
                          <span>Courses using modules not currently syncable</span>
                        </v-tooltip>
                      </v-list-tile-title>
                      </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-btn
                color="primary"
                @click="step = 2"
              >
                Continue
              </v-btn>
            </v-stepper-content>
      
            <v-stepper-step :complete="step > 2" step="2">Where to sync it?</v-stepper-step>
            <v-stepper-content step="2">
              <v-layout row>
                <v-flex mb-2 large>
                  <v-btn large @click="chooseFolder">{{ folder }}</v-btn>
                </v-flex>
              </v-layout>

              <v-btn
                v-if="folderChosen"
                color="primary"
                @click="step = 3"
              >
                Continue
              </v-btn>
              <v-btn
                v-else
                color="primary"
                @click="step = 3"
                disabled
              >
                Continue
              </v-btn>
            </v-stepper-content>
            
            <v-stepper-step step="3">How often?</v-stepper-step>
            <v-stepper-content step="3">
              <v-layout column pl-2>
                <v-layout row>
                  <v-flex>
                    <h1>Sync every</h1>
                  </v-flex>
                </v-layout>
                <v-layout align-baseline row>
                  <v-flex xs1>
                    <v-text-field
                      v-model="syncFrequency"
                      class="mt-0 headline"
                      type="number"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-baseline row>
                  <v-flex>
                    <h1>minutes</h1>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-btn
                color="primary"
                @click="beginSync"
              >
                Continue
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
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
    computed: {
      courses() {
        return this.$store.getters.courses;
      },
      gotAllCourses() {
        return this.$store.getters.gotAllCourses;
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
      this.$electron.ipcRenderer.on('chose-folder', (event, data) => {
        this.folderChosen = true;
        this.folder = data[0];
      });
    },
  };
</script>
