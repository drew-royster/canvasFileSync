<template>
  <webview id="foo" partition="persist::uvu" v-bind:src="`http://${url}`" style="display:inline-flex; width:100%; height:100%"></webview>
</template>

<script>
  const request = require('request-promise');
  export default {
    name: 'login',
    props: ['url'],
    mounted() {
      let CSRFToken = '';
      let canvasSession = '';
      let capturedCreds = false;
      const purpose = 'canvasFileSync';
      const checkCookies = setInterval(() => {
        const webview = document.querySelector('webview');
        const webviewSession = webview.getWebContents().session;
        console.log('here');
        if (CSRFToken === '' || canvasSession === '') {
          webview.getWebContents().on('will-navigate', async (event, webviewURL) => {
            console.log(this.url);
            console.log(webviewURL);
            if (webviewURL.includes(this.url)) {
              const cookies = webviewSession.cookies;
              console.log('comparison matches');
              cookies.get({ name: '_csrf_token', domain: 'uvu.instructure.com' }, async (error, cookie) => {
                CSRFToken = cookie[0].value;
              });
              cookies.get({ name: 'canvas_session', domain: 'uvu.instructure.com' }, async (error, cookie) => {
                canvasSession = cookie[0].value;
              });
            }
          });
        } else if (capturedCreds === false) {
          console.log(`csrf_token: ${CSRFToken}`);
          console.log(`canvas_session: ${canvasSession}`);
          capturedCreds = true;
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

          request(options).then((response) => {
            console.log(`token response: ${JSON.parse(response).visible_token}`);
            clearInterval(checkCookies);
            this.$store.commit('SET_AUTH_TOKEN', JSON.parse(response).visible_token);
            this.$store.dispatch('connect');
          });
        } else {
          console.log('1 second has passed. already sent request');
        }
      }, 1000);
    },
  };
</script>

<style scoped>
</style>
