

    //请求带缓存
    function cacheApiFn(vue,url,pararm) {
        let res_data = sessionStorage.getItem(encodeURIComponent(url));
        if (!res_data || res_data == "" ){
            return Promise.resolve(
                vue.$http.post(url, pararm||{}).then(res => {
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
        return vue.$http.post(url, pararm||{});
    }

    function apiMain(vue,url,pararm){
        let isCache = pararm.isCache;
        delete pararm.isCache;
        if (isCache){
            return cacheApiFn(vue,url,pararm);
        }else{
            return apiFn(vue,url,pararm);
        }
    }

    //定义接口
    let myApi = {
        post:(vue,url,params)=>apiMain(vue,url,params),
        companysWithChild:(vue,params)=>apiMain(vue,'/server/api/v1/company/companysWithChild',params),//app登录接口
        companys:(vue,params)=>apiMain(vue,'/server/api/v1/company/companys',params),//公司接口
        regionBUs:(vue,params)=>apiMain(vue,'/server/api/v1/company/regionBUs',params),//单位接口
        genStaffPayroll:(vue,params)=>apiMain(vue,'/server/api/v1/payroll/staff/genStaffPayroll',params),//生成工资单
    };

    export default {
        install:function(vm){
            vm.prototype.$myApi = myApi;
        }
    }

