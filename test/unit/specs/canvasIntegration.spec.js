import request from 'request-promise';
import canvasIntegration from '../../../src/utils/canvasIntegration';

const authToken = process.env.authToken;
const rootURL = process.env.rootURL;
const protocol = 'http://';
const accountID = 1;
let courseID;
let folderID;

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
    await request(createFolderOptions);
    return 'done';
  });
  describe('course related functions', () => {
    it('should get active courses', async () => {
      const activeCourses = await canvasIntegration.getCourses(
        authToken,
        rootURL,
      );
      console.log(JSON.stringify(activeCourses.response, 0, 2));
      expect(activeCourses.response)
        .to.deep.equal(expectedCourses);
    });
    it('should have Test folder', async () => {
      const activeCourses = await canvasIntegration.findAllFolders(
        authToken,
        rootURL,
      );
      expect(activeCourses.response)
        .to.deep.equal(expectedCourses);
    });
  });
  // after(async () => {
  //   const deleteCourseOptions = {
  //     method: 'DELETE',
  //     uri: `${protocol}${rootURL}/api/v1/courses/${courseID}`,
  //     headers: { Authorization: `Bearer ${authToken}` },
  //     formData: { event: 'delete' },
  //     json: true,
  //   };
  //   await request(deleteCourseOptions);
  // });
});
