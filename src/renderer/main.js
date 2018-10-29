import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import * as Sentry from '@sentry/electron';

import App from './App';
import router from './router';
import store from './store';

Sentry.init({ dsn: 'https://312e7fd7b4784962ba2948b19547c3cc@sentry.io/1311555' });

Vue.use(Vuetify);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
