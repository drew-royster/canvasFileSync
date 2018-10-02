import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persistfile';
import modules from './modules';
const {app} = require('electron').remote; // eslint-disable-line

const persist = new VuexPersist({
  path: app.getPath('userData'),
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  plugins: [persist.subscribe()],
});
