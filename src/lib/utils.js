let toolFn = {
    // 转换时间格式方法
    timeFormat:(time,fmt)=>{
        if (!time)return;
        var dateee = new Date(time).toJSON();
        var newTime = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        if (fmt && fmt != ""){
            newTime =  toolFn.formatTime(newTime,fmt);
        }
        return newTime;
    },
    formatTime:(time,fmt)=>{
        if (!time)return;
        time = new Date(time);
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': time.getMonth() + 1,
            'd+': time.getDate(),
            'h+': time.getHours(),
            'm+': time.getMinutes(),
            's+': time.getSeconds(),
            "q+" : Math.floor((time.getMonth()+3)/3), //季度   
            "S"  : time.getMilliseconds()  
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : toolFn.padLeftZero(str));
            }
        }
        return fmt;
    },
    padLeftZero(str) {
        return ('00' + str).substr(str.length);
    },
    // ==================sessionsTorage设置缓存================
    // 设置缓存
    sessionSet: function (name, data) {
        sessionStorage.removeItem(name)
        sessionStorage.setItem(name, JSON.stringify(data))
    },
    // 获取缓存
    sessionGet: function (name) {
        return JSON.parse(sessionStorage.getItem(name))
    },
    // 清除缓存
    sessionRemove: function (name) {
        sessionStorage.removeItem(name)
    },
    // ==================localStorage设置缓存==================
    // 设置缓存
    localSet: function (name, data) {
        localStorage.removeItem(name)
        localStorage.setItem(name, JSON.stringify(data))
    },
    // 获取缓存
    localGet: function (name) {
        return JSON.parse(localStorage.getItem(name))
    },
    // 清除缓存
    localRemove: function (name) {
        localStorage.removeItem(name)
    },
    isNotOrEmpty:function(str){
        if (!str || str == "" || str == "null"){
            return true;
        }
        return false;
    },
    searchFun:function(list, search) {
      let newList = [];
      for (let i = 0; i < list.length; i++) {
        for (let key in list[i]) {
          if (search.searchField.indexOf(key) >= 0) {
            if (
              list[i][key] != undefined &&
              list[i][key] != "" &&
              list[i][key].toString().includes(search.searchKey)
            ) {
              newList.push(list[i]);
              break;
            }
          }
        }
      }
      return newList;
    },
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    },
    curUserFn:()=>{ 
        toolFn.curUser = toolFn.localGet("userInfo");
        return toolFn.curUser;
    },
}
toolFn.curUser = {};
export default toolFn






