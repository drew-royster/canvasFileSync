import canvasIntegration from '../../../src/utils/canvasIntegration';

// this is for an AWS API Gateway and doesn't correlate to any real data
const authToken = 'MvYujAXDbZEodUwe1CarI42IRABT5p04yU9lJoerbGzjyrJRjzyxAC8NR8DqpeJs';

// this is the AWS API Gateway url. Not a real canvas installation
const rootURL = 'ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage';

const expectedCourses = [
  {
    id: 1,
    sync: true,
    name: 'Course 1',
    folder: true,
    files_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3202692/files',
    folders_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3202692/folders',
  },
];

const expectedFolders = [
  {
    name: 'APA',
    lastUpdated: '2018-08-19T22:15:13Z',
    folder: true,
    folders_count: 1,
    folders_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/folders',
    files_count: 1,
    files_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/files',
    sync: true,
    id: 3414348,
    folderPath: 'Course 1/APA',
  },
  {
    name: 'Files',
    lastUpdated: '2018-08-19T22:15:12Z',
    folder: true,
    folders_count: 0,
    folders_url: '',
    files_count: 0,
    files_url: '',
    sync: true,
    id: 3414345,
    folderPath: 'Course 1/Files',
  },
  {
    name: 'NESTED',
    lastUpdated: '2018-08-19T22:15:13Z',
    folder: true,
    folders_count: 0,
    folders_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/folders',
    files_count: 0,
    files_url: 'https://ebqz3oi7da.execute-api.us-east-1.amazonaws.com/stage/api/v1/folders/3414348/files',
    sync: true,
    id: 3414349,
    folderPath: 'Course 1/APA/NESTED',
  },
];

const expectedFiles = [
  {
    name: 'APA 6th.dot',
    url: 'https://s3.amazonaws.com/test-canvas/APA+6th.dot',
    folder: false,
    lastUpdated: null,
    size: 53760,
    sync: true,
    id: 88841898,
    filePath: 'Course 1/APA/APA 6th.dot',
  },
];

describe('canvas integration', () => {
  it('should get active courses', async () => {
    const activeCourses = await canvasIntegration.getCourses(
      authToken,
      rootURL,
    );
    expect(JSON.stringify(activeCourses.response, null, 2))
      .to.equal(JSON.stringify(expectedCourses, null, 2));
  });
  it('course 1 should have access to files api', async () => {
    const hasAccess = await canvasIntegration.hasAccessToFilesAPI(
      authToken,
      rootURL, 1,
    );
    expect(hasAccess).to.be.true; // eslint-disable-line
  });
  it('should get all folders for course 1', async () => {
    const allFolders = await canvasIntegration.findAllFolders(
      authToken,
      expectedCourses[0],
    );
    expect(JSON.stringify(allFolders, null, 2))
      .to.equal(JSON.stringify(expectedFolders, null, 2));
  });
  it('should get all files for course 1', async () => {
    const allFiles = await canvasIntegration.findAllFiles(
      authToken,
      expectedFolders,
    );
    expect(JSON.stringify(expectedFiles, null, 2))
      .to.equal(JSON.stringify(allFiles, null, 2));
  });
});
