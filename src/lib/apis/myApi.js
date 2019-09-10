

    //请求带缓存
    function cacheApiFn(vue,url,pararm) {
        let res_data = sessionStorage.getItem(encodeURIComponent(url));
        if (!res_data || res_data == "" ){
            return Promise.resolve(
                vue.$http.post(url, pararm.data||{}).then(res => {
                    if (res.data.code == 0) {
                        vue.$toolFn.sessionSet(encodeURIComponent(url),res.data.data);
                        return res.data.data;
                    }else{
                        return null;
                    }
                }));
        }else{
            return JSON.parse(res_data);
        }
    }

    //请求
    function apiFn(vue,url,pararm) {
        return vue.$http.post(url, pararm.data||{});
    }

    function apiMain(vue,url,pararm){
        if (!pararm.isCache){
            return apiFn(vue,url,pararm);
        }else{
            delete pararm.isCache;
            return cacheApiFn(vue,url,pararm);
        }
    }

    //定义接口
    let myApi = {
        post:(vue,url,params)=>apiMain(vue,url,params),
        companysWithChild:(vue,params)=>apiMain(vue,'/server/api/v1/company/companysWithChild',params),//app登录接口
        companys:(vue,params)=>apiMain(vue,'/server/api/v1/company/companys',params),//公司接口
        regionBUs:(vue,params)=>apiMain(vue,'/server/api/v1/company/regionBUs',params),//单位接口
    };

    export default {
        install:function(vm){
            vm.prototype.$myApi = myApi;
        }
    }

