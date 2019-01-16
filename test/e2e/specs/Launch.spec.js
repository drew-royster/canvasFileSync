import utils from '../utils';

describe('Launch', function () {
  this.timeout(0);
  beforeEach(utils.beforeEach);
  afterEach(utils.afterEach);

  // it('shows the proper application title', function () {
  //   return this.app.client.getTitle()
  //     .then((title) => {
  //       expect(title).to.equal('Canvas File Sync');
  //     });
  // });


  it('can login to test canvas', async function () {
    return this.app.client.click('#manual-mode')
      .pause(30 * 1000);
  });
});
