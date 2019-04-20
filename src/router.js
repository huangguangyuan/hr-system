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
