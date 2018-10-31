/* eslint-disable */
const request = require('request-promise');
const Promise = require('bluebird');
const map = require('promise-map');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');
const _ = require('lodash');
const filenamify = require('filenamify');

const getActiveCanvasCourses = async (
  authToken,
  rootURL,
) => {
  try {
    const options = {
      method: 'GET',
      uri: `https://${rootURL}/api/v1/users/self/courses?enrollment_state=active`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const activeCoursesResponse = await request(options);
    console.log(activeCourses);
    const activeCourses = await Promise.resolve(activeCoursesResponse).then(map(async (element) => {
      const sync = await hasAccessToFilesAPI(authToken, rootURL, element.id);
      if (sync) {
        const { files_url, folders_url } = await getCourseFilesANDFoldersURLS(authToken, rootURL, element.id);
        return { id: element.id,
          sync: true,
          name: filenamify(element.name.split('|')[0].trim(), { replacement: '-'}),
          folder: true,
          files_url,
          folders_url,
        };
      } else {
        return { id: element.id,
          sync,
          path: '',
          name: filenamify(element.name.split('|')[0].trim(), { replacement: '-'}),
          items: [],
        };
      }
    }))
    return { success: true, message: 'success', response: activeCourses };
  } catch (error) {
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
    uri: `https://${rootURL}/api/v1/courses/${courseID}/files?sort=updated_at&order=desc`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  try {
    await request(options);
    return true;
  } catch (err) {
      return false;
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

//Right now this will only get 200 files may want to add recursion into this as well
const getFiles = async (authToken, filesURL, currentPath) => {
  const options = {
    method: 'GET',
    uri: `${filesURL}/?per_page=200`,
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

//Right now this will only get 200 files may want to add recursion into this as well
const getNewOrUpdatedFiles = async (authToken, filesURL, currentPath, lastSynced) => {
  try {
    const options = {
      method: 'GET',
      uri: `${filesURL}/?per_page=200`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const filesResponse = await request(options);
    const newFiles = _.filter(filesResponse, (file) => {
      if (new Date(file.updated_at) > new Date(lastSynced)) {
        return file;
      }
    });
    return Promise.resolve(newFiles).then(map(async (element) => {
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
  } catch (err) {
    console.error(err);
    console.log('Problem getting new or updated files');
    return [];
  }
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

const getAllNewOrUpdatedFiles = async (authToken, course, lastSynced) => {
  try {
    let files = [];
    const rootFolderFiles = await getNewOrUpdatedFiles(authToken, course.files_url, course.name, lastSynced);
    files = files.concat(rootFolderFiles);
    await Promise.map(course.folders, async (folder) => {
      const folderFiles = await getNewOrUpdatedFiles(authToken, folder.files_url, folder.folderPath, lastSynced);
      files = files.concat(folderFiles);
    })
    return files;
  } catch (error) {
    console.log('problem getting new files');
    // console.error(error);
  }
}

const getCourseFilesANDFoldersURLS = async (authToken, rootURL, courseID) => {
  try {
    const options = {
      method: 'GET',
      uri: `https://${rootURL}/api/v1/courses/${courseID}/folders/root`,
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

const getNewFolders = async (authToken, rootURL, course, lastSynced) => {
  const newFolders = [];
  try {
    const options = {
      method: 'GET',
      uri: `https://${rootURL}/api/v1/courses/${course.id}/folders?sort=updated_at&order=desc&per_page=200`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const foldersLastUpdated = await request(options);
    // theoretically this works, but it is not yet tested all the way through

    _.forEach(foldersLastUpdated, (folderRaw) => {
      if (folderRaw.full_name !== 'course files') {
        const parseFullName = folderRaw.full_name.replace('course files','');
        const folderPath = path.join(course.name, parseFullName);
        const folder = {
          name: folderRaw.name,
          lastUpdated: folderRaw.updated_at,
          folder: true,
          folders_count: folderRaw.folders_count,
          folders_url: folderRaw.folders_url,
          files_count: folderRaw.files_count,
          files_url: folderRaw.files_url,
          sync: true,
          id: folderRaw.id,
          folderPath,
        }
        if (new Date(folder.lastUpdated) > new Date(lastSynced)) {
          newFolders.push(folder);
        }
      }
    });
    return newFolders;
  } catch (err) {
    console.error(err);
    return newFolders;
  }
};

const hasNewFile = async (authToken, rootURL, courseID, lastSynced) => {
  try {
    const options = {
      method: 'GET',
      uri: `https://${rootURL}/api/v1/courses/${courseID}/files?sort=updated_at&order=desc`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const filesLastUpdated = await request(options);
    // console.log(filesLastUpdated[0].updated_at);
    // console.log(new Date(lastSynced));
    // theoretically this works, but it is not yet tested all the way through
    if (new Date(filesLastUpdated[0].updated_at) > new Date(lastSynced)) {
      // console.log('new file');
      return true;
    } else {
      // console.log('no new files');
      return false;
    }
  } catch (err) {
    console.log(`Error checking if ${courseID} has new files`);
    return false;
  }
};

export default {
  getActiveCanvasCourses,
  getCourseFilesANDFoldersURLS,
  hasAccessToFilesAPI,
  getCourseFilesAndFolders,
  getNewFolders,
  hasNewFile,
  findAllFolders,
  findAllFiles,
  getAllNewOrUpdatedFiles,
};
// module.exports = { getActiveCanvasCourses, downloadCourse, getCourseFilesANDFoldersURLS, hasAccessToFilesAPI, getCourseFilesAndFolders, getNewFolders };