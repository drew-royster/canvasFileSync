const request = require('request-promise');
// const fs = require('fs');
const path = require('path');
const log = require('electron-log');

const getActiveCanvasCourses = async (
  accountDomain,
  authToken,
) => {
  try {
    const options = {
      method: 'GET',
      uri: `http://${accountDomain}/api/v1/users/self/courses?enrollment_state=active`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const activeCoursesResponse = await request(options);
    log.info(activeCoursesResponse);
    return { success: true, message: 'success', response: activeCoursesResponse };
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

const hasAccessToFilesAPI = async (rootURL, courseID, authToken) => {
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

const getData = async (authToken, folderPath, folderURL) => {
  try {
    console.log(folderURL);
    const results = [];
    // This probably has flaws, but we can move forward for now
    const getFolders = async (authToken, folderPath, folderURL, page) => {
      const options = {
        method: 'GET',
        uri: `${folderURL}/?page=${page}`,
        headers: { Authorization: `Bearer ${authToken}` },
        json: true,
        encoding: null,
      };
      const folderResponse = await request(options);
      if (folderResponse.length === 0) {
        // do nothing
        console.log('length is zero');
      } else if (folderResponse.length < 10) {
        // add current folders then do nothing
        results.push(folderResponse);
        console.log('length is less than 10');
      } else {
        // call this function again until all folders are grabbed
        console.log('length is ten calling function again');
        results.push(folderResponse);
        await getFolders(authToken, folderPath, folderURL, page + 1);
      }
    };
    await getFolders(authToken, folderPath, folderURL, 1);
    console.log(results);
  } catch (error) {
    console.error(error);
  }
};

const getCourseFilesFoldersURL = async (authToken, rootURL, courseID) => {
  try {
    const options = {
      method: 'GET',
      uri: `http://${rootURL}/api/v1/courses/${courseID}/folders/root`,
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
      encoding: null,
    };
    const rootFolderResponse = await request(options);
    return rootFolderResponse.folders_url;
  } catch (err) {
    console.error(err);
    return { error: 'Problem getting course files folder' };
  }
};

const getCourseItemsMap = async (authToken, rootURL, rootFolder, course) => {
  const courseFilesFoldersURL = await getCourseFilesFoldersURL(authToken, rootURL, course.id);
  const results = await getData(authToken, rootFolder, courseFilesFoldersURL);
  console.log(results);
};

// export default { getActiveCanvasCourses, hasAccessToFilesAPI, getCourseItemsMap };

const course = { id: 458739,
  name: 'Networks 3',
  account_id: 658,
  uuid: 'wISTVe3HRpnjgnSKHCUidv5pfUFkszStjgFDIFzd',
  start_at: '2018-08-21T06:00:00Z',
  grading_standard_id: 539757,
  is_public: false,
  course_code: 'CS-4610-001 | Fall 2018',
  default_view: 'wiki',
  root_account_id: 16,
  enrollment_term_id: 734,
  end_at: '2018-12-13T00:00:00Z',
  public_syllabus: false,
  public_syllabus_to_auth: false,
  storage_quota_mb: 20000,
  is_public_to_auth_users: false,
  apply_assignment_group_weights: true,
  calendar: { ics: 'https://uvu.instructure.com/feeds/calendars/course_wISTVe3HRpnjgnSKHCUidv5pfUFkszStjgFDIFzd.ics' },
  time_zone: 'America/Denver',
  original_name: 'CS-4610-001 | Fall 2018',
  blueprint: false,
  enrollments: [{ type: 'student', role: 'StudentEnrollment', role_id: 268, user_id: 1477534, enrollment_state: 'active' }],
  hide_final_grades: false,
  workflow_state: 'available',
  restrict_enrollments_to_course_dates: false };

getCourseItemsMap('1012~n4I3mDGFxlupPuJkI6iYnpO3J9KMzOxXo8LBiGZE2BZzZwundcZPP4OcF9ElE83z', 'uvu.instructure.com', '/Users/drewroyster/Documents/classes', course);
