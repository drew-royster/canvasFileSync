<template>
  <div id="app">
    <v-app dark>
      <div>

        <v-layout row>
          <v-flex>
            <v-system-bar v-if="isOSX" window dark style="-webkit-app-region: drag">
              <div aria-label="Close Window">
                <v-icon
                  style="-webkit-app-region: no-drag;"
                  @click="close"
                  @keyup.enter="close"
                  @keyup.space="close"
                  @mouseover="closeIconColor = 'red'"
                  @mouseleave="closeIconColor = 'white'"
                  :color='closeIconColor'
                  tabindex="1"
                >
                  close
                </v-icon>
              </div>
              <div aria-label="Minimize Window">
                <v-icon
                  style="-webkit-app-region: no-drag;"
                  @click="minimize"
                  @keyup.enter="minimize"
                  @keyup.space="minimize"
                  @mouseover="minimizeIconColor = 'yellow'"
                  @mouseleave="minimizeIconColor = 'white'"
                  :color='minimizeIconColor'
                  tabindex="2"
                >
                  remove
                </v-icon>
              </div>
              <v-spacer></v-spacer>
            </v-system-bar>
            <v-system-bar v-else window dark style="-webkit-app-region: drag">
              <v-spacer></v-spacer>
              <div aria-label="Minimize Window">
                <v-icon
                  style="-webkit-app-region: no-drag;"
                  @click="minimize"
                  @keyup.enter="minimize"
                  @keyup.space="minimize"
                  @mouseover="minimizeIconColor = 'yellow'"
                  @mouseleave="minimizeIconColor = 'white'"
                  :color='minimizeIconColor'
                  tabindex="2"
                >
                  remove
                </v-icon>
              </div>
              <div aria-label="Close Window">
                <v-icon
                  style="-webkit-app-region: no-drag;"
                  @click="close"
                  @keyup.enter="close"
                  @keyup.space="close"
                  tabindex="1"
                  @mouseover="closeIconColor = 'red'"
                  @mouseleave="closeIconColor = 'white'"
                  :color='closeIconColor'
                >
                  close
                </v-icon>
              </div>
            </v-system-bar>
          </v-flex>
        </v-layout>
        <!-- <v-layout mt-3 row>
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
        </v-layout> -->
        <v-layout row>
          <v-flex xs12 sm12>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </div>
    </v-app>
  </div>
</template>

<script>
  import is from 'electron-is';
  const dataStorageFile = require('../utils/dataStorage');
  const dataStorage = dataStorageFile.default;

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
        if (dataStorage.isConnected()) {
          this.$store.dispatch('saveState');
        }
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
