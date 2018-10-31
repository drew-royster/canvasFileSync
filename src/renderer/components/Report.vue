<template>
  <v-content>
    <v-alert
      :value="showAlert"
      color="warning"
      icon="priority_high"
      outline
      dismissible
    >
      Whoops we were unable to get some files. Don't worry! We'll take care of it behind the scenes
    </v-alert>
    <v-layout mt-5 justify-center align-center row>
      <v-flex xs12 sm6 text-xs-center>
        <v-layout justify-center align-center row mb-3>
          <h1 display-4 text-xs-center>Download Report</h1>
        </v-layout>
        <v-card>
          <v-layout row mb-3></v-layout>
          <v-layout mb-3 justify-center align-center row>
            <h1>Successes</h1>
            <v-badge color="green">
              <span slot="badge">{{ successes }}</span>
              <v-icon
                large
                color="grey"
              >
                attach_file
              </v-icon>
            </v-badge>
          </v-layout>
          <v-layout justify-center align-center row>
            <h1>Failures</h1> 
            <v-badge color="red">
              <span slot="badge">{{ failures }}</span>
              <v-icon
                large
                color="grey"
              >
                attach_file
              </v-icon>
            </v-badge>
          </v-layout>
          <v-layout justify-center align-center row>
            <p caption>Feel free to close this page</p>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>

export default {
  name: 'Report',
  props: ['successes', 'failures'],
  computed: {
    showAlert() {
      if (parseInt(this.failures, 10) > 0) {
        return true;
      }
      return false;
    },
  },
};
</script>
