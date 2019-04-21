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
    // 首页
    {
      path: '/home',
      component: Home,
      children:[
        // 项目列表
        {
          path:'/',
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
        // 后台管理员列表
        {
          path:'/adminList',
          name:'/adminList',
          component:() => import('./views/admin/adminList.vue'),
        },
        // 公司列表
        {
          path:'/company',
          name:'/company',
          component:() => import('./views/admin/company.vue'),
        },
        // 区域列表
        {
          path:'/region',
          name:'/region',
          component:() => import('./views/admin/region.vue'),
        },
        // 单元列表
        {
          path:'/regionBU',
          name:'/regionBU',
          component:() => import('./views/admin/regionBU.vue'),
        },
      ]
    }
  ]
});


export default routers;
