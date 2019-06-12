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
            return new Promise((resolve, reject) => {
                commit('getAccessData',payload);
                resolve(payload);
            })
        }
    }
}

export default accessModule;




