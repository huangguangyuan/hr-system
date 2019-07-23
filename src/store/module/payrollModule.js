// <--------计薪模块-------->
let payrollModule = {
    state: {
        payrollKey:'payrollList',
        payrollInfo:{}
    },
    mutations: {
        getPayrollInfo(state, payload) {
            state.payrollInfo = payload.payrollInfo;
            state.payrollKey = payload.payrollKey;
        }
    }
}

export default payrollModule;
