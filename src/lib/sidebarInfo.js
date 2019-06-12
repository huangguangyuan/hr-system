let sidebarInfo = [
    {
        id: '9990',
        authUrl: 'null',
        iconUrl: 'el-icon-folder',
        isMenu: 0,
        name: '工作台',
        rightCode: 'Workbench',
        items: [
            {
                id: '9991',
                authUrl: '/home',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '工作台',
                rightCode: 'home',
                items: [{}]
            },
        ]
    },
    {
        id: '20',
        authUrl: 'null',
        iconUrl: 'el-icon-folder',
        isMenu: 0,
        name: '项目管理',
        rightCode: 'projectManage',
        items: [
            {
                id: '21',
                authUrl: '/projectList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '项目操作',
                rightCode: 'projectList',
                items: [{}]
            },
            {
                id: '22',
                authUrl: '/proAdminRole',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '管理员角色操作',
                rightCode: 'proAdminRole',
                items: [{}]
            },
            // {
            //     id:'23',
            //     authUrl:'/proHRrole',
            //     iconUrl:'el-icon-document',
            //     isMenu:1,
            //     name:'HR角色操作',
            //     rightCode:'proHRrole',
            //     items:[{}]
            // },
            {
                id: '24',
                authUrl: '/proAccess',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '权限操作',
                rightCode: 'proAccess',
                items: [{}]
            },
        ]
    },
    {
        id: '30',
        authUrl: 'null',
        iconUrl: 'el-icon-setting',
        isMenu: 0,
        name: '系统管理',
        rightCode: 'sysManage',
        items: [
            {
                id: '31',
                authUrl: '/adminList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '后台管理员列表',
                rightCode: 'adminList',
                items: [{}]
            },
            {
                id: '35',
                authUrl: '/HRadminList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: 'HR系统管理员列表',
                rightCode: 'HRadminList',
                items: [{}]
            },
            {
                id: '36',
                authUrl: '/customerAdminList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '客户管理员列表',
                rightCode: 'customerAdminList',
                items: [{}]
            },
        ]
    },
    {
        id: "50",
        authUrl: "null",
        iconUrl: "el-icon-wallet",
        isMenu: 0,
        name: "计薪模板",
        rightCode: "payTemplate",
        items: [
            {
                id: "51",
                authUrl: "/cityList",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "主要城市",
                items: [{}],
                rightCode: "cityList",
            },
            {
                id: "52",
                authUrl: "/SItemplate",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "社保模块",
                items: [{}],
                rightCode: "SItemplate",
            },
            {
                id: "53",
                authUrl: "/HCtemplate",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "公积金模板",
                items: [{}],
                rightCode: "HCtemplate",
            },
            {
                id: "54",
                authUrl: "/STitems",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "薪资应税项目",
                items: [{}],
                rightCode: "STitems",
            }
        ]
    },
    {
        id: "40",
        authUrl: "null",
        iconUrl: "el-icon-money",
        isMenu: 0,
        name: "薪资管理",
        rightCode: "salaryManage",
        items: [
            {
                id: "21",
                authUrl: "/calculator",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "个税计算器",
                items: [{}],
                rightCode: "calculator",
            }
        ]
    },
    {
        id: '70',
        authUrl: 'null',
        iconUrl: 'el-icon-office-building',
        isMenu: 0,
        name: '公司管理',
        rightCode: "companyManage",
        items: [
            {
                id: '71',
                authUrl: '/companyList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '公司列表',
                rightCode: "companyList",
                items: [{}]
            },
        ]
    },
    {
        id: '80',
        authUrl: 'null',
        iconUrl: 'el-icon-place',
        isMenu: 0,
        name: '区域管理',
        rightCode: "regionManage",
        items: [
            {
                id: '81',
                authUrl: '/regionList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '区域列表',
                rightCode: "regionList",
                items: [{}]
            },
        ]
    },
    {
        id: '90',
        authUrl: 'null',
        iconUrl: 'el-icon-school',
        isMenu: 0,
        name: '单位管理',
        rightCode: "regionBUManage",
        items: [
            {
                id: '91',
                authUrl: '/regionBUList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '单位列表',
                rightCode: "regionBUList",
                items: [{}]
            },
            {
                id: '92',
                authUrl: '/taxRateTable',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '税率表',
                rightCode: "taxRateTable",
                items: [{}]
            },
        ]
    },
    {
        id: '100',
        authUrl: 'null',
        iconUrl: 'el-icon-user',
        isMenu: 0,
        name: '员工',
        rightCode: "staff",
        items: [
            {
                id: '101',
                authUrl: '/departmentList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '部门',
                rightCode: "departmentList",
                items: [{}]
            },
            {
                id: '102',
                authUrl: '/staffInformation',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '基本信息',
                rightCode: "staffInformation",
                items: [{}]
            },
        ]
    },
];

export default sidebarInfo;




