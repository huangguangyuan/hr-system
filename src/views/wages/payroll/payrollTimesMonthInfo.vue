<template>
  <div class="editLayer" v-if="isLoading">
    <el-divider>月工资单信息</el-divider>
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
      <el-col :span="8">
        <el-card shadow="always">总收入：{{details.totalAmount}}</el-card>
      </el-col>     
      <el-col :span="8">
        <el-card shadow="always">MPF总额：{{details.MPFAmount}}</el-card>
      </el-col>
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


