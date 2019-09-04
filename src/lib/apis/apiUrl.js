import req from './cacheRequest.js'
//定义接口
let apiUrl = {
    companysWithChild:(params,vue)=>req('/server/api/v1/company/companysWithChild',params,vue),//app登录接口
};
//export default apiUrl
export default {
    install:function(vm){
        vm.prototype.$cacheRequest = apiUrl;
    }
}