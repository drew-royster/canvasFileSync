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
        .then((items) => { // items = files || dirs
          // items figures as list of tasks, settled promise means task is completed
          return Promise.map(items, (item) => {
              files.push(item);
              if (item.folders_count > 0) {
                return findFolders(authToken, item, item.folderPath, files);
              } 
          }) 
        })
        .then(() => {
          // every task is completed, provide results
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

const downloadRecurseFolders = async (folder, currentPath) => {
  return new Promise(async (resolve, reject) => {
    let allFolders = await Promise.resolve(folder.items).then(map(async (element, index) => {
      try {
        if (element.folder) {
          if (element.sync) {
            //create folder if it doesn't exist
            if (!fs.existsSync(path.join(currentPath, element.name))) {
              await fs.mkdirSync(path.join(currentPath, element.name));
            }
            await downloadRecurseFolders(element, path.join(currentPath, element.name));
          }
        } else {
          if (element.sync) {
            await request.get(element.url).then(async function(res) {
              const buffer = Buffer.from(res, "utf8");
              await fs.writeFileSync(path.join(currentPath, element.name), buffer);
              element.lastUpdated = Date.now();
            }).catch((err => {
              console.error(err);
              console.error(element.url);
              folder.items.delete(index);
            }));
          }
        }
        return element;
      } catch(err) {
        console.error(err);
        console.log(element);
      }
    }));
    resolve(allFolders);
  });
};

const downloadCourse = async (course) => {
  try {
    if (!fs.existsSync(course.path)) {
      await fs.mkdirSync(course.path);
    }
    const updatedCourse = await downloadRecurseFolders(course, course.path);
    course.items = updatedCourse;
    return course;
  } catch (err) {
    console.error(err);
  }
};

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

const getCourseItemsMap = async (authToken, course) => {
  const folders = await findAllFolders(authToken, course);
  let files = await findAllFiles(authToken, folders);
  const filesResponse = await getFiles(authToken, course.files_url, course.name);
  files = files.concat(filesResponse);
  course.files = files;
  course.folders = folders;
  return course;
};

export default { getActiveCanvasCourses, downloadCourse, getCourseFilesANDFoldersURLS, hasAccessToFilesAPI, getCourseItemsMap };
// module.exports = { getActiveCanvasCourses, downloadCourse, getCourseFilesANDFoldersURLS, hasAccessToFilesAPI, getCourseItemsMap };