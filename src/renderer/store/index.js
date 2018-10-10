import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
const {app} = require('electron').remote; // eslint-disable-line

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
});
