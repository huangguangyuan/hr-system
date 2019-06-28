// <--------员工模块-------->
let staffModul = {
    state: {
        isShowDetails:false,
        staffInfo:{}
    },
    mutations: {
        getStaffInfo(state, payload) {
            state.staffInfo = payload.staffInfo;
            state.isShowDetails = payload.isShowDetails;
        }
    }
}

export default staffModul;