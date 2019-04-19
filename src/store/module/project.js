// <--------项目模块-------->
let projectModul = {
    state: {
        editInfo:{}
    },
    mutations: {
        projectEditInfo(state, payload) {
            state.editInfo = payload.editInfo;
        }
    }
}


export default projectModul;


