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

// Eventually we need renderer to be able to pull state from store
// const getSavedState = async (emptyState) => {
//   try {
//     const state = {};
//     Object.entries(emptyState).forEach(([key, value]) => state = store.get(value));
//     state.authToken = store.get('authToken');
//     state.rootURL = store.get('rootURL');
//     state.rootFolder = store.get('rootFolder');
//     state.syncFrequency = store.get('syncFrequency');
//     state.itemsMap = store.get('itemsMap');
//     return state;
//   } catch (err) {
//     console.error(err);
//     return { error: 'Problem getting saved state from disk' };
//   }
// };

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
  getCourses,
  getSyncableCourses,
  getLastSynced,
  getAuthToken,
  getRootURL,
  getRootFolder,
};
