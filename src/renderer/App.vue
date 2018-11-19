<template>
  <div id="app">
    <v-app dark>
      <v-system-bar v-if="isOSX" window dark style="-webkit-app-region: drag">
        <v-icon
          style="-webkit-app-region: no-drag;"
          @click="close"
          @keyup.enter="close"
          @keyup.space="close"
          @mouseover="closeIconColor = 'red'"
          @mouseleave="closeIconColor = 'white'"
          :color='closeIconColor'
          tabindex="1"
          aria-label="Close Window"
        >
          close
        </v-icon>
        <v-icon
          style="-webkit-app-region: no-drag;"
          @click="minimize"
          @keyup.enter="minimize"
          @keyup.space="minimize"
          @mouseover="minimizeIconColor = 'yellow'"
          @mouseleave="minimizeIconColor = 'white'"
          :color='minimizeIconColor'
          tabindex="2"
          aria-label="Minimize Window"
        >
          remove
        </v-icon>
        <v-spacer></v-spacer>
      </v-system-bar>
      <v-system-bar v-else window dark style="-webkit-app-region: drag">
        <v-spacer></v-spacer>
        <v-icon
          style="-webkit-app-region: no-drag;"
          @click="minimize"
          @keyup.enter="minimize"
          @keyup.space="minimize"
          @mouseover="minimizeIconColor = 'yellow'"
          @mouseleave="minimizeIconColor = 'white'"
          :color='minimizeIconColor'
          tabindex="2"
          aria-label="Minimize Window"
        >
          remove
        </v-icon>
        <v-icon
          style="-webkit-app-region: no-drag;"
          @click="close"
          @keyup.enter="close"
          @keyup.space="close"
          tabindex="1"
          aria-label="Close Window"
          @mouseover="closeIconColor = 'red'"
          @mouseleave="closeIconColor = 'white'"
          :color='closeIconColor'
        >
          close
        </v-icon>
      </v-system-bar>
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
  import is from 'electron-is';
  export default {
    name: 'main-container',
    data() {
      return {
        isOSX: false,
        closeIconColor: 'white',
        minimizeIconColor: 'white',
      };
    },
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
    mounted() {
      this.isOSX = is.osx();
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
