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
          name:'adminList',
          component:() => import('./views/sysManage/adminList.vue'),
        },
        // HR系统管理员列表
        {
          path:'/HRadminList',
          name:'HRadminList',
          component:() => import('./views/sysManage/HRadminList.vue'),
        },
        // 公司列表
        {
          path:'/company',
          name:'company',
          component:() => import('./views/sysManage/company.vue'),
        },
        // 区域列表
        {
          path:'/region',
          name:'region',
          component:() => import('./views/sysManage/region.vue'),
        },
        // 单元列表
        {
          path:'/regionBU',
          name:'regionBU',
          component:() => import('./views/sysManage/regionBU.vue'),
        },
        // 个税计算器
        {
          path:'/calculator',
          name:'calculator',
          component:() => import('./views/salaryManage/calculator.vue'),
        },
        // 主要城市
        {
          path:'/cityList',
          name:'cityList',
          component:() => import('./views/salaryTemplate/cityList.vue'),
        },
        // 社保模块
        {
          path:'/SItemplate',
          name:'SItemplate',
          component:() => import('./views/salaryTemplate/SItemplate.vue'),
        },
        // 公积金模板
        {
          path:'/HCtemplate',
          name:'HCtemplate',
          component:() => import('./views/salaryTemplate/HCtemplate.vue'),
        },
        // 薪资应税项目
        {
          path:'/STitems',
          name:'STitems',
          component:() => import('./views/salaryTemplate/STitems.vue'),
        },
      ]
    }
  ]
});


export default routers;
