import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

let routers = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    // 登录
    {
      path: '/',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    // 404
    {
      path: '*',
      name: 'page404',
      component: () => import('./components/404.vue')
    },
  ]
});


export default routers;
