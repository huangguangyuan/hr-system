// <--------员工模块-------->
let BUModule = {
    state: {
        isShowSetting:false,
        BUInfo:{}
    },
    mutations: {
        getBUInfo(state, payload) {
            state.BUInfo = payload.BUInfo;
            state.isShowSetting = payload.isShowSetting;
        }
    }
}

export default BUModule;