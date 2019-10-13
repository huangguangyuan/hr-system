<template>
  <div class="setting">
    <el-page-header @back="goBack" content="单位设置"></el-page-header>
    <div class="header-info">
      <el-avatar :size="130" :src="BUInfo.logo" fit='scale-down'></el-avatar>
      <p class="BUName">{{BUInfo.name}}</p>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="编辑城市" name="city">
        <span slot="label"><i class="hr-icon-zinvjiaoyu"></i>所在城市</span>
        <city-template></city-template>
      </el-tab-pane>
      <el-tab-pane label="粮 期" name="payroll">
        <span slot="label"><i class="hr-icon-zinvjiaoyu"></i> 粮 期</span>
        <payroll-period></payroll-period>
      </el-tab-pane>
      <el-tab-pane label="社保方案" name="insuredScheme">
        <span slot="label"><i class="hr-icon-zinvjiaoyu"></i> 社保方案</span>
        <scheme-list></scheme-list>
      </el-tab-pane>
      <el-tab-pane label="薪资应税项目" name="salaryItems">
        <span slot="label"><i class="hr-icon-zinvjiaoyu"></i>薪资应税项目</span>
        <salary-items></salary-items>
      </el-tab-pane>
      <!-- <el-tab-pane label="津贴项目" name="claims">
        <span slot="label"><i class="hr-icon-zinvjiaoyu"></i>津贴项目</span>
        <allowances></allowances>
      </el-tab-pane> -->
      <el-tab-pane label="报销项目" name="claims">
        <span slot="label"><i class="hr-icon-zinvjiaoyu"></i>报销项目</span>
        <claims></claims>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import cityTemplate from '../cityTemplate/cityTemplate.vue'
import payrollPeriod from '../payrollPeriod/payrollPeriod.vue'
import salaryItems from '../salaryItems/salaryItems.vue'
// import allowances from '../allowances/allowances.vue'
import claims from '../claim/claims.vue'
import schemeList from '../insuredScheme/schemeList.vue'
export default {
  name: "setting",
  inject: ["reload"],
  data() {
    return {
      circleUrl: "",
      activeName: "city"
    };
  },
  mounted() {
    this.activeName = this.$toolFn.sessionGet('BUsettingActive')?this.$toolFn.sessionGet('BUsettingActive'):'city';
  },
  methods: {
    // 返回
    goBack(){
      this.$store.commit({
        type:'getBUInfo',
        isShowSetting:false
      })
    },
    handleClick(tab, event) {
      this.$toolFn.sessionSet('BUsettingActive',tab.name);
    }
  },
  computed: {
    BUInfo(){
      return this.$store.state.BUModule.BUInfo;
    }
  },
  components: {
    cityTemplate,payrollPeriod,salaryItems,schemeList,claims
  }
};
</script>
<style scoped lang="scss">
.setting{
  .header-info{
    margin: 20px auto 0;box-sizing: border-box;padding: 30px 50px;display: flex;align-items: center;justify-content: center;flex-direction: column;border-radius: 10px;color: #ffffff;background-color: #234965;
    .BUName{
      margin-top: 20px;
    }
  }
  .el-tabs{margin: 20px auto 0;}
}
</style>






