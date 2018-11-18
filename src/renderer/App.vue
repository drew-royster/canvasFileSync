<template>
  <div id="app">
    <v-app dark>
      <v-layout row>

        <v-toolbar height="30px" fixed style="-webkit-app-region: drag">
          <v-icon
            style="-webkit-app-region: no-drag;"
            small
            @click="close"
            @keyup.enter="close"
            @keyup.space="close"
            color="red"
            tabindex="1"
            aria-label="Close Window"
          >
          close
          </v-icon>
          <v-icon
            style="-webkit-app-region: no-drag;"
            small
            @click="minimize"
            @keyup.enter="minimize"
            @keyup.space="minimize"
            medium
            color="yellow"
            tabindex="2"
            aria-label="Close Window"
          >
          minimize
          </v-icon>
        </v-toolbar>
      </v-layout>
      <v-layout mt-3 row>
        <v-flex sm12>
          <v-alert
            v-for="alert in alerts"
            :key="alert.text"
            :value="alert.value"
            :type="alert.type"
            dismissible
          >
            {{ alert.text }}
          </v-alert>
        </v-flex>
      </v-layout>
      <v-container fluid>
        <v-content>
          <router-view></router-view>
        </v-content>
      </v-container>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'vue-canvas',
    computed: {
      alerts() {
        return this.$store.getters.alerts;
      },
    },
    methods: {
      close() {
        this.$electron.remote.getCurrentWindow().close();
      },
      minimize() {
        this.$electron.remote.getCurrentWindow().minimize();
      },
    },
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  body {
    overflow-x: hidden;
    overflow-y: hidden;
  }
  /* Global CSS */
</style>
