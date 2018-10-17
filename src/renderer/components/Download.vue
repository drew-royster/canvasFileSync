<template>
  <v-content>
    <v-layout id="main-content" row>
      <v-flex xs2></v-flex>
      <v-flex xs8>
        <v-card
          class="mb-5"
        >
        <v-layout align-baseline row>
          <v-flex text-xs-center>
            <h1>Downloading Files</h1>
          </v-flex>
        </v-layout>
        <v-layout ma-3 align-baseline row>
          <v-flex text-xs-center>
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
        </v-card>
      </v-flex>
      <v-flex xs2></v-flex>
    </v-layout>
  </v-content>
</template>

<script>
  export default {
    name: 'download',
    data() {
      return {
        progressMessage: 'Downloading Now',
        progress: 0,
        numSyncableCourses: 0,
        numSynced: 0,
        tips: [
          'Need updates NOW? Click on the CFS icon in system tray and then "Sync Now"',
          'CFS will overwrite any changes you make to files in the sync folder. Copy them somwhere else if you need to edit them.',
          'Suggestions? Issues with the app? Tweet or DM @canvasfilesync',
        ],
      };
    },
    mounted() {
      const itemsMap = this.$store.getters.itemsMap;
      const itemsMapCopy = JSON.parse(JSON.stringify(itemsMap));
      itemsMapCopy.forEach(async (course) => {
        if (course.sync) {
          this.numSyncableCourses = this.numSyncableCourses + 1;
        }
      });
      itemsMapCopy.forEach(async (course) => {
        if (course.sync) {
          this.progressMessage = await this.$store.dispatch('downloadCourse', course);
          this.numSynced = this.numSynced + 1;
          this.progress = (this.numSynced / this.numSyncableCourses) * 100;
        }
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
