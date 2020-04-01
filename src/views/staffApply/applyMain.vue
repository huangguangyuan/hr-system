<template>
  <div class="applyMain wrap">
    <div class="header-info">
      <el-avatar :size="130" :src="circleUrl"></el-avatar>
      <div class="message">
        <h5>{{staffInfo.nameChinese}}</h5>
        <el-divider></el-divider>
        <p>
          <i class="hr-icon-xingbie"></i>
          <span>性别：{{staffInfo.gender}}</span>
        </p>
        <p>
          <i class="hr-icon-ccgl-caozuozhuangtai-4"></i>
          <span>状态：{{staffInfo.workStatus == 1?'在职':'离职'}}</span>
        </p>
        <p>
          <i class="hr-icon-shouji"></i>
          <span>手机：{{staffInfo.mobile}}</span>
        </p>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="报销申请" name="claim">
        <span slot="label"><i class="hr-icon-baoxiaoshenqing"></i> 报销申请</span>
        <claim-list :staffCode_props="staffCode" ></claim-list>
      </el-tab-pane>
      <el-tab-pane label="请假申请" name="holidaysApply">
        <span slot="label"><i class="hr-icon-qingjiashenqing"></i> 请假申请</span>
        <holidays-apply-list :staffCode_props="staffCode"></holidays-apply-list>
      </el-tab-pane>
      <el-tab-pane label="假期统计" name="holidaysStat">
        <span slot="label"><i class="hr-icon-qingjiashenqing"></i> 假期统计</span>
        <staff-holiday-stat :staffCode_props="staffCode"></staff-holiday-stat>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import claimList from './claim/claimList.vue';
import holidaysApplyList from './holidaysApply/holidaysApplyList.vue'
import staffHolidayStat from './staffHolidayStat/staffHolidayStat.vue'
export default {
  name: "applyMain",
  inject: ["reload"],
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      staffInfo:{},
      activeName:'claim',
      staffCode: "",
      userInfo:{},
      show:false
    };
  },
  beforeMount(){
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.roleTypeId == 1 ){
      this.staffCode = this.userInfo.staffCode;
    }else if(this.userInfo.roleTypeId == 2 ){
    }
    this.getStaffInfo();
    this.activeName = this.$toolFn.sessionGet('applyActiveName') || 'claim'
  },
  mounted() {
  },
  methods: {
    // 获取员工信息
    getStaffInfo(){
        var reqUrl = '/server/api/v1/staff/getByCode';
        var data = {code:this.staffCode}
        this.$myApi.http.post(reqUrl,data).then(res => {
            if(res.data.code == 0){
                this.staffInfo = res.data.data;
            }else{
                this.$message.error('error'+res.data.code);
            }
        })
    },
    handleClick(res){
      this.$toolFn.sessionSet('applyActiveName',res.name);
    }
  },
  computed: {
    
  },
  components: {
    claimList,holidaysApplyList,staffHolidayStat
  }
};
</script>
<style scoped lang="scss">
.applyMain{
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






