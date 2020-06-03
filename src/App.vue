<!--
 * @Author: your name
 * @Date: 2019-07-21 14:51:54
 * @LastEditTime: 2020-04-25 16:54:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \hr-system\src\App.vue
 -->
<template>
  <div id="app">
    <router-view v-if='isRouterAlive'></router-view>
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
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    }
  }
}
</script>
