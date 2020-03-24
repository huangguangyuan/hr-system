    import request from '@/lib/request'
    import utile from '@/lib/utils'
    //请求带缓存
    function cacheApiFn(url,pararm) {
        let res_data = sessionStorage.getItem(encodeURIComponent(url));
        if (!res_data || res_data == "" ){
            return Promise.resolve(
                request.post(url, pararm||{}).then(res => {
                    if (res.data.code == 0) {
                        utile.sessionSet(encodeURIComponent(url),res.data.data);
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
    function apiFn(url,pararm) {
        return Promise.resolve(
            request.post(url, pararm||{}).then(res => {
                if (res.data.code == 0) {
                    return res.data.data;
                }else{
                    return res.data;
                }
            }));
    }

    function apiMain(url,pararm){
        let isCache = false;
        if (pararm && pararm.isCache){
            isCache = pararm.isCache;
            delete pararm.isCache;
        }
        if (isCache){
            return cacheApiFn(url,pararm);
        }else{
            return apiFn(url,pararm);
        }
    }

    function requestPost(url,pararm){
        return Promise.resolve(
            request.post(url, pararm||{}).then(res => {
                return res.data;
            }));
    }

    function requestGet(url,pararm){
        return Promise.resolve(
            request.get(url).then(res => {
                return res.data;
            }));
    }
    //定义接口
    let api = {
        post:(url,params)=>apiMain(url,params),
        requestPost:(url,params)=>requestPost(url,params),
        requestGet:(url,params)=>requestGet(url,params),
        companys:(params)=>apiMain('/server/api/v1/company/companys',params),//公司接口
        regionBUs:(params)=>apiMain('/server/api/v1/company/regionBUs',params),//单位接口
        genStaffPayroll:(params)=>apiPost('/server/api/v1/payroll/staff/genStaffPayroll',params),//生成工资单
    };

    export default api

