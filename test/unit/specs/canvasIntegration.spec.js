import request from 'request-promise';
import fs from 'fs';
import canvasIntegration from '../../../src/utils/canvasIntegration';

const authToken = process.env.authToken;
const rootURL = process.env.rootURL;
const protocol = 'http://';
const accountID = 1;
let courseID;
let folderID;
let fileID;
let folders;

const expectedCourses = [
  {
    id: 1,
    hasModulesTab: true,
    hasFilesTab: true,
    sync: true,
    name: 'Test',
    modules: [],
    folder: true,
    files: [],
    folders: [],
    files_url: null,
    folders_url: null,
  },
];

// const expectedFolders = [
//   {
//     name: 'APA',
//     lastUpdated: '2018-08-19T22:15:13Z',
//     folder: true,
//     folders_count: 1,
//     folders_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/folders',
//     files_count: 1,
//     files_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/files',
//     sync: true,
//     id: 3414348,
//     folderPath: 'Course 1/APA',
//   },
//   {
//     name: 'Files',
//     lastUpdated: '2018-08-19T22:15:12Z',
//     folder: true,
//     folders_count: 0,
//     folders_url: '',
//     files_count: 0,
//     files_url: '',
//     sync: true,
//     id: 3414345,
//     folderPath: 'Course 1/Files',
//   },
//   {
//     name: 'NESTED',
//     lastUpdated: '2018-08-19T22:15:13Z',
//     folder: true,
//     folders_count: 0,
//     folders_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/folders',
//     files_count: 0,
//     files_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/files',
//     sync: true,
//     id: 3414349,
//     folderPath: 'Course 1/APA/NESTED',
//   },
// ];

// const expectedFiles = [
//   {
//     name: 'APA 6th.dot',
//     url: 'https://s3.amazonaws.com/test-canvas/APA+6th.dot',
//     folder: false,
//     lastUpdated: null,
//     size: 53760,
//     sync: true,
//     id: 88841898,
//     filePath: 'Course 1/APA/APA 6th.dot',
//   },
// ];

describe('canvas integration', () => {
  before(async () => {
    // create course
    const createCourseOptions = {
      method: 'POST',
      uri: `${protocol}${rootURL}/api/v1/accounts/${accountID}/courses`,
      headers: { Authorization: `Bearer ${authToken}` },
      formData: { 'course[name]': 'Test' },
      json: true,
    };
    ({ id: courseID } = await request(createCourseOptions));
    expectedCourses[0].id = courseID;
    // enroll user
    const enrollUserOptions = {
      method: 'POST',
      uri: `${protocol}${rootURL}/api/v1/courses/${courseID}/enrollments`,
      headers: { Authorization: `Bearer ${authToken}` },
      formData: { 'enrollment[user_id]': accountID, 'enrollment[enrollment_state]': 'active' },
      json: true,
    };
    await request(enrollUserOptions);
    // publish course
    const publishCourseOptions = {
      method: 'PUT',
      uri: `${protocol}${rootURL}/api/v1/courses/${courseID}`,
      headers: { Authorization: `Bearer ${authToken}` },
      formData: {
        'course[event]': 'publish',
        enroll_me: 'true',
        'course[is_public_to_auth_users]': 'true',
        offer: 'true',
      },
    };
    await request(publishCourseOptions);
    const getRootFolderOptions = {
      method: 'GET',
      uri: `${protocol}${rootURL}/api/v1/courses/${courseID}/folders/root`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
    };
    const { id: rootFolderID } = await request(getRootFolderOptions);

    const createFolderOptions = {
      method: 'POST',
      uri: `${protocol}${rootURL}/api/v1/courses/${courseID}/folders`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      formData: { name: 'Test', parent_folder_id: rootFolderID },
    };
    ({ id: folderID } = await request(createFolderOptions));

    const askUploadOptions = {
      method: 'POST',
      uri: `${protocol}${rootURL}/api/v1/folders/${folderID}/files`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      formData: { name: 'README.md' },
    };
    const { upload_url, upload_params } = await request(askUploadOptions); // eslint-disable-line

    // console.log(upload_url);
    // console.log(upload_params);

    const uploadOptions = {
      method: 'POST',
      uri: upload_url,
      resolveWithFullResponse: true,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      formData: {
        key: upload_params.key,
        Filename: upload_params.Filename,
        acl: upload_params.acl,
        Policy: upload_params.Policy,
        Signature: upload_params.Signature,
        'content-type': upload_params['content-type'],
        file: fs.createReadStream('README.md'),
      },
    };
    try {
      await request(uploadOptions);
    } catch (err) {
      const dummyPage = document.createElement('html');
      dummyPage.innerHTML = err.message;
      const link = dummyPage.getElementsByTagName('a');
      const confirmURL = link[0].attributes[0].value.replace(/\\"/g, '');
      const confirmUploadOptions = {
        method: 'GET',
        uri: confirmURL,
        headers: { Authorization: `Bearer ${authToken}` },
        json: true,
      };
      ({ id: fileID } = await request.get(confirmUploadOptions));

      const createModuleOptions = {
        method: 'POST',
        uri: `${protocol}${rootURL}/api/v1/courses/${courseID}/modules`,
        headers: { Authorization: `Bearer ${authToken}` },
        formData: { 'module[name]': 'TestModule' },
        json: true,
      };
      const { id: moduleID } = await request(createModuleOptions);

      const addModuleItemOptions = {
        method: 'POST',
        uri: `${protocol}${rootURL}/api/v1/courses/${courseID}/modules/${moduleID}/items`,
        headers: { Authorization: `Bearer ${authToken}` },
        formData: {
          'module_item[type]': 'File',
          'module_item[content_id]': fileID,
        },
        json: true,
      };
      await request(addModuleItemOptions);
    }
  });
  describe('course related functions', () => {
    it('should get active courses', async () => {
      const activeCourses = await canvasIntegration.getCourses(
        authToken,
        rootURL,
      );
      // console.log(JSON.stringify(activeCourses.response, 0, 2));
      expectedCourses[0].files_url = activeCourses.response[0].files_url;
      expectedCourses[0].folders_url = activeCourses.response[0].folders_url;
      expect(activeCourses.response)
        .to.deep.equal(expectedCourses);
    });
    it('should have Test folder', async () => {
      folders = await canvasIntegration.findAllFolders(
        authToken,
        expectedCourses[0],
      );
      expect(folders.length)
        .to.equal(1);
      expect(folders[0].id)
        .to.equal(folderID);
      expect(folders[0].folderPath)
        .to.equal('Test/Test');
    });
    it('should have README.md', async () => {
      const files = await canvasIntegration.findAllFiles(
        authToken,
        folders,
      );
      expect(files.length)
        .to.equal(1);
      expect(files[0].name)
        .to.equal('README.md');
      expect(files[0].lastUpdated)
        .to.equal(null);
    });
    it('should have README.md and Test folder from getcoursefilesandfolders', async () => {
      const { files: courseFiles, folders: courseFolders } = await canvasIntegration
        .getCourseFilesAndFolders(
          authToken,
          expectedCourses[0],
        );
      expect(courseFiles.length)
        .to.equal(1);
      expect(courseFolders.length)
        .to.equal(1);
      expect(courseFolders[0].folderPath)
        .to.equal('Test/Test');
      expect(courseFiles[0].name)
        .to.equal('README.md');
      expect(courseFiles[0].lastUpdated)
        .to.equal(null);
    });
    it('should have module with README.md', async () => {
      const modules = await canvasIntegration
        .getModules(authToken, rootURL, expectedCourses[0]);
      const files = await canvasIntegration
        .getModulesFiles(authToken, modules, expectedCourses[0]);
      expect(modules.length)
        .to.equal(1);
      expect(files.length)
        .to.equal(1);
      expect(modules[0].name)
        .to.equal('TestModule');
    });
  });
  after(async () => {
    const deleteCourseOptions = {
      method: 'DELETE',
      uri: `${protocol}${rootURL}/api/v1/courses/${courseID}`,
      headers: { Authorization: `Bearer ${authToken}` },
      formData: { event: 'delete' },
      json: true,
    };
    await request(deleteCourseOptions);
  });
});
