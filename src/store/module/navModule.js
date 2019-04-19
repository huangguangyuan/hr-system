// <--------首页导航条模块-------->
let navModule = {
    state: {
        navTabs: [],
        TabsValue: '/home'
    },
    mutations: {
        changeNavTabs(state, payload) {
            state.navTabs.push(payload.navTabs);
        },
        getNavTabs(state, payload) {
            state.navTabs = payload.navTabs
        },
        changeTabsVal(state, payload) {
            state.TabsValue = payload.TabsValue
        }
    }
}


export default navModule;
