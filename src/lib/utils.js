let toolFn = {
    // 转换时间格式方法
    timeFormat:(time)=>{
        var dateee = new Date(time).toJSON();
        var newTime = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        return newTime;
    }
}

export default {
    install:function(vm){
        vm.prototype.$toolFn = toolFn;
    },
    toolFn
}






