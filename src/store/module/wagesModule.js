// <--------工资模块-------->
let wagesModule = {
    state: {
        wagesKey:'staffList',
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
