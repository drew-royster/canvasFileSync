const log = require('electron-log');
const request = require('request-promise');

const listActiveCanvasCourses = (
  authToken,
  rootURL,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: 'GET',
        uri: `https://${rootURL}/api/v1/users/self/courses?enrollment_state=active`,
        headers: { Authorization: `Bearer ${authToken}` },
        json: true,
        encoding: null,
      };
      resolve(request(options));
    } catch (err) {
      log.error(err);
      reject(err);
    }
  });
};

const listModules = async (authToken, rootURL, course) => {
  const options = {
    method: 'GET',
    uri: `https://${rootURL}/api/v1/courses/${course.id}/modules?per_page=100`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  return request.get(options);
};

const listModuleItems = async (authToken, courseModule) => {
  const options = {
    method: 'GET',
    uri: courseModule.items_url,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  return request.get(options);
};

const list200Items = async (authToken, itemsURL) => {
  const options = {
    method: 'GET',
    uri: `${itemsURL}/?per_page=200`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  return request(options);
};

const getModuleFileDetails = async (authToken, fileModuleURL) => {
  const options = {
    method: 'GET',
    uri: fileModuleURL,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  return request.get(options);
};

const getCourseRootFolder = async (authToken, rootURL, courseID) => {
  const options = {
    method: 'GET',
    uri: `https://${rootURL}/api/v1/courses/${courseID}/folders/root`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  return request.get(options);
};

const listFoldersByUpdatedAt = async (authToken, rootURL, courseID) => {
  const options = {
    method: 'GET',
    uri: `https://${rootURL}/api/v1/courses/${courseID}/folders?sort=updated_at&order=desc&per_page=200`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  return request.get(options);
};

const listFilesByUpdatedAt = async (authToken, filesURL) => {
  const options = {
    method: 'GET',
    uri: `${filesURL}/?per_page=200&sort=updated_at&order=desc`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  return request.get(options);
};

export default {
  listActiveCanvasCourses,
  listModules,
  listModuleItems,
  getModuleFileDetails,
  list200Items,
  getCourseRootFolder,
  listFoldersByUpdatedAt,
  listFilesByUpdatedAt,
};
