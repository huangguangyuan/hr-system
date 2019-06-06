let sidebarInfo = [
    {
        id: '9990',
        authUrl: 'null',
        iconUrl: 'el-icon-folder',
        isMenu: 0,
        name: '工作台',
        roleCode: 'Workbench',
        items: [
            {
                id: '9991',
                authUrl: '/home',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '工作台',
                roleCode: 'home',
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
        roleCode: 'projectManage',
        items: [
            {
                id: '21',
                authUrl: '/projectList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '项目操作',
                roleCode: 'projectList',
                items: [{}]
            },
            {
                id: '22',
                authUrl: '/proAdminRole',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '管理员角色操作',
                roleCode: 'proAdminRole',
                items: [{}]
            },
            // {
            //     id:'23',
            //     authUrl:'/proHRrole',
            //     iconUrl:'el-icon-document',
            //     isMenu:1,
            //     name:'HR角色操作',
            //     roleCode:'proHRrole',
            //     items:[{}]
            // },
            {
                id: '24',
                authUrl: '/proAccess',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '权限操作',
                roleCode: 'proAccess',
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
        roleCode: 'sysManage',
        items: [
            {
                id: '31',
                authUrl: '/adminList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '后台管理员列表',
                roleCode: 'adminList',
                items: [{}]
            },
            {
                id: '35',
                authUrl: '/HRadminList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: 'HR系统管理员列表',
                roleCode: 'HRadminList',
                items: [{}]
            }
        ]
    },
    {
        id: "50",
        authUrl: "null",
        iconUrl: "el-icon-wallet",
        isMenu: 0,
        name: "计薪模板",
        roleCode: "payTemplate",
        items: [
            {
                id: "51",
                authUrl: "/cityList",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "主要城市",
                items: [{}],
                roleCode: "cityList",
            },
            {
                id: "52",
                authUrl: "/SItemplate",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "社保模块",
                items: [{}],
                roleCode: "SItemplate",
            },
            {
                id: "53",
                authUrl: "/HCtemplate",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "公积金模板",
                items: [{}],
                roleCode: "HCtemplate",
            },
            {
                id: "54",
                authUrl: "/STitems",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "薪资应税项目",
                items: [{}],
                roleCode: "STitems",
            }
        ]
    },
    {
        id: "40",
        authUrl: "null",
        iconUrl: "el-icon-money",
        isMenu: 0,
        name: "薪资管理",
        roleCode: "salaryManage",
        items: [
            {
                id: "21",
                authUrl: "/calculator",
                iconUrl: "el-icon-document",
                isMenu: 1,
                name: "个税计算器",
                items: [{}],
                roleCode: "calculator",
            }
        ]
    },
    {
        id: '70',
        authUrl: 'null',
        iconUrl: 'el-icon-office-building',
        isMenu: 0,
        name: '公司管理',
        roleCode: "companyManage",
        items: [
            {
                id: '71',
                authUrl: '/companyList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '公司列表',
                roleCode: "companyList",
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
        roleCode: "regionManage",
        items: [
            {
                id: '81',
                authUrl: '/regionList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '区域列表',
                roleCode: "regionList",
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
        roleCode: "regionBUManage",
        items: [
            {
                id: '91',
                authUrl: '/regionBUList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '单位列表',
                roleCode: "regionBUList",
                items: [{}]
            },
            {
                id: '92',
                authUrl: '/taxRateTable',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '税率表',
                roleCode: "taxRateTable",
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
        roleCode: "staff",
        items: [
            {
                id: '101',
                authUrl: '/departmentList',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '部门',
                roleCode: "departmentList",
                items: [{}]
            },
            {
                id: '102',
                authUrl: '/staffInformation',
                iconUrl: 'el-icon-document',
                isMenu: 1,
                name: '基本信息',
                roleCode: "staffInformation",
                items: [{}]
            },
        ]
    },
];

export default sidebarInfo;




