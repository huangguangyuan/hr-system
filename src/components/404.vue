<template>
  <div class="error-page" v-if="isShow">
      <div class="error-code">4<span>0</span>4</div>
      <div class="error-desc">啊哦~ 没有找到对应的页面哦</div>
      <div class="error-handle">
          <!-- <router-link to="/">
            <el-button type="primary" size="large">返回首页</el-button>
          </router-link> -->
          <el-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</el-button>
            <el-button
            class="error-btn"
            type="primary"
            size="large"
            @click="goHome">回到首页</el-button>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false, //是否显示
    }
  },
  mounted(){
      const addRedirectKey = ['approvalClaim','approvalHolidays'];
      let isRedirect = false;
      addRedirectKey.map(m=>{
          if (this.$router.currentRoute.fullPath.indexOf(m) >=0){
              isRedirect = true
              return;
          }
      })
      if (isRedirect){
          this.$router.replace({name:"login",query: {redirect: this.$router.currentRoute.fullPath}})
      }
      this.isShow = true
  },
  methods: {
      goBack(){
        this.$router.go(-1);
      },
      goHome () {
        this.$router.push({ path: '/' })
    }
  }
}
</script>
<style scoped>
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    .error-code{
        line-height: 1;
        font-size: 250px;
        font-weight: bolder;
        color: #f02d2d;
    }
    .error-code span{
        color: #00a854;
    }
    .error-desc{
        font-size: 30px;
        color: #777;
    }
    .error-handle{
        margin-top: 30px;
        padding-bottom: 200px;
    }
</style>
