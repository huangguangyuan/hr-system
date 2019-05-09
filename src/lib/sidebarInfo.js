let sidebarInfo = [
    {
        id:'20',
        authUrl:'null',
        iconUrl:'el-icon-menu',
        isMenu:0,
        name:'项目管理',
        items:[
            {
                id:'21',
                authUrl:'/home',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'项目操作',
                items:[{}]
            },
            {
                id:'22',
                authUrl:'/proAdminRole',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'管理员角色操作',
                items:[{}]
            },
            // {
            //     id:'23',
            //     authUrl:'/proHRrole',
            //     iconUrl:'el-icon-document',
            //     isMenu:1,
            //     name:'HR角色操作',
            //     items:[{}]
            // },
            {
                id:'24',
                authUrl:'/proAccess',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'权限操作',
                items:[{}]
            },
        ]
    },
    {
        id:'30',
        authUrl:'null',
        iconUrl:'el-icon-menu',
        isMenu:0,
        name:'系统管理',
        items:[
            {
                id:'31',
                authUrl:'/adminList',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'后台管理员列表',
                items:[{}]
            },
            {
                id:'35',
                authUrl:'/HRadminList',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'HR系统管理员列表',
                items:[{}]
            },
            {
                id:'32',
                authUrl:'/company',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'公司操作',
                items:[{}]
            },
            {
                id:'33',
                authUrl:'/region',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'区域操作',
                items:[{}]
            },
            {
                id:'34',
                authUrl:'/regionBU',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'单元操作',
                items:[{}]
            },
        ]
    },
    {
        id:'40',
        authUrl:'null',
        iconUrl:'el-icon-menu',
        isMenu:0,
        name:'薪资管理',
        items:[
            {
                id:'21',
                authUrl:'/calculator',
                iconUrl:'el-icon-document',
                isMenu:1,
                name:'个税计算器',
                items:[{}]
            },
        ]
    }
];

export default sidebarInfo;




