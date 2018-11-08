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

  // it('can find Utah Valley University', async function () {
  //   return this.app.client.setValue('#school-search', 'Utah Valley University')
  //     .pause(2 * 1000)
  //     .keys('\uE007')
  //     .pause(30 * 1000);
  // });

  // it('can login to test canvas', async function () {
  //   return this.app.client.element('#manual-mode')
  //     .click()
  //     .pause(30 * 1000);
  // });
  // it('is accessible', function () {
  //   return this.app.client.auditAccessibility().then(function (audit) {
  //     if (audit.failed) {
  //       console.error(audit.message);
  //     }
  //   });
  // });
});
