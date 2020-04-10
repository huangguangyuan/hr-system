/*
 * @Author: your name
 * @Date: 2019-07-23 17:46:55
 * @LastEditTime: 2020-04-10 16:18:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hr-system\src\store\module\payrollModule.js
 */
// <--------计薪模块-------->
let payrollModule = {
    state: {
        payrollKey:'payrollList',
        payrollMainKey:'staffPayrollList',
        payrollMainInfo:{},
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
        },
        setPayrollMainKey(state, payload){
            state.payrollMainKey = payload.payrollMainKey;
            state.payrollMainInfo = payload.payrollMainInfo;
        },        
    }
}

export default payrollModule;
