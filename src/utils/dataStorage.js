const Store = require('electron-store');
const store = new Store();

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
    state.authToken = store.get('authToken');
    state.rootURL = store.get('rootURL');
    state.rootFolder = store.get('rootFolder');
    state.syncFrequency = store.get('syncFrequency');
    state.itemsMap = store.get('itemsMap');
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

export default { isConnected, saveCurrentState, getSavedState, getLastSynced };
