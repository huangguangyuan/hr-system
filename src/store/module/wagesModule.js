// <--------工资模块-------->
let wagesModule = {
    state: {
        wagesKey:'wagesStaffList',
        wagesInfo:{}
    },
    mutations: {
        getWagesInfo(state, payload) {
            state.wagesKey = payload.wagesKey;
            state.wagesInfo = payload.wagesInfo;
        }
    }
}

export default wagesModule;
