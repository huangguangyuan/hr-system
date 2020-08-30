<template>
  <div class="staffPayrollDetail">
    <el-divider>工资表信息</el-divider>
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
        <el-card shadow="always">基本工资：{{details.salary}}</el-card>
      </el-col>
      <el-col :span="8" v-if="taxableItemsList && taxableItemsList.length > 0">
        <el-card shadow="always">应税项目总额：{{details.detail.taxableItemsAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="holidayList && holidayList.length > 0">
        <el-card shadow="always">请假应扣总额：-{{details.detail.holidayAmount}}</el-card>
      </el-col>
      <el-col :span="8" >
        <el-card shadow="always">收入总额：{{details.totalAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="SIList && SIList.length > 0">
        <el-card shadow="always">社保应扣总额：-{{details.detail.SIAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="HCList && HCList.length > 0">
        <el-card shadow="always">公积金应扣总额：-{{details.detail.HCAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="MPFList && MPFList.length > 0 && details.payrollTimesType === 1">
        <el-card shadow="always">MPF应扣总额：-{{details.detail.MPFAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="specialDeductionList && specialDeductionList.length > 0">
        <el-card shadow="always">专项附加扣除：-{{details.detail.specialDeductionAmount}}</el-card>
      </el-col>      
      <!-- <el-col :span="8" v-if="details.grossPay && details.grossPay != 0">
        <el-card shadow="always">税前金额：{{details.grossPay}}</el-card>
      </el-col> -->
      <el-col :span="8">
        <el-card shadow="always">应税总金额：{{details.taxableWages}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.taxAmount && details.taxAmount != 0">
        <el-card shadow="always">个人所得税：{{details.taxAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.netAmount && details.netAmount != 0">
        <el-card shadow="always">税后收入：{{details.netAmount}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always"  v-if="notTaxableItemsList && notTaxableItemsList.length > 0">非应税金额：{{details.detail.notTaxableItemsAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="claimList && claimList.length > 0">
        <el-card shadow="always">报销总额：{{details.detail.claimAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="details.adjAmount && details.adjAmount != 0">
        <el-card shadow="always">调整金额：{{details.adjAmount}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" v-if="details.reallyAmount && details.reallyAmount != 0">实发工资：{{ details.reallyAmount}}</el-card>
      </el-col>
      <template v-if="details.payrollTimesType === 2 && payrollTimes && payrollTimes.length != 0">
      <el-col :span="8"  >
        <el-card shadow="always">多次出粮总金额：{{ details.payrollTimesAmtSum}}</el-card>
      </el-col>
      <el-col :span="8" >
        <el-card shadow="always">多次出粮MPF缴纳：{{ details.MPFAmountSum}}</el-card>
      </el-col>
      <el-col :span="8" >
        <el-card shadow="always">多次出粮MPF自愿：{{ details.MPFAmountSelfSum}}</el-card>
      </el-col>
      </template>

    </el-row>
    <el-divider v-if="details.payrollTimesType === 2 && payrollTimes && payrollTimes.length != 0">多次出粮列表</el-divider>
    <el-table v-if="payrollTimes && payrollTimes.length > 0" :data="payrollTimes" stripe border show-summary>
      <el-table-column prop="reallyAmount" label="出粮金额"></el-table-column>
      <el-table-column prop="MPFAmount" label="MPF缴纳"></el-table-column>
      <el-table-column prop="MPFAmountSelf" label="MPF自愿"></el-table-column>
      <el-table-column prop="payDay" label="出粮日期"></el-table-column>
      <el-table-column prop="typeTxt" label="状态"></el-table-column>
    </el-table>
    <el-divider v-if="taxableItemsList && taxableItemsList.length > 0">应税项目清单</el-divider>
    <el-table  v-if="taxableItemsList && taxableItemsList.length > 0"  :data="taxableItemsList" stripe border show-summary>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="holidayList && holidayList.length > 0">请假清单</el-divider>
    <el-table v-if="holidayList && holidayList.length > 0"  :data="holidayList" stripe border show-summary>
      <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
      <el-table-column prop="totalDay" label="请假天数"></el-table-column>
      <el-table-column prop="totalAmount" label="扣除金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="HCList && HCList.length > 0">住房公积金清单</el-divider>
    <el-table v-if="HCList && HCList.length > 0"  :data="HCList" stripe border show-summary>
      <el-table-column prop="paymentTxt" label="付款对象"></el-table-column>
      <el-table-column prop="typeTxt" label="类型"></el-table-column>
      <el-table-column prop="payment" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="SIList && SIList.length > 0">社保清单</el-divider>
    <el-table v-if="SIList && SIList.length > 0"  :data="SIList" stripe border show-summary>
      <el-table-column prop="paymentTxt" label="付款对象"></el-table-column>
      <el-table-column prop="typeTxt" label="类型"></el-table-column>
      <el-table-column prop="payment" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="specialDeductionList && specialDeductionList.length > 0">专项附加扣除清单</el-divider>
    <el-table v-if="specialDeductionList && specialDeductionList.length > 0" :data="specialDeductionList" stripe border show-summary>
      <!-- <el-table-column prop="statusTxt" label="是否生效"></el-table-column> -->
      <el-table-column prop="typeIdTxt" label="类型"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
    </el-table>
    <el-divider v-if="details.payrollTimesType === 1 && MPFList && MPFList.length > 0">MPF清单</el-divider>
    <el-table v-if="MPFList && MPFList.length > 0" :data="MPFList" stripe border show-summary>
      <el-table-column prop="paymentTxt" label="类 型"></el-table-column>
      <!-- <el-table-column prop="typeTxt" label="类 型"></el-table-column> -->
      <el-table-column prop="payment" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="notTaxableItemsList && notTaxableItemsList.length > 0">非应税项目清单</el-divider>
    <el-table  v-if="notTaxableItemsList && notTaxableItemsList.length > 0" :data="notTaxableItemsList" stripe border show-summary>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="claimList && claimList.length > 0">报销清单</el-divider>
    <el-table v-if="claimList && claimList.length > 0" :data="claimList" stripe border show-summary>
      <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      <el-table-column prop="title" label="项目名称"></el-table-column>
      <el-table-column prop="totalAmount" label="报销金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="details.adjAmount && details.adjAmount != 0">调整项目</el-divider>
      <el-row :gutter="12" v-if="details.adjAmount && details.adjAmount != 0">
        <el-col :span="4" >
          <el-card class="showWarning" shadow="always">金额：{{details.adjAmount}}</el-card>
        </el-col>
        <el-col :span="20" >
          <el-card class="showWarning" shadow="always">备注：{{details.adjAmountRemarks}}</el-card>
        </el-col>
    </el-row>

  </div>
</template>
<script>
import {deductionTypeTxt,payrollListTypeTxt} from "@/lib/staticData.js";
export default {
  name: "staffPayrollDetail",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      details: {},
      HCList: [],
      SIList: [],
      allowanceList: [],
      claimList: [],
      holidayList: [],
      specialDeductionList: [],
      taxableItemsList: [],
      notTaxableItemsList: [],
      MPFList:[],
      payrollTimes:[],
      netAmount:0,
      reallyAmount:0,
      holidayTypes:[],
    };
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    arrSum(list,val){
      var n = 0;
      if (!list || list.length <= 0 || val == ""){
        return 0;
      }
      list.map(m=>{
        n += parseFloat(m[val]);
      })
      return parseFloat(n)
    },
    //获取详细信息
    async getDetails() {
      this.holidayTypes = await this.$myApi.getHolidaysTypeId();
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollDetail";
      var data = { code: this.curInfo.code };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.details = res.data.data;
          if (!this.details){
            return;
          }
          this.HCList = this.details.detail.HCList;
          this.SIList = this.details.detail.SIList;
          //this.allowanceList = this.details.detail.allowanceList;
          if (this.details.detail.claimList){
            this.claimList = this.details.detail.claimList.map(item => {
              item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
              return item;
            });
          }
          if (this.details.detail.holidayList){
            console.log(this.holidayTypes)
            console.log(this.details.detail.holidayList)
            this.holidayList = this.details.detail.holidayList.map(item => {
              item.typeIdTxt = this.holidayTypes.find(child => {
                  return child.typeId === item.detailTypeId.toString();
              }).val;
              item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
              return item;
            });
          }
          if (this.details.detail.specialDeductionList){
            this.specialDeductionList = this.details.detail.specialDeductionList.map(
            item => {
              item.statusTxt = item.status == 1 ? "生效" : "未生效";
              item.typeIdTxt = deductionTypeTxt(item.typeId);
              return item;
            });
          }
          this.taxableItemsList = this.details.detail.taxableItemsList;
          this.notTaxableItemsList = this.details.detail.notTaxableItemsList;
          this.MPFList = this.details.detail.MPFList || [];
          let payrollTimes = this.details.detail.payrollTimes || [];
          let payrollTimesAmtSum = 0,MPFAmountSum = 0,MPFAmountSelfSum = 0;
          for (let index = 0; index < payrollTimes.length; index++) {
            payrollTimes[index].reallyAmount = parseFloat(payrollTimes[index].totalAmount) + parseFloat(payrollTimes[index].adjAmount);
            payrollTimes[index].isInsuredTxt = payrollTimes[index].isInsured == 1?'是':'否';
            payrollTimes[index].payDay = this.$toolFn.timeFormat(payrollTimes[index].payDay,"yyyy-MM-dd");
            payrollTimes[index].typeTxt = payrollListTypeTxt(payrollTimes[index].typeId);
            payrollTimesAmtSum += payrollTimes[index].reallyAmount;
            MPFAmountSum += payrollTimes[index].MPFAmount;
            MPFAmountSelfSum += payrollTimes[index].MPFAmountSelf;
          }
          this.payrollTimes = payrollTimes;
          this.details.payrollTimesAmtSum = payrollTimesAmtSum;
          this.details.MPFAmountSum = MPFAmountSum;
          this.details.MPFAmountSelfSum = MPFAmountSelfSum;
          this.details.typeTxt = payrollListTypeTxt(this.details.typeId);
          this.details.netAmount = parseFloat(this.details.grossPay - this.details.taxAmount).toFixed(2);
          this.details.reallyAmount = parseFloat(parseFloat(this.details.netAmount) + parseFloat(this.details.notTaxableAmount) + this.details.adjAmount).toFixed(2);
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