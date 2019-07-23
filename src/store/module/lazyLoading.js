/**
 * 
 * 懒加载动态路由 
 */
function lazy(code) {
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
        path: '/home',
        name: 'welcome',
        component: resolve => require(['@/components/welcome.vue'], resolve),
    },
    // 项目列表
    {
        path: '/projectList',
        name: 'projectList',
        component: resolve => require(['@/views/rbac/projectList.vue'], resolve),
    },
    // HR角色操作
    {
        path: '/proHRrole',
        name: 'proHRrole',
        component: resolve => require(['@/views/rbac/proHRrole.vue'], resolve),
    },
    // 管理员角色操作
    {
        path: '/proAdminRole',
        name: 'proAdminRole',
        component: resolve => require(['@/views/rbac/proAdminRole.vue'], resolve),
    },
    // 权限操作
    {
        path: '/proAccess',
        name: 'proAccess',
        component: resolve => require(['@/views/rbac/proAccess.vue'], resolve),
    },
    // <==========管理员==========>
    // 后台管理员列表
    {
        path: '/adminList',
        name: 'adminList',
        component: resolve => require(['@/views/sysManage/adminList.vue'], resolve),
    },
    // 客户管理员列表
    {
        path: '/customerAdminList',
        name: 'customerAdminList',
        component: resolve => require(['@/views/sysManage/customerAdminList.vue'], resolve),
    },
    // HR系统管理员列表
    {
        path: '/HRadminList',
        name: 'HRadminList',
        component: resolve => require(['@/views/sysManage/HRadminList.vue'], resolve),
    },
    // <==========计薪==========>
    // 个税计算器
    {
        path: '/calculator',
        name: 'calculator',
        component: resolve => require(['@/views/salaryManage/calculator.vue'], resolve),
    },
    // 税率表
    {
        path: '/taxRateTable',
        name: 'taxRateTable',
        component: resolve => require(['@/views/salaryManage/taxRateTable.vue'], resolve),
    },
    // <==========计薪模板==========>
    // 主要城市
    {
        path: '/cityList',
        name: 'cityList',
        component: resolve => require(['@/views/salaryTemplate/cityList.vue'], resolve),
    },
    // 社保模块
    {
        path: '/SItemplate',
        name: 'SItemplate',
        component: resolve => require(['@/views/salaryTemplate/SItemplate.vue'], resolve),
    },
    // 公积金模板
    {
        path: '/HCtemplate',
        name: 'HCtemplate',
        component: resolve => require(['@/views/salaryTemplate/HCtemplate.vue'], resolve),
    },
    // 香港MPF模板
    {
        path: '/MPFtemplate',
        name: 'MPFtemplate',
        component: resolve => require(['@/views/salaryTemplate/MPFtemplate.vue'], resolve),
    },
    // 薪资应税项目
    {
        path: '/STitems',
        name: 'STitems',
        component: resolve => require(['@/views/salaryTemplate/STitems.vue'], resolve),
    },
    // <==========公司==========>
    // 公司
    {
        path: '/companyList',
        name: 'companyList',
        component: resolve => require(['@/views/company/companyList.vue'], resolve),
    },
    // <==========区域==========>
    // 区域
    {
        path: '/regionList',
        name: 'regionList',
        component: resolve => require(['@/views/companyRegion/regionList.vue'], resolve),
    },
    // <==========单位==========>
    // 单位操作
    {
        path: '/BUMain',
        name: 'BUMain',
        component: resolve => require(['@/views/companyRegionBU/unitOperation/BUMain.vue'], resolve),
    },
    // 部门
    {
        path: '/departmentList',
        name: 'departmentList',
        component: resolve => require(['@/views/companyRegionBU/department/departmentList.vue'], resolve),
    },
    // <==========员工==========>
    // 员工档案
    {
        path: '/staffMain',
        name: 'staffMain',
        component: resolve => require(['@/views/staff/staffMain.vue'], resolve),
    },
    // <==========计薪==========>
    // 员工薪资计算
    {
        path: '/payrollMain',
        name: 'payrollMain',
        component: resolve => require(['@/views/payroll/payrollMain.vue'], resolve),
    },
]

export { lazy }

