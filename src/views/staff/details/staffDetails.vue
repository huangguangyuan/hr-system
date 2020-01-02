<template>
  <div class="staffDetails">
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
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="教育资历" name="education">
        <span slot="label"><i class="hr-icon-zinvjiaoyu"></i> 教育资历</span>
        <education :userRight_props="userRight"></education>
      </el-tab-pane>
      <el-tab-pane label="工作经历" name="experience">
        <span slot="label"><i class="hr-icon-kehudingdan"></i> 工作经历</span>
        <experience :userRight_props="userRight"></experience>
      </el-tab-pane>
      <el-tab-pane label="晋升记录" name="promotion">
        <span slot="label"><i class="hr-icon-tongji"></i> 晋升记录</span>
        <promotion :userRight_props="userRight"></promotion>
      </el-tab-pane>
      <el-tab-pane label="合 约" name="contract">
        <span slot="label"><i class="hr-icon-qianyue"></i> 合 约</span>
        <contract :userRight_props="userRight"></contract>
      </el-tab-pane>
      <el-tab-pane label="社交媒体" name="media">
        <span slot="label"><i class="hr-icon-yingxiaoshangjilei"></i> 社交媒体</span>
        <socialMedia :userRight_props="userRight"></socialMedia>
      </el-tab-pane>
      <el-tab-pane label="警告信" name="warning">
        <span slot="label"><i class="hr-icon-jinggaolei"></i> 警告信</span>
        <warning :userRight_props="userRight"></warning>
      </el-tab-pane>
      <el-tab-pane label="年假明细" name="leaves">
        <span slot="label"><i class="el-icon-odometer"></i> 年假明细</span>
        <leaves :userRight_props="userRight"></leaves>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import education from '../education/education.vue';     
import experience from '../experience/experience.vue'    
import promotion from '../promotion/promotion.vue'
import contract from '../contract/contract.vue'
import socialMedia from '../socialMedia/socialMedia.vue'
import warning from '../warning/warning.vue'
import leaves from '../leaves/leaves.vue'
export default {
  name: "staffDetails",
  inject: ["reload"],
  props: ["userRight_props"],
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
      this.$store.commit({
        type:'getStaffInfo',
        isShowDetails:false
      })
    },
    handleClick(tab, event) {
      this.$toolFn.sessionSet('staffNavActive',tab.name);
    }
  },
  computed: {
    staffInfo(){
      this.userRight = this.userRight_props;
      return this.$store.state.staffModule.staffInfo;
    }
  },
  components: {
    education,experience,promotion,contract,socialMedia,warning,leaves
  }
};
</script>
<style scoped lang="scss">
.staffDetails{
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






