<template>
  <v-content>
    <v-layout justify-center align-center row>
      <v-flex xs12 sm10>
        <v-layout justify-center align-center>
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
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
  import log from 'electron-log';
  export default {
    name: 'loading',
    data() {
      return {};
    },
    mounted() {
      log.info('in loading window');
    },
  };
</script>
