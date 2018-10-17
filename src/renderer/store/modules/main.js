// import { dialog } from 'electron'; // eslint-disable-line
import router from '../../router/index';
const canvasIntegrationFile = require('../../../utils/canvasIntegration');
const dataStorageFile = require('../../../utils/dataStorage');
const canvasIntegration = canvasIntegrationFile.default;
const dataStorage = dataStorageFile.default;
const path = require('path');
const _ = require('lodash');

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
  SET_COURSE_PATH(state, payload) {
    const index = _.findIndex(state.itemsMap, { id: payload.id });
    state.itemsMap[index].path = payload.path;
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
    const index = _.findIndex(state.itemsMap, { id: payload.id });
    state.itemsMap[index] = payload;
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
    state.itemsMap.forEach(async (course) => {
      if (course.sync) {
        const copyCourse = Object.assign({}, course);
        const updatedCourse = await canvasIntegration.getCourseItemsMap(state.authToken,
          copyCourse);
        console.log(updatedCourse);
        commit('SET_COURSE_MAP', updatedCourse);
      }
    });
  },
  downloadCourse({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const newCourse = await canvasIntegration.downloadCourse(payload);
        commit('SET_COURSE_MAP', newCourse);
        resolve(`Downloaded ${payload.name}`);
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  },
  saveStateToDisk({ commit }) {
    return new Promise(async (resolve, reject) => {
      const savedSuccessfully = dataStorage.saveCurrentState(state);
      if (savedSuccessfully) {
        commit('SET_DISK_MATCHES_STATE');
        resolve(savedSuccessfully);
      } else {
        reject('Error saving currest state');
      }
    });
  },
  beginInitialSync({ commit }, payload) {
    commit('SET_ROOT_FOLDER', payload.rootFolder);
    state.itemsMap.forEach((course) => {
      console.log(course.name);
      commit('SET_COURSE_PATH', { id: course.id, path: path.join(state.rootFolder, course.name) });
    });
    commit('SET_SYNC_FREQUENCY', payload.syncFrequency);
    router.push('./download');
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
  itemsMap(state) {
    return state.itemsMap;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
