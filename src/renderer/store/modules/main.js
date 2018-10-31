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
  courses: [],
  gotAllCourses: false,
  lastSynced: null,
  error: null,
};

const mutations = {
  SET_ERROR(state, payload) {
    state.error = payload.message;
  },
  LOAD_PROPERTY(state, payload) {
    state[payload.key] = payload.value;
  },
  SET_CONNECTION_PARAMETERS(state, payload) {
    state.authToken = payload.authToken;
    state.rootURL = payload.rootURL;
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
    state.courses.push(payload);
  },
  SET_COURSE_MAP(state, payload) {
    const index = _.findIndex(state.courses, { id: payload.id });
    state.courses[index] = payload;
  },
  DOWNLOADED_FILE(state, payload) {
    const courseIndex = _.findIndex(state.courses, { id: payload.courseID });
    const fileIndex = _.findIndex(state.courses[courseIndex].files,
      { filePath: payload.filePath });
    state.courses[courseIndex].files[fileIndex].lastUpdated = Date.now();
  },
  ADDED_ALL_COURSES(state) {
    state.gotAllCourses = true;
  },
  SYNCED(state) {
    state.lastSynced = Date.now();
  },
};

const actions = {
  connect({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        canvasIntegration.getActiveCanvasCourses(
          state.authToken, state.rootURL).then((response) => {
          let coursesAdded = 0;
          if (response.success) {
            if (response.response.length === 0) {
              commit('ADDED_ALL_COURSES');
              resolve();
            } else {
              response.response.forEach(async (courseItem) => {
                if (courseItem.sync) {
                  const course = await canvasIntegration.getCourseFilesAndFolders(
                    state.authToken, courseItem);
                  commit('ADD_COURSE', course);
                } else {
                  commit('ADD_COURSE', courseItem);
                }
                coursesAdded += 1;
                if (coursesAdded === response.response.length) {
                  commit('ADDED_ALL_COURSES');
                  resolve();
                }
              });
            }
          }
        });
      } catch (err) {
        reject('Problem getting courses');
      }
    });
  },
  downloadedFile({ commit }, payload) {
    commit('DOWNLOADED_FILE', payload);
  },
  beginInitialSync({ commit }, payload) {
    commit('SET_ROOT_FOLDER', payload.rootFolder);
    commit('SET_SYNC_FREQUENCY', payload.syncFrequency);
    router.push('./download');
  },
  loadSavedState({ commit }) {
    return new Promise(async (resolve) => {
      const savedState = await dataStorage.getSavedState();
      Object.entries(savedState).forEach(([key, value]) => {
        commit('LOAD_PROPERTY', { key, value });
      });
      resolve();
    });
  },
  completedInitialSync({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      commit('SYNCED');
      const savedSuccessfully = dataStorage.saveCurrentState(state);
      if (savedSuccessfully) {
        router.push(`./report/${payload.successes}/${payload.failures}`);
        resolve(savedSuccessfully);
      } else {
        reject('Error saving currest state');
      }
    });
  },
  goUniversityLogin({ commit }, payload) {
    commit('SET_ROOT_URL', payload.rootURL);
    router.push(`./login/${payload.rootURL}`);
  },
  isConnected() {
    return new Promise(async (resolve, reject) => {
      if (await dataStorage.isConnected()) {
        resolve();
      } else {
        reject();
      }
    });
  },
  clearStateGoLogin({ commit }) {
    const loadState = new Promise(async (resolve) => {
      const savedState = await dataStorage.getSavedState();
      Object.entries(savedState).forEach(([key, value]) => {
        commit('LOAD_PROPERTY', { key, value });
      });
      resolve();
    });
    return loadState.then(() => {
      router.push('/');
    });
  },
  goErrorPage({ commit }, payload) {
    commit('SET_ERROR', payload);
    router.push('/error');
  },
};

const getters = {
  authToken(state) {
    return state.authToken;
  },
  rootURL(state) {
    return state.rootURL;
  },
  courses(state) {
    return state.courses;
  },
  syncableCourses(state) {
    return Promise.all(_.filter(state.courses, course => course.sync));
  },
  gotAllCourses(state) {
    return state.gotAllCourses;
  },
  rootFolder(state) {
    return state.rootFolder;
  },
  syncFrequency(state) {
    return state.syncFrequency;
  },
  error(state) {
    return state.error;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
