import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    // 登录
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    // 首页
    {
      path: '/home',
      component: Home,
      children:[
        {
          path:'/',
          name:'pro1',
          component:() => import('./views/demo/pro1.vue'),
        },
        {
          path:'/pro2',
          name:'pro2',
          component:() => import('./views/demo/pro2.vue'),
        },
        {
          path:'/pro3',
          name:'pro3',
          component:() => import('./views/demo/pro3.vue'),
        },
        {
          path:'/pro4',
          name:'pro4',
          component:() => import('./views/demo/pro4.vue'),
        },
        {
          path:'/pro5',
          name:'pro5',
          component:() => import('./views/demo/pro5.vue'),
        },
        {
          path:'/pro6',
          name:'pro6',
          component:() => import('./views/demo/pro6.vue'),
        },
        // 项目列表
        {
          path:'/projectList',
          name:'projectList',
          component:() => import('./views/rbac/projectList.vue'),
        },
        // HR角色操作
        {
          path:'/proHRrole',
          name:'proHRrole',
          component:() => import('./views/rbac/proHRrole.vue'),
        },
        // 管理员角色操作
        {
          path:'/proAdminRole',
          name:'proAdminRole',
          component:() => import('./views/rbac/proAdminRole.vue'),
        },
        // 权限操作
        {
          path:'/proAccess',
          name:'proAccess',
          component:() => import('./views/rbac/proAccess.vue'),
        },
      ]
    }
  ]
})
