/* eslint-disable */
const Store = require('electron-store');
const store = new Store();
const _ = require('lodash');

const saveCurrentState = async (state) => {
  try {
    Object.entries(state).forEach(([key, value]) => store.set(key, value));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getSavedState = async () => {
  try {
    const state = {};
    for (let [key, value] of store) {
      state[key] = value;
    }
    console.log(state);
    return state;
  } catch (err) {
    console.error(err);
    return { error: 'Problem getting saved state from disk' };
  }
};

const isConnected = async () => {
  console.log(store.get('rootFolder'));
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
    console.error(err);
  }
  return false;
};

const getLastSynced = async () => {
  return store.get('lastSynced');
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

export default {
  isConnected,
  saveCurrentState,
  getSavedState,
  getCourses,
  getSyncableCourses,
  getLastSynced,
  getAuthToken,
  getRootURL,
  getRootFolder,
};
