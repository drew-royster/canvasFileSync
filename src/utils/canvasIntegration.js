/* eslint-disable */
const request = require('request-promise');
const map = require('promise-map');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');

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
    console.log(rootURL);
    console.log(authToken);
    const activeCoursesResponse = await request(options);
    console.log(activeCoursesResponse);
    const activeCourses = await Promise.resolve(activeCoursesResponse).then(map(async (element) => {
      const sync = await hasAccessToFilesAPI(authToken, rootURL, element.id);
      if (sync) {
        const { files_url, folders_url } = await getCourseFilesANDFoldersURLS(authToken, rootURL, element.id);
        return { id: element.id,
          sync: true,
          path: '',
          name: element.name.split('|')[0].trim(),
          items: [],
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
const getFolders = async (authToken, folderURL) => {
  const options = {
    method: 'GET',
    uri: `${folderURL}/?per_page=100`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  const foldersResponse = await request(options);
  return Promise.resolve(foldersResponse).then(map(async (element) => {
    return {
      name: element.name,
      folder: true,
      lastUpdated: element.updated_at,
      folders_count: element.folders_count,
      folders_url: element.folders_url,
      files_count: element.files_count,
      files_url: element.files_url,
      size: 0,
      sync: true,
      id: element.id,
      items: [],
    }
  }));
};

//Right now this will only get 100 files may want to add recursion into this as well
const getFiles = async (authToken, filesURL) => {
  const options = {
    method: 'GET',
    uri: `${filesURL}/?per_page=100`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true,
    encoding: null,
  };
  const filesResponse = await request(options);
  return Promise.resolve(filesResponse).then(map(async (element) => {
    return {
      name: element.display_name,
      url: element.url,
      folder: false,
      lastUpdated: element.updated_at,
      size: element.size,
      sync: true,
      id: element.id,
    }
  }));
};

const getData = async (authToken, course) => {
  try {
    const getAllFolders = async (authToken, folder) => {
      return new Promise(async (resolve, reject) => {
        const foldersResponse = await getFolders(authToken, folder.folders_url);
        let allFolders = await Promise.resolve(foldersResponse).then(map(async (element) => {
          if (element.folders_count > 0) {
            const folderItems = await getAllFolders(authToken, element);
            const fileItems = await getFiles(authToken, element.files_url);
            element.items = folderItems.concat(fileItems);
          }
          else {
            const fileItems = await getFiles(authToken, element.files_url);
            element.items = fileItems;
          }
          return element;
        }));
        resolve(allFolders);
      });
    };
    return getAllFolders(authToken, course);
  } catch (error) {
    console.error(error);
  }
};

const downloadCourse = async (authToken, course) => {
  try {
    await fs.mkdirSync(course.path);
    const downloadRecurseFolders = async (folder, currentPath) => {
      try {
        return folder.items.forEach( async (element) => {
          if (element.folder) {
            await fs.mkdirSync(path.join(currentPath, element.name));
            await downloadRecurseFolders(element, path.join(currentPath, element.name));
          } else {
            await request.get(element.url).then(async function(res) {
              const buffer = Buffer.from(res, "utf8");
              await fs.writeFileSync(path.join(currentPath, element.name), buffer);
            });
          }
        })
      } catch(err) {
        console.error(err);
      }
    }
    return course.items.forEach( async (element) => {
      if (element.folder) {
        // download everything in this folder and nested folders/create directories
        await fs.mkdirSync(path.join(course.path, element.name));
        await downloadRecurseFolders(element, path.join(course.path, element.name));
      } else {
        await request.get(element.url).then(async function(res) {
          const buffer = Buffer.from(res, "utf8");
          await fs.writeFileSync(path.join(course.path, element.name), buffer);
        });
      }
    })
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
  let results = await getData(authToken, course);
  const filesResponse = await getFiles(authToken, course.files_url);
  course.items = results.concat(filesResponse);
  return course;
};

export default { getActiveCanvasCourses, downloadCourse, getCourseFilesANDFoldersURLS, hasAccessToFilesAPI, getCourseItemsMap };
// module.exports = { getActiveCanvasCourses, downloadCourse, getCourseFilesANDFoldersURLS, hasAccessToFilesAPI, getCourseItemsMap };