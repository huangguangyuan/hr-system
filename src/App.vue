<template>
  <div id="app">
    <router-view v-if='isRouterAlive && isShow'></router-view>
    <div v-if='!isShow' class="showTip">
      请使用谷歌浏览器，谢谢！
    </div>
  </div>
</template>

<script>

export default { 
  name: 'App', 
  provide(){
    return {
      reload:this.reload
    }
  },
  data(){
    return {
      isShow:true,
      isRouterAlive:true
    }
  },
  mounted(){
    if (this.getBrowser() === "Google Chrome or Chromium"){
    }else{
      this.isShow = false;
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    },
    getBrowser(){
        var browser = null
        var sUsrAg = window.navigator.userAgent
        // The order matters here, and this may report false positives for unlisted browsers.
        if (sUsrAg.indexOf('Firefox') > -1) {
          browser = 'Mozilla Firefox'
          // 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'
        } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
          browser = 'Opera'
          // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106'
        } else if (sUsrAg.indexOf('Trident') > -1) {
          browser = 'Microsoft Internet Explorer'
          // 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko'
        } else if (sUsrAg.indexOf('Edge') > -1) {
          browser = 'Microsoft Edge'
          // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299'
        } else if (sUsrAg.indexOf('Chrome') > -1) {
          browser = 'Google Chrome or Chromium'
          // 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36'
        } else if (sUsrAg.indexOf('Safari') > -1) {
          browser = 'Apple Safari'
          // 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306'
        } else {
          browser = 'unknown'
        }
        return browser
    }
  }
}
</script>

<style scoped>
.showTip{
  padding: 150px 0 0 0;
  text-align: center;
}
</style>