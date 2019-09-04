

//常用请求缓存
export default function (url,data,vue) {
    let name = encodeURIComponent(url);
    let res_data = sessionStorage.getItem(name);
    if (!res_data || res_data == "" || 1==1){
        return Promise.resolve(
            vue.$http.post(url, data||{}).then(res => {
                if (res.data.code == 0) {
                    vue.$toolFn.sessionSet(name,JSON.stringify(res.data.data));
                    return res.data.data;
                }else{
                    return;
                }
            }));
    }else{
        return JSON.parse(res_data);
    }
}
