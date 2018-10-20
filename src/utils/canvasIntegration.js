/* eslint-disable */
const request = require('request-promise');
const Promise = require('bluebird');
const map = require('promise-map');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');
const _ = require('lodash');

const getActiveCanvasCourses = async (
  authToken,
  rootURL,
) => {
  try {
    const options = {
      method: 'GET',
      uri: `http://${rootURL}/api/v1/users/self/courses?enrollment_state=active`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const activeCoursesResponse = await request(options);
    const activeCourses = await Promise.resolve(activeCoursesResponse).then(map(async (element) => {
      const sync = await hasAccessToFilesAPI(authToken, rootURL, element.id);
      if (sync) {
        const { files_url, folders_url } = await getCourseFilesANDFoldersURLS(authToken, rootURL, element.id);
        return { id: element.id,
          sync: true,
          name: element.name.split('|')[0].trim(),
          folder: true,
          files_url,
          folders_url,
        };
      } else {
        return { id: element.id,
          sync,
          path: '',
          name: element.name.split('|')[0].trim(),
          items: [],
        };
      }
    }))
    return { success: true, message: 'success', response: activeCourses };
  } catch (error) {
    log.error(error);
    if (
      error.message === '401 - {"errors":[{"message":"Invalid access token."}]}'
    ) {
      return { success: false, message: 'Invalid Developer Key' };
    }
    return { success: false, message: error.message };
  }
};

const hasAccessToFilesAPI = async (authToken, rootURL, courseID) => {
  const options = {
    method: 'GET',
    uri: `http://${rootURL}/api/v1/courses/${courseID}/files?sort=updated_at&order=desc`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  try {
    await request(options);
    return true;
  } catch (err) {
    if (err === 'StatusCodeError: 401 - {"status":"unauthorized","errors":[{"message":"user not authorized to perform that action"}]}') {
      return false;
    } log.error(err);
  }
  return false;
};


//Right now this will only get 100 folders may want to add recursion into this as well
const getFolders = async (authToken, folderURL, currentPath) => {
  const options = {
    method: 'GET',
    uri: `${folderURL}/?per_page=100`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  const foldersResponse = await request(options);
  return Promise.resolve(foldersResponse).then(map(async (element) => {
    const folderPath = path.join(currentPath, element.name);
    return {
      name: element.name,
      lastUpdated: element.updated_at,
      folder: true,
      folders_count: element.folders_count,
      folders_url: element.folders_url,
      files_count: element.files_count,
      files_url: element.files_url,
      sync: true,
      id: element.id,
      folderPath,
    }
  }));
};

//Right now this will only get 100 files may want to add recursion into this as well
const getFiles = async (authToken, filesURL, currentPath) => {
  const options = {
    method: 'GET',
    uri: `${filesURL}/?per_page=100`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  const filesResponse = await request(options);
  return Promise.resolve(filesResponse).then(map(async (element) => {
    const filePath = path.join(currentPath, element.display_name);

    return {
      name: element.display_name,
      url: element.url,
      folder: false,
      lastUpdated: null,
      size: element.size,
      sync: true,
      id: element.id,
      filePath,
    }
  }));
};

const findAllFolders = async (authToken, course) => {
  try {
    const findFolders = (authToken, folder, currentPath, files = []) => {
      return getFolders(authToken, folder.folders_url, currentPath)
        .then((items) => {
          return Promise.map(items, (item) => {
              files.push(item);
              if (item.folders_count > 0) {
                return findFolders(authToken, item, item.folderPath, files);
              } 
          }) 
        })
        .then(() => {
          return files
        })
    }
    return findFolders(authToken, course, course.name);
  } catch (error) {
    console.error(error);
  }
};

const findAllFiles = async (authToken, folders) => {
  try {
    let files = [];
    await Promise.map(folders, async (folder) => {
      const folderFiles = await getFiles(authToken, folder.files_url, folder.folderPath);
      files = files.concat(folderFiles);
    })
    return files;
  } catch (error) {
    console.error(error);
  }
}

const getCourseFilesANDFoldersURLS = async (authToken, rootURL, courseID) => {
  try {
    const options = {
      method: 'GET',
      uri: `http://${rootURL}/api/v1/courses/${courseID}/folders/root`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const rootFolderResponse = await request(options);
    return { files_url: rootFolderResponse.files_url, folders_url: rootFolderResponse.folders_url };
  } catch (err) {
    console.error(err);
    return { error: 'Problem getting course files folder' };
  }
};

const getCourseFilesAndFolders = async (authToken, course) => {
  const folders = await findAllFolders(authToken, course);
  let files = await findAllFiles(authToken, folders);
  const filesResponse = await getFiles(authToken, course.files_url, course.name);
  files = files.concat(filesResponse);
  course.files = files;
  course.folders = folders;
  return course;
};

const hasNewFolder = async (authToken, rootURL, courseID, lastSynced) => {
  try {
    const options = {
      method: 'GET',
      uri: `http://${rootURL}/api/v1/courses/${courseID}/folders?sort=updated_at&order=desc`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const foldersLastUpdated = await request(options);
    if (new Date(foldersLastUpdated[0].updated_at) > new Date(lastSynced)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default { getActiveCanvasCourses, getCourseFilesANDFoldersURLS, hasAccessToFilesAPI, getCourseFilesAndFolders, hasNewFolder, findAllFolders, findAllFiles };
// module.exports = { getActiveCanvasCourses, downloadCourse, getCourseFilesANDFoldersURLS, hasAccessToFilesAPI, getCourseFilesAndFolders, hasNewFolder };