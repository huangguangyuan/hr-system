<template>
  <div class="cityTemplate">
    <div class="addBtn-wrap">
      <el-button type="primary" @click="editTemplageFun(tableData)" v-if='isContent'>修 改</el-button>
    </div>
    <el-row :gutter="20" v-if='isContent'>
      <el-col :span="7">
        <div class="grid-content">每年可享有薪年假天数：<span>{{tableData.annualLeaveEntitled}}</span></div>
        <!-- 0表示与当前出粮月份一致，其他为对应增减。例如（1：下月社保，-2上上月社保） -->
      </el-col>
      <el-col :span="7">
        <div class="grid-content">自定义年假清空日期：<span>{{tableData.annualLeaveWriteOffDate}}</span></div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content">年假清空后可保留天数：<span>{{tableData.annualLeaveRetain}}</span></div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content">年假清空后可保留天数清空日期：<span>{{tableData.annualLeaveRetainClearDate}}</span></div>
      </el-col>      
      <el-col :span="21">
        <div class="grid-content">备注：<span>{{tableData.remarks}}</span></div>
      </el-col>
    </el-row>
    <div class="noContent" v-else>
      暂无年假配置 
      <el-button type="primary" @click="editTemplageFun()">马上增加</el-button>
    </div>
    <!-- 修改 -->
    <el-dialog title="年假配置" :visible.sync="isShowEdit" :close-on-click-modal="false" width="65%">
      <edit-annual-leave v-if='isShowEdit' v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></edit-annual-leave>
    </el-dialog>
  </div>
</template>
<script>
import editAnnualLeave from './editAnnualLeave.vue';
export default {
  name: "annualLeave",
  inject: ["reload"],
  data() {
    return {
      tableData: {},
      isShowEdit: false, //是否显示修改编辑页面
      isContent:false//是否有内容
    };
  },
  mounted() {
    this.annualLeaveByBUCode(this.BUInfo.code);
  },
  methods: {
    // 获取出粮周期
    annualLeaveByBUCode(BUCode) {
      var reqUrl = "/server/api/v1/bu/annualLeave";
      this.$myApi.http.post(reqUrl, {BUCode:this.BUInfo.code}).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data;
          this.tableData.annualLeaveWriteOffDate = this.$toolFn.timeFormat(this.tableData.annualLeaveWriteOffDate,"yyyy-MM-dd")
          this.tableData.annualLeaveRetainClearDate = this.$toolFn.timeFormat(this.tableData.annualLeaveRetainClearDate,"yyyy-MM-dd")
          this.isContent = true;
        }
      });
    },
    // 编辑出粮周期
    editTemplageFun(res){
      res = res||{BUCode:this.BUInfo.code}
      this.curInfo = res;
      this.isShowEdit = true;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowEdit = false;
    },
  },
  computed: {
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  },
  components: {
    editAnnualLeave
  }
};
</script>
<style scoped lang="scss">
.grid-content {
  padding: 10px 20px;
  background-color: #d3dce6;
  margin-bottom: 15px;
  border-radius: 8px;
  font-size: 14px;
  color: #909399;
  span{
    font-size: 14px;
    font-weight: bold;
    color: #666;
  }
}
.selectCityCode {
  width: 220px;
  margin-right: 10px;
}
.noContent{
  line-height: 200px;text-align: center;color: #d3dce6;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.addBtn-wrap {
  margin: 10px auto 30px;
  display: flex;
  justify-content: flex-start;
}
</style>






