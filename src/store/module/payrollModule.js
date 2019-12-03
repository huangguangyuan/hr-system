// <--------计薪模块-------->
let payrollModule = {
    state: {
        payrollKey:'payrollList',
        payrollInfo:{},
        payrollCurPage:1
    },
    mutations: {
        getPayrollInfo(state, payload) {
            state.payrollInfo = payload.payrollInfo;
            state.payrollKey = payload.payrollKey;
        },
        getPayrollCurPage(state, payload){
            state.payrollCurPage = payload.payrollCurPage;
        }
    }
}

export default payrollModule;
