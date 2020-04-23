<template>
  <div class="editLayer" v-if="isLoding">
    <el-divider>月工资表信息</el-divider>
    <el-row :gutter="12">
      <el-col :span="8" >
        <el-card class="showWarning" shadow="always">状态：{{details.typeTxt}}</el-card>
      </el-col>
      <el-col :span="16" v-if="details.remarks != '' && details.typeId == 2" >
        <el-card class="showWarning" shadow="always">备注：{{details.remarks}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">年份：{{details.year}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">月份：{{details.month}}</el-card>
      </el-col>
      <!-- <el-col :span="8">
        <el-card shadow="always">基本工资：{{details.salary}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.taxableItemsAmount && details.taxableItemsAmount != 0">
        <el-card shadow="always">应税项目总额：{{details.taxableItemsAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.claimAmount && details.claimAmount != 0">
        <el-card shadow="always">请假应扣总额：-{{details.claimAmount}}</el-card>
      </el-col>
      <el-col :span="8" >
        <el-card shadow="always">收入总额：{{details.totalAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.SIAmount && details.SIAmount != 0">
        <el-card shadow="always">社保应扣总额：-{{details.SIAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.HCAmount && details.HCAmount != 0">
        <el-card shadow="always">公积金应扣总额：-{{details.HCAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.MPFAmount && details.MPFAmount != 0">
        <el-card shadow="always">MPF应扣总额：-{{details.MPFAmount}}</el-card>
      </el-col>      
      <el-col :span="8" v-if="details.grossPay && details.grossPay != 0">
        <el-card shadow="always">税前金额：{{details.grossPay}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.taxableWages && details.taxableWages != 0">
        <el-card shadow="always">应税金额：{{details.taxableWages}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.taxAmount && details.taxAmount != 0">
        <el-card shadow="always">个人所得税：{{details.taxAmount}}</el-card>
      </el-col> -->
      <!-- <el-col :span="8" v-if="details.netAmount && details.netAmount != 0">
        <el-card shadow="always">税后收入：{{details.netAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.notTaxableItemsAmount && details.notTaxableItemsAmount != 0">
        <el-card shadow="always">非应税金额：{{details.notTaxableItemsAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.claimAmount && details.claimAmount != 0">
        <el-card shadow="always">报销总额：{{details.claimAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.adjAmount && details.adjAmount != 0">
        <el-card shadow="always">调整金额：{{details.adjAmount}}</el-card>
      </el-col> -->
      <el-col :span="8" v-if="details.reallyAmount && details.reallyAmount != 0">
        <el-card shadow="always">实发工资：{{details.reallyAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.reallyAmountSum && details.reallyAmountSum != 0">
        <el-card shadow="always">多次出粮总金额：{{details.reallyAmountSum}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">剩余出粮总金额：{{details.reallyAmount - details.reallyAmountSum}}</el-card>
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
      isLoding:true,
      details:{}
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      this.details = this.curInfo;
      this.payrollTimesSummary();
    },
    payrollTimesSummary() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesSummary";
      var data = {
        payrollCode:this.details.code
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.details.reallyAmountSum = res.data.data.reallyAmountSum;
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


