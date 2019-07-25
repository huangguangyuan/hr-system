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
      name: 'AdminLogin',
      component: resolve => require(['@/views/AdminLogin.vue'], resolve),
    },
    // 登录
    {
      path: '/hr',
      name: 'login',
      component: resolve => require(['@/views/Login.vue'], resolve),
    },
    // 404
    {
      path: '*',
      name: 'page404',
      component: resolve => require(['@/components/404.vue'], resolve),
    },
  ]
});


export default routers;
