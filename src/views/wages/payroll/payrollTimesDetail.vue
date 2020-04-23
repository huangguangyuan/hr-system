
<template>
  <div class="staffPayrollDetail">
    <el-divider>详细信息</el-divider>
    <el-row :gutter="12">
      <el-col :span="24" >
        <el-card class="showWarning" shadow="always">状态：{{item.typeTxt}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">总额：{{item.totalAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-show="item.adjAmount > 0">
        <el-card shadow="always">调整金额：{{item.adjAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-show="item.reallyAmount > 0">
        <el-card shadow="always">实际金额：{{item.reallyAmount}}</el-card>
      </el-col>      
      <el-col :span="8" v-show="item.adjAmountTime && item.adjAmountTime != ''">
        <el-card shadow="always">调整时间：{{item.adjAmountTime}}</el-card>
      </el-col>
      <el-col :span="8" v-show="item.adjAmountHrCode">
        <el-card shadow="always">调整人：{{item.adjAmountHrName}}</el-card>
      </el-col>
      <el-col :span="8" >
        <el-card shadow="always">包含缴纳：{{item.isInsuredTxt}}</el-card>
      </el-col>
      <el-col :span="8" v-show="item.payDay && item.payDay != ''">
        <el-card shadow="always">出粮日期：{{item.payDay}}</el-card>
      </el-col>      
      <el-col :span="8" v-show="item.confirmTime && item.confirmTime != ''">
        <el-card shadow="always">确认日期：{{item.confirmTime}}</el-card>
      </el-col>
      <el-col :span="8" v-show="item.confirmHrCode">
        <el-card shadow="always">确认人：{{item.confirmHrName}}</el-card>
      </el-col>
      <el-col :span="24" v-show="item.remarks">
        <el-card shadow="always" class="showWarning">备注：{{item.remarks}}</el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {payrollListTypeTxt} from "@/lib/staticData.js";
export default {
  name: "payrollTimesDetail",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      item: {}
    };
  },
  mounted() {
    this.getItem();
  },
  methods: {
    //获取详细信息
    async getItem() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesItem";
      var data = {
        id: this.curInfo.id
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.item = res.data.data;
          this.item.reallyAmount = parseFloat(this.item.totalAmount) + parseFloat(this.item.adjAmount);
          this.item.isInsuredTxt = this.item.isInsured == 1?'是':'否';
          this.item.payDay = this.$toolFn.timeFormat(this.item.payDay,'yyyy-MM-dd');
          this.item.adjAmountTime = this.$toolFn.timeFormat(this.item.adjAmountTime,'yyyy-MM-dd');
          this.item.confirmTime = this.$toolFn.timeFormat(this.item.confirmTime,'yyyy-MM-dd');
          this.item.typeTxt = payrollListTypeTxt(this.item.typeId);
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
  .showWarning{
    border: 1px solid #F7F709;
  }
}
</style>