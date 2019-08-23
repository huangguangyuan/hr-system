<template>
  <div class="staffPayrollDetail">
    <el-divider>工资表信息</el-divider>
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="always" v-if="details.payrollInfo">中文名：{{details.payrollInfo.nameChinese}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          shadow="always"
          v-if="details.payrollInfo"
        >英文名：{{details.payrollInfo.nameEnglish || '暂无'}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" v-if="details.payrollInfo">身份证：{{details.payrollInfo.IDNo || '暂无'}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" v-if="details.payrollInfo">工资总额：{{details.payrollInfo.salaryAmout}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          shadow="always"
          v-if="details.payrollInfo"
        >税款起征点：{{details.payrollInfo.taxThreshold}}</el-card>
      </el-col>
    </el-row>
    <el-table :data="details.payrollInfo.salaryItems" stripe style="width: 100%">
      <el-table-column prop="amount" label="金 额"></el-table-column>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="taxable" label="是否应税"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "staffPayrollDetail",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      details: {}
    };
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    //获取详细信息
    getDetails() {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollDetail";
      var data = { code: this.curInfo.code };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.details = res.data.data;
          console.log(this.details);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.staffPayrollDetail {
  .el-card {
    margin-bottom: 12px;
  }
}
</style>