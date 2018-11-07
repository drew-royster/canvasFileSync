/* eslint-disable */
const log = require('electron-log');
const Store = require('electron-store');
const store = new Store();
const _ = require('lodash');

const saveCurrentState = async (state) => {
  try {
    Object.entries(state).forEach(([key, value]) => store.set(key, value));
    return true;
  } catch (err) {
    log.error(err);
    return false;
  }
};

const getSavedState = async () => {
  try {
    const state = {};
    for (let [key, value] of store) {
      if (key !== 'version') {
        state[key] = value;
      }
    }
    return state;
  } catch (err) {
    log.error(err);
    return { error: 'Problem getting saved state from disk' };
  }
};

const wipeState = async () => {
  try {
    for (let item of store) {
      store.delete(item[0]);
    }
  } catch (err) {
    log.error(err);
    return { error: 'Problem getting saved state from disk' };
  }
};

const isConnected = async () => {
  try {
    if (
      store.get('rootFolder') !== undefined &&
      store.get('rootURL') !== undefined &&
      store.get('authToken') !== undefined
    ) {
      return true;
    }
    return false;
  } catch (err) {
    log.error(err);
  }
  return false;
};

const getLastSynced = async () => {
  return store.get('lastSynced');
};

const updateLastSynced = async () => {
  return store.set('lastSynced', Date.now());
};

const updateCourses = async (updatedCourses) => {
  return store.set('courses', updatedCourses);
};

const updateSyncFrequency = async ( frequencyObject ) => {
  return store.set('syncFrequency', parseInt(frequencyObject.newFrequency));
};

const getCourses = async () => {
  return store.get('courses');
};

const getSyncableCourses = async () => {
  return Promise.all(_.filter(store.get('courses'), course => course.sync));
};

const getAuthToken = async () => {
  return store.get('authToken');
};

const getRootURL = async () => {
  return store.get('rootURL');
};

const getRootFolder = async () => {
  return store.get('rootFolder');
};

const getSyncFrequency = async () => {
  return store.get('syncFrequency');
};

export default {
  isConnected,
  saveCurrentState,
  getSavedState,
  wipeState,
  getCourses,
  getSyncableCourses,
  getLastSynced,
  getAuthToken,
  getRootURL,
  getRootFolder,
  updateCourses,
  updateLastSynced,
  getSyncFrequency,
  updateSyncFrequency,
};
