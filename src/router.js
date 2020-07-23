import Vue from 'vue'
import Router from 'vue-router'

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
      meta: {
        title: 'PSS-Staff'
      },
      component: resolve => require(['@/views/Login.vue'], resolve),
    },
    // 修改密码
    {
      path: '/editPassword/:code',
      name: 'editPassword',
      component: resolve => require(['@/views/EditPassword.vue'], resolve),
    },
    // 认证用户名和邮箱
    {
      path: '/accountEmail',
      name: 'accountEmail',
      component: resolve => require(['@/views/AccountEmail.vue'], resolve),
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
