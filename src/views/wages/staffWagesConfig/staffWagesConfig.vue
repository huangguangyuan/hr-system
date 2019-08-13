<template>
  <div class="staffWagesConfig">
    <el-page-header @back="goBack" content="个人详情页面"></el-page-header>
    <div class="header-info">
      <el-avatar :size="130" :src="circleUrl"></el-avatar>
      <div class="message">
        <h5>{{staffInfo.nameChinese}}</h5>
        <el-divider></el-divider>
        <p>
          <i class="hr-icon-xingbie"></i>
          <span>性别：{{staffInfo.genderTxt}}</span>
        </p>
        <p>
          <i class="hr-icon-ccgl-caozuozhuangtai-4"></i>
          <span>状态：{{staffInfo.statusTxt}}</span>
        </p>
        <p>
          <i class="hr-icon-shouji"></i>
          <span>手机：{{staffInfo.mobile}}</span>
        </p>
        <p>
          <i class="hr-icon-riqi"></i>
          <span>入职日期：{{staffInfo.dateOfJoining}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "staffWagesConfig",
  inject: ["reload"],
  props: ["staffInfo"],
  data() {
    return {
      circleUrl: "",
      activeName: "education",
      userRight:false
    };
  },
  mounted() {
    this.circleUrl = this.staffInfo.photo?this.staffInfo.photo:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
    this.activeName = this.$toolFn.sessionGet('staffNavActive')?this.$toolFn.sessionGet('staffNavActive'):'education';
  },
  methods: {
    // 返回
    goBack(){
      
    },
    handleClick(tab, event) {
      this.$toolFn.sessionSet('staffNavActive',tab.name);
    }
  },
  computed: {
    staffInfo(){
      return this.$store.state.staffModule.staffInfo;
    }
  },
  components: {
      
  }
};
</script>
<style scoped lang="scss">
.staffWagesConfig{
  .header-info{
    margin: 20px auto 0;box-sizing: border-box;padding: 30px 50px;display: flex;align-items: center;
    border-radius: 10px;color: #ffffff;background-color: #439145;
    .message{
      flex: 1;box-sizing:border-box;padding: 0 0 0 30px;
      h5{font-size: 22px;}
      p{
        font-size: 14px;margin: 8px auto 0;
        span{margin-left: 10px;}
        i{font-weight: 500;font-size: 15px;}
      }
    }
  }
  .el-tabs{padding: 0 50px;margin: 20px auto 0;}
}
</style>






