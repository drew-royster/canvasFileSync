/* eslint-disable */
const request = require('request-promise');
const Promise = require('bluebird');
const path = require('path');
const _ = require('lodash');
const log = require('electron-log');
const filenamify = require('filenamify');
import apis from './apis';

const hasItem = async (collection, item) => {
  const foundItem = _.find(collection, item);
  if (foundItem) {
    return true;
  }
  return false;
};

const getCourses = async (
  authToken,
  rootURL,
) => {
  try {
    const activeCoursesResponse = await apis.listActiveCanvasCourses(authToken, rootURL);
    const activeCourses = await Promise.all(_.map(activeCoursesResponse, async (activeCourse) => {
      const tabs = await apis.listCourseTabs(authToken, rootURL, activeCourse.id);
      const hasModulesTab = await hasItem(tabs, { id: 'modules'});
      const hasFilesTab = await hasItem(tabs, { id: 'files'});
        return { id: activeCourse.id,
          hasModulesTab,
          hasFilesTab,
          sync: true,
          name: filenamify(activeCourse.name.split('|')[0].trim(), { replacement: '-'}),
          modules: [],
          folder: true,
          files: [],
          folders: [],
          files_url: null,
          folders_url: null,
        };
    }));
    return { success: true, message: 'success', response: activeCourses };
  } catch (error) {
    if (
      error.message === '401 - {"errors":[{"message":"Invalid access token."}]}'
    ) {
      return { success: false, message: 'Invalid Developer Key' };
    }
    log.error(error);
    return { success: false, message: error.message };
  }
};

const getModules = async (authToken, rootURL, course) => {
  const modulesRaw = await apis.listModules(authToken, rootURL, course);
  return Promise.all(_.map(modulesRaw, async (courseModule) => {
    const cleanName = filenamify(courseModule.name, { replacement: '-'});
    return {
      name: cleanName,
      modulePath: path.join(course.name, cleanName),
      items_url: courseModule.items_url,
      items_count: courseModule.items_count,
    }
  }));
};

const getModulesFiles = async (authToken, modules, course) => {
  return Promise.all(_.map(modules, async (courseModule) => {
    // get all module items
    const moduleItems = await apis.listModuleItems(authToken, courseModule);
    // filter only file items, we don't care about the rest
    const filesModules = await Promise.all(_.filter(moduleItems, moduleItem => moduleItem.type === 'File'));
    // get the file information for each module file
    const filesRaw = await Promise.all(_.map(filesModules, async (fileModule) => {
      return apis.getModuleFileDetails(authToken, fileModule.url);
    }));
    // parse file information into something usable
    const files = await Promise.all(_.map(filesRaw, async (fileRaw) => {
      const filenameDecoded = decodeURIComponent(fileRaw.filename).replace(/\+/g, ' ').replace(/\\/g, ' ');
      const cleanName = filenamify(courseModule.name, { replacement: '-'});
      const filename = filenamify(filenameDecoded, { replacement: '-'});
      const filePath = path.join(course.name, cleanName, filename);
      const file = {
        name: filename,
        url: fileRaw.url,
        folder: false,
        lastUpdated: null,
        size: fileRaw.size,
        sync: true,
        id: fileRaw.id,
        filePath,
      };
      return file;
    }));
    return files;
  }));
};

const getUpdatedModulesFiles = async (authToken, modules, course, lastUpdated) => {
  let files = [];
  await Promise.all(_.map(modules, async (courseModule) => {
    // get all module items
    const moduleItems = await apis.listModuleItems(authToken, courseModule);
    // filter only file items, we don't care about the rest
    const filesModules = await Promise.all(_.filter(moduleItems, moduleItem => moduleItem.type === 'File'));
    // get the file information for each module file
    const filesRaw = await Promise.all(_.map(filesModules, async (fileModule) => {
      return apis.getModuleFileDetails(authToken, fileModule.url);
    }));
    // parse file information into something usable
    await Promise.all(_.map(filesRaw, async (fileRaw) => {
      if (new Date(fileRaw.updated_at) > new Date(lastUpdated)) {
        log.info('updated file');
        const filenameDecoded = decodeURIComponent(fileRaw.filename).replace(/\+/g, ' ').replace(/\\/g, ' ');
        const cleanName = filenamify(courseModule.name, { replacement: '-'});
        const filename = filenamify(filenameDecoded, { replacement: '-'});
        const filePath = path.join(course.name, cleanName, filename);
        const file = {
          name: filename,
          url: fileRaw.url,
          folder: false,
          lastUpdated: null,
          size: fileRaw.size,
          sync: true,
          id: fileRaw.id,
          filePath,
        };
        files.push(file);
      } else {
        log.info('not updated file');
      }
    }));
  }));
  return files;
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
};


//Right now this will only get 100 folders may want to add recursion into this as well
const getFolders = async (authToken, folderURL, currentPath) => {
  const foldersResponse = await apis.list200Items(authToken, folderURL);
  return Promise.all(_.map(foldersResponse, async (folder) => {
    const folderPath = path.join(currentPath, folder.name);
    return {
      name: folder.name,
      lastUpdated: folder.updated_at,
      folder: true,
      folders_count: folder.folders_count,
      folders_url: folder.folders_url,
      files_count: folder.files_count,
      files_url: folder.files_url,
      sync: true,
      id: folder.id,
      folderPath,
    };
  }));
};

//Right now this will only get 200 files may want to add recursion into this as well
const getFiles = async (authToken, filesURL, currentPath) => {
  const filesResponse = await apis.list200Items(authToken, filesURL);
  return Promise.all(_.map(filesResponse, async (fileRaw) => {
    const filePath = path.join(currentPath, fileRaw.display_name);
  
    return {
      name: fileRaw.display_name,
      url: fileRaw.url,
      folder: false,
      lastUpdated: null,
      size: fileRaw.size,
      sync: true,
      id: fileRaw.id,
      filePath,
    }
  }));
};

//Right now this will only get 200 files may want to add recursion into this as well
const getNewOrUpdatedFiles = async (authToken, filesURL, currentPath, lastSynced) => {
  try {
    const filesResponse = await apis.listFilesByUpdatedAt(authToken, filesURL);
    // filter files updated more recently than lastSynced
    const newFiles = _.filter(filesResponse, (file) => {
      if (new Date(file.updated_at) > new Date(lastSynced)) {
        return file;
      }
    });
    return Promise.all(_.map(newFiles, async (newFile) => {
      const filePath = path.join(currentPath, newFile.display_name);
        return {
          name: newFile.display_name,
          url: newFile.url,
          folder: false,
          lastUpdated: null,
          size: newFile.size,
          sync: true,
          id: newFile.id,
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
          return Promise.all(_.map(items, async (item) => {
            files.push(item);
            if (item.folders_count > 0) {
              log.info(item);
              return findFolders(authToken, item, item.folderPath, files);
            } 
          }));
        })
        .then(() => {
          return files
        })
    }
    return findFolders(authToken, course, course.name);
  } catch (error) {
    log.error(error);
  }
};

const findAllFiles = async (authToken, folders) => {
  try {
    let files = [];
    await Promise.all(_.map(folders, async (folder) => {
      if (folder.files_count > 0) {
        const folderFiles = await getFiles(authToken, folder.files_url, folder.folderPath);
        files = files.concat(folderFiles);
      }
    }));
    return files;
  } catch (error) {
    log.error(error);
  }
}

const getAllNewOrUpdatedFiles = async (authToken, course, lastSynced) => {
  try {
    let files = [];
    const rootFolderFiles = await getNewOrUpdatedFiles(authToken, course.files_url, course.name, lastSynced);
    files = files.concat(rootFolderFiles);
    await Promise.all(_.map(course.folders, async (folder) => {
      const folderFiles = await getNewOrUpdatedFiles(authToken, folder.files_url, folder.folderPath, lastSynced);
      files = files.concat(folderFiles);
    }));
    return files;
  } catch (error) {
    log.error('problem getting new files');
    // console.error(error);
  }
}

const getCourseFilesANDFoldersURLS = async (authToken, rootURL, courseID) => {
  try {
    const rootFolderResponse = await apis.getCourseRootFolder(authToken, rootURL, courseID);
    return { files_url: rootFolderResponse.files_url, folders_url: rootFolderResponse.folders_url };
  } catch (err) {
    log.error(err);
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
  return { files, folders };
};

const getNewFolders = async (authToken, rootURL, course, lastSynced) => {
  const newFolders = [];
  try {
    const foldersLastUpdated = await apis.listFoldersByUpdatedAt(authToken, rootURL, course.id);
    // parse information add to new folders if more recent than the last time synced
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
    log.error(err);
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

    // theoretically this works, but it is not yet tested all the way through
    if (new Date(filesLastUpdated[0].updated_at) > new Date(lastSynced)) {
      log.info('new file');
      return true;
    } else {
      log.info('no new files');
      return false;
    }
  } catch (err) {
    log.error(`Error checking if ${courseID} has new files`);
    return false;
  }
};

export default {
  getCourses,
  getCourseFilesANDFoldersURLS,
  hasAccessToFilesAPI,
  getCourseFilesAndFolders,
  getNewFolders,
  hasNewFile,
  findAllFolders,
  findAllFiles,
  getAllNewOrUpdatedFiles,
  getModules,
  getModulesFiles,
  getUpdatedModulesFiles,
};
