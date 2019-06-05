/**
 * 
 * 懒加载动态路由 
 */
function lazy(code) {
    console.log(123);
    //return  resolve => require(["@/components/" + name + ".vue"], resolve)
    return getComponetByPath('/' + code);


}
function getComponetByPath(path) {
    for (var i = 0; i < dynamicRouter.length; i++) {
        var route = dynamicRouter[i];
        if (route.path == path) {
            return route.component;
        }
    }
}
/**
 * 路由定义
 * path跟配置里的资源标示对应,同时跟url地址对应
 */
const dynamicRouter = [
    {
        path: '/',
        name: 'welcome',
        component: () => import('@/components/welcome.vue'),
    },
    // 项目列表
    {
        path: '/projectList',
        name: 'projectList',
        component: () => import('@/views/rbac/projectList.vue'),
    },
    // HR角色操作
    {
        path: '/proHRrole',
        name: 'proHRrole',
        component: () => import('@/views/rbac/proHRrole.vue'),
    },
    // 管理员角色操作
    {
        path: '/proAdminRole',
        name: 'proAdminRole',
        component: () => import('@/views/rbac/proAdminRole.vue'),
    },
    // 权限操作
    {
        path: '/proAccess',
        name: 'proAccess',
        component: () => import('@/views/rbac/proAccess.vue'),
    },
    // <==========管理员==========>
    // 后台管理员列表
    {
        path: '/adminList',
        name: 'adminList',
        component: () => import('@/views/sysManage/adminList.vue'),
    },
    // HR系统管理员列表
    {
        path: '/HRadminList',
        name: 'HRadminList',
        component: () => import('@/views/sysManage/HRadminList.vue'),
    },
    // <==========计薪==========>
    // 个税计算器
    {
        path: '/calculator',
        name: 'calculator',
        component: () => import('@/views/salaryManage/calculator.vue'),
    },
    // <==========计薪模板==========>
    // 主要城市
    {
        path: '/cityList',
        name: 'cityList',
        component: () => import('@/views/salaryTemplate/cityList.vue'),
    },
    // 社保模块
    {
        path: '/SItemplate',
        name: 'SItemplate',
        component: () => import('@/views/salaryTemplate/SItemplate.vue'),
    },
    // 公积金模板
    {
        path: '/HCtemplate',
        name: 'HCtemplate',
        component: () => import('@/views/salaryTemplate/HCtemplate.vue'),
    },
    // 薪资应税项目
    {
        path: '/STitems',
        name: 'STitems',
        component: () => import('@/views/salaryTemplate/STitems.vue'),
    },
    // <==========公司==========>
    // 公司
    {
        path: '/companyList',
        name: 'companyList',
        component: () => import('@/views/company/companyList.vue'),
    },
    // <==========区域==========>
    // 区域
    {
        path: '/regionList',
        name: 'regionList',
        component: () => import('@/views/companyRegion/regionList.vue'),
    },
    // <==========单位==========>
    // 单位
    {
        path: '/regionBUList',
        name: 'regionBUList',
        component: () => import('@/views/companyRegionBU/regionBUList.vue'),
    },
    // 税率表
    {
        path: '/taxRateTable',
        name: 'taxRateTable',
        component: () => import('@/views/companyRegionBU/taxRateTable.vue'),
    },
    // <==========员工==========>
    // 部门
    {
        path: '/departmentList',
        name: 'departmentList',
        component: () => import('@/views/staff/department/departmentList.vue'),
    },
    // 员工基本信息
    {
        path: '/staffInformation',
        name: 'staffInformation',
        component: () => import('@/views/staff/information/staffInformation.vue'),
    },
]

export { lazy }

