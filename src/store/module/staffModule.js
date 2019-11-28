// <--------员工模块-------->
let staffModul = {
    state: {
        isShowDetails:false,
        staffInfo:{},
        staffCurPage:1
    },
    mutations: {
        getStaffInfo(state, payload) {
            state.staffInfo = payload.staffInfo;
            state.isShowDetails = payload.isShowDetails;
        },
        getStaffCurPage(state, payload){
            state.staffCurPage = payload.staffCurPage;
        }
    }
}

export default staffModul;