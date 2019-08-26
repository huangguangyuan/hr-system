<template>
  <div class="cityTemplate">
    <div class="addBtn-wrap">
      <el-button type="primary" @click="editTemplageFun(tableData)" v-if='isContent'>修 改</el-button>
    </div>
    <el-row :gutter="20" v-if='isContent'>
      <el-col :span="7">
        <div class="grid-content">应税及社保月份：<span>{{tableData.forMonthTxt}}</span></div>
        <!-- 0表示与当前出粮月份一致，其他为对应增减。例如（1：下月社保，-2上上月社保） -->
      </el-col>
      <el-col :span="7">
        <div class="grid-content">计粮周期起始日：<span>{{tableData.startDate}}号</span></div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content">计粮周期截止日：<span>{{tableData.endDateTxt}}</span></div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content">薪水发放日：<span>{{tableData.payDayTxt}}</span></div>
      </el-col>      
      <el-col :span="21">
        <div class="grid-content">备注：<span>{{tableData.remarks}}</span></div>
      </el-col>
    </el-row>
    <div class="noContent" v-else>
      暂无出粮周期数据
      <el-button type="primary" @click="editTemplageFun()">马上增加</el-button>
    </div>
    <!-- 修改 -->
    <el-dialog title="修改出粮周期数据" :visible.sync="isShowEdit" :close-on-click-modal="false" width="65%">
      <edit-payroll-period v-if='isShowEdit' v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></edit-payroll-period>
    </el-dialog>
  </div>
</template>
<script>
import editPayrollPeriod from './editPayrollPeriod.vue';
export default {
  name: "payrollPeriod",
  inject: ["reload"],
  data() {
    return {
      tableData: {},
      isShowEdit: false, //是否显示修改编辑页面
      isContent:false//是否有内容
    };
  },
  mounted() {
    this.payrollPeriodByBUCode(this.BUInfo.code);
  },
  methods: {
    // 获取出粮周期
    payrollPeriodByBUCode(BUCode) {
      var reqUrl = "/server/api/v1/payroll/payrollPeriodByBUCode";
      this.$http.post(reqUrl, {BUCode:this.BUInfo.code}).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data;
          this.isContent = true;
          this.tableData.forMonthTxt = this.forMonthTxt(this.tableData.forMonth);
          this.tableData.endDateTxt = this.endDateTxt(this.tableData.endDate);
          this.tableData.payDayTxt = this.endDateTxt(this.tableData.payDay);
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
    forMonthTxt(forMonth){
      if (forMonth == 0){
        return "当月";
      }else if (forMonth > 0){
        return "下 "+forMonth+" 月社保及税收";
      }else if (forMonth < 0){
        return "上"+Math.abs(forMonth)+"月社保及税收";
      }
    },
    endDateTxt(endDate){
      if (endDate >= 31){
        return "当月最后一天";
      }else{
        return endDate+" 号";
      }
    }
  },
  computed: {
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  },
  components: {
    editPayrollPeriod
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
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }
}
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .el-input-group {
    width: 500px;
  }
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






