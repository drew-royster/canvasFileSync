import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index.js';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Preferences',
      component: require('@/components/Preferences').default,
      beforeEnter: (to, from, next) => {
        store.dispatch('isConnected')
          .then(async (isConnected) => {
            if (isConnected) {
              const hasNewCourses = await store.dispatch('hasNewCourses');
              if (hasNewCourses) {
                store.dispatch('loadSavedState').then(next('/configure'));
              } else {
                next();
              }
            } else {
              next('/home');
            }
          });
      },
    },
    {
      path: '/home',
      name: 'Home',
      component: require('@/components/Home').default,
    },
    {
      path: '/login/:url',
      name: 'Login',
      component: require('@/components/Login').default,
      props: true,
    },
    {
      path: '/report/:successes/:failures',
      name: 'Report',
      component: require('@/components/Report').default,
      props: true,
    },
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/configure',
      name: 'Configure',
      component: require('@/components/Configure').default,
    },
    {
      path: '/loading',
      name: 'Loading',
      component: require('@/components/Loading').default,
    },
    {
      path: '/download',
      name: 'Download',
      component: require('@/components/Download').default,
    },
    {
      path: '/error',
      name: 'Error',
      component: require('@/components/ErrorPage').default,
    },
  ],
});
