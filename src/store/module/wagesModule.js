// <--------工资模块-------->
let wagesModule = {
    state: {
        wagesKey:'wagesStaffList',
        wagesInfo:{},
        wagesCurPage:1
    },
    mutations: {
        getWagesInfo(state, payload) {
            state.wagesKey = payload.wagesKey;
            state.wagesInfo = payload.wagesInfo;
        },
        getWagesCurPage(state, payload){
            state.wagesCurPage = payload.wagesCurPage;
        }
    }
}

export default wagesModule;
