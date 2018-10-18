// import { dialog } from 'electron'; // eslint-disable-line
import router from '../../router/index';
const canvasIntegrationFile = require('../../../utils/canvasIntegration');
const dataStorageFile = require('../../../utils/dataStorage');
const canvasIntegration = canvasIntegrationFile.default;
const dataStorage = dataStorageFile.default;
const _ = require('lodash');

const state = {
  authToken: null,
  rootURL: null,
  rootFolder: null,
  syncFrequency: null,
  itemsMap: [],
  matchesPersistentStorage: false,
  generatedItemsMap: false,
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
  ADDED_ALL_COURSES(state) {
    state.generatedItemsMap = true;
  },
};

const actions = {
  connect({ commit }) {
    canvasIntegration.getActiveCanvasCourses(
      state.authToken, state.rootURL).then((response) => {
      let coursesAdded = 0;
      if (response.success) {
        response.response.forEach(async (courseItem) => {
          if (courseItem.sync) {
            const course = await canvasIntegration.getCourseItemsMap(state.authToken, courseItem);
            commit('ADD_COURSE', course);
          } else {
            commit('ADD_COURSE', courseItem);
          }
          coursesAdded += 1;
          if (coursesAdded === response.response.length) {
            console.log('this executed');
            commit('ADDED_ALL_COURSES');
          }
        });
        router.push('/configure');
      }
    });
  },
  // generateFilesMap({ commit }) {
  //   state.itemsMap.forEach(async (course) => {
  //     if (course.sync) {
  //       const copyCourse = Object.assign({}, course);
  //       const updatedCourse = await canvasIntegration.getCourseItemsMap(state.authToken,
  //         copyCourse);
  //       commit('SET_COURSE_MAP', updatedCourse);
  //     }
  //   });
  // },
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
  generatedItemsMap(state) {
    return state.generatedItemsMap;
  },
  rootFolder(state) {
    return state.rootFolder;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
