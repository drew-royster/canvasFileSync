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
          <v-stepper-step editable :complete="step > 1" step="1">What will sync?</v-stepper-step>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card v-if="step == 1">
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
                        <v-btn
                          v-if="course.sync"
                          icon
                          @click="toggleSync(course.id)"
                          :aria-label="`Disable ${course.name}`"
                        >
                          <v-icon v-if="course.sync" color="green">class</v-icon>
                        </v-btn>
                        <v-btn
                          v-else
                          icon
                          @click="toggleSync(course.id)"
                          :aria-label="`Enable ${course.name}`"
                        >
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
                v-if="step == 1"
                color="primary"
                @click="step = 2"
              >
                Continue
              </v-btn>
              <v-btn
                v-else
                disabled
                color="primary"
                @click="step = 2"
              >
                Continue
              </v-btn>
            </v-stepper-content>
      
            <v-stepper-step editable :complete="step > 2" step="2">Where to sync it?</v-stepper-step>
            <v-stepper-content step="2">
              <v-layout row>
                <v-flex mb-2 large>
                  <v-btn v-if="step == 2" large @click="chooseFolder">{{ folder }}</v-btn>
                </v-flex>
              </v-layout>

              <v-btn
                v-if="folderChosen && step == 2"
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
            
            <v-stepper-step editable step="3">How often?</v-stepper-step>
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
                      v-if="step == 3"
                      v-model="syncFrequency"
                      :rules="[() => parseInt(syncFrequency) > 0 || 'Must be greater than zero']"
                      aria-label="How often to check for new files and folders"
                      ref="syncFrequency"
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
                v-if="step == 3"
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
  const log = require('electron-log');
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
      toggleSync(courseID) {
        log.info(courseID);
        this.$store.dispatch('toggleSyncCourse', { courseID });
      },
      chooseFolder() {
        this.$electron.ipcRenderer.send('choose-folder');
      },
      beginSync() {
        if (this.folderChosen && this.$refs.syncFrequency.validate(true)) {
          this.$store.dispatch('beginInitialSync', { rootFolder: this.folder, syncFrequency: this.syncFrequency });
        }
      },
    },
    mounted() {
      this.$electron.ipcRenderer.on('chose-folder', (event, data) => {
        if (data !== 'No folder chosen') {
          this.folderChosen = true;
          this.folder = data[0];
        }
      });
    },
  };
</script>
