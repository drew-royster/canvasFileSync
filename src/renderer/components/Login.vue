<template>
  <webview id="foo" partition="persist::uvu" v-bind:src="`http://${url}`" style="display:inline-flex; width:100%; height:100%"></webview>
</template>

<script>
  const log = require('electron-log');
  const request = require('request-promise');
  export default {
    name: 'login',
    props: ['url'],
    mounted() {
      let CSRFToken = '';
      let canvasSession = '';
      let capturedAuthToken = false;
      const purpose = 'canvasFileSync';
      const getToken = setInterval(() => {
        if (capturedAuthToken === false) {
          const webview = document.querySelector('webview');
          const webviewSession = webview.getWebContents().session;
          const cookies = webviewSession.cookies;
          cookies.get({ name: '_csrf_token', domain: this.url }, async (error, cookie) => {
            CSRFToken = cookie[0].value;
          });
          cookies.get({ name: 'canvas_session', domain: this.url }, async (error, cookie) => {
            canvasSession = cookie[0].value;
          });
          const options = {
            method: 'POST',
            url: `https://${this.url}/profile/tokens`,
            headers:
            {
              'Cache-Control': 'no-cache',
              'X-Requested-With': 'XMLHttpRequest',
              Accept: 'application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-CSRF-Token': CSRFToken,
              Cookie: `canvas_session=${canvasSession}; _csrf_token=${CSRFToken}`,
            },
            body: `authenticity_token=${CSRFToken}&access_token%5Bpurpose%5D=${purpose}`,
          };

          request(options)
            .then((response) => {
              if ('visible_token' in JSON.parse(response)) {
                capturedAuthToken = true;
                clearTimeout(getToken);
                this.$store.commit('SET_AUTH_TOKEN', JSON.parse(response).visible_token);
                this.$store.dispatch('connect').then(async () => {
                  const syncableCourses = await this.$store.getters.syncableCourses;
                  if (syncableCourses.length > 0) {
                    this.$router.push('/configure');
                  } else {
                    this.$store.dispatch('goErrorPage', { message: 'Hey buddy! You don\'t have any courses to sync. Give this app another try when you have courses to sync' });
                  }
                });
              }
            })
            .catch((err) => {
              log.error(err);
            });
        } else {
          log.info('1 second has passed. already sent request');
        }
      }, 1000);
    },
  };
</script>
