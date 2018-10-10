// import { dialog } from 'electron'; // eslint-disable-line
import router from '../../router/index';
const canvasIntegrationFile = require('../../../utils/canvasIntegration');
const dataStorageFile = require('../../../utils/dataStorage');
const canvasIntegration = canvasIntegrationFile.default;
const dataStorage = dataStorageFile.default;
const path = require('path');

const state = {
  authToken: null,
  rootURL: null,
  rootFolder: null,
  syncFrequency: null,
  itemsMap: [],
  matchesPersistentStorage: false,
};

const mutations = {
  SET_CONNECTION_PARAMETERS(state, payload) {
    state.authToken = payload.authToken;
    state.rootURL = payload.rootURL;
  },
  SET_DISK_MATCHES_STATE(state) {
    state.matchesPersistentStorage = true;
  },
  SET_DISK_DOES_NOT_MATCH_STATE(state) {
    state.matchesPersistentStorage = false;
  },
  SET_ROOT_FOLDER(state, payload) {
    state.rootFolder = payload;
  },
  SET_COURSE_PATHS(state) {
    state.itemsMap.forEach((course, index) => {
      state.itemsMap[index].path = path.join(state.rootFolder, course.name);
    });
  },
  SET_ROOT_URL(state, payload) {
    state.rootURL = payload;
  },
  SET_AUTH_TOKEN(state, payload) {
    state.authToken = payload;
  },
  SET_SYNC_FREQUENCY(state, payload) {
    state.syncFrequency = payload;
  },
  ADD_COURSE(state, payload) {
    state.itemsMap.push(payload);
  },
  SET_COURSE_MAP(state, payload) {
    state.itemsMap[payload.index] = payload.updatedCourse;
  },
};

const actions = {
  connect({ commit }) {
    canvasIntegration.getActiveCanvasCourses(
      state.authToken, state.rootURL).then((response) => {
      if (response.success) {
        response.response.forEach(async (courseItem) => {
          commit('ADD_COURSE', courseItem);
        });
        router.push('/configure');
      }
    });
  },
  generateFilesMap({ commit }) {
    state.itemsMap.forEach(async (course, index) => {
      if (course.sync) {
        const copyCourse = Object.assign({}, course);
        const updatedCourse = await canvasIntegration.getCourseItemsMap(state.authToken,
          copyCourse);
        commit('SET_COURSE_MAP', { index, updatedCourse });
      }
    });
  },
  saveStateToDisk({ commit }) {
    dataStorage.saveCurrentState(state);
    commit('SET_DISK_MATCHES_STATE');
  },
  beginInitialSync({ commit }, payload) {
    commit('SET_ROOT_FOLDER', payload.rootFolder);
    commit('SET_COURSE_PATHS');
    commit('SET_SYNC_FREQUENCY', payload.syncFrequency);
    router.push('./progress');
  },
  goUniversityLogin({ commit }, payload) {
    commit('SET_ROOT_URL', payload.rootURL);
    router.push(`./login/${payload.rootURL}`);
  },
};

const getters = {
  rootURL(state) {
    return state.rootURL;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
