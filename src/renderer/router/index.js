import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
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
      path: '*',
      redirect: '/',
    },
    {
      path: '/configure',
      name: 'Configure',
      component: require('@/components/Configure').default,
    },
    {
      path: '/progress',
      name: 'Progress',
      component: require('@/components/Progress').default,
    },
  ],
});
