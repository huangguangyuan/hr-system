<template>
  <div class="editLayer" v-if="!isLoading">
    <el-divider>月工资单信息</el-divider>
    <el-row :gutter="12">
      <el-col :span="8" >
        <el-card class="showWarning" shadow="always">状态：{{details.payroll.typeTxt}}</el-card>
      </el-col>
      <el-col :span="16" v-if="details.payroll.remarks != '' && details.payroll.typeId == 2" >
        <el-card class="showWarning" shadow="always">备注：{{details.payroll.remarks}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">年份：{{details.payroll.year}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">月份：{{details.payroll.month}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">总收入：{{details.payroll.totalAmount}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">非应税总额：{{details.payroll.notTaxableAmount}}</el-card>
      </el-col>   
      <el-col :span="8">
        <el-card shadow="always">强制MPF缴纳总额：{{details.MPFAmountSum}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">自愿MPF缴纳总额：{{details.MPFAmountSelfSum}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">已出非应税总金额：{{details.notTaxableAmountSum}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">已出应税总金额：{{details.totalAmountSum}}</el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">剩余应税总金额：{{details.payroll.totalAmount  - (details.MPFAmountSum + details.MPFAmountSelfSum + details.totalAmountSum + details.adjAmountSum)}}</el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">剩余非应税总金额：{{details.payroll.notTaxableAmount - details.notTaxableAmountSum}}</el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "payrollTimesMonthInfo",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isLoading:true,
      details:{}
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      this.payrollTimesSummary();
    },
    payrollTimesSummary() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesSummary";
      var data = {
        payrollCode:this.curInfo.payrollMainInfo.code
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.details = res.data.data;
          this.details.payroll = this.curInfo.payrollMainInfo;
          this.isLoading = false;
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style scoped lang="scss">
.editLayer{
  .el-card {
    margin-bottom: 12px;
  }
}

</style>


