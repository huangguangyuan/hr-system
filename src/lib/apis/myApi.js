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
        http:request,
        post:(url,params)=>apiMain(url,params),
        requestPost:(url,params)=>requestPost(url,params),
        requestGet:(url,params)=>requestGet(url,params),
        getClaimTypeId:()=>apiMain('/server/api/v1/staff/claim/getClaimTypeId',{isCache:true}),//获取报销类型
        getBUClaimType:()=>apiMain('/server/api/v1/staff/claim/getBUClaimType',{isCache:true}),//获取单位报销类型
        staffClaim:(params)=>apiMain('/server/api/v1/staff/claim/staffClaim',params),//获取报销详情
        getHolidaysTypeId:()=>apiMain('/server/api/v1/staff/holidaysApply/getHolidaysApplyTypeId',{isCache:true}),//获取假期类型
        staffHolidays:(params)=>apiMain('/server/api/v1/staff/holidaysApply/staffHolidaysApply',params),//获取假期审批详情
        companys:(params)=>apiMain('/server/api/v1/company/companys',params),//公司接口
        regionBUs:(params)=>apiMain('/server/api/v1/company/regionBUs',params),//单位接口
        genStaffPayroll:(params)=>apiPost('/server/api/v1/payroll/staff/genStaffPayroll',params),//生成工资单
    };

    export default api

