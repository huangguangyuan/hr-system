/*
 * @Author: your name
 * @Date: 2019-07-21 14:51:54
 * @LastEditTime: 2020-08-05 22:10:16
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \hr-system\src\store\module\accessModule.js
 */
// <--------左侧导航条模块-------->
let accessModule = {
    state:{
        accessList:[]
    },
    mutations:{
        getAccessData(state,payload){
            state.accessList = payload;
        }
    },
    actions:{
        getAccessData_Fun({commit},payload){
            return new Promise((resolve) => {
                commit('getAccessData',payload);
                resolve(payload);
            })
        }
    }
}

export default accessModule;




