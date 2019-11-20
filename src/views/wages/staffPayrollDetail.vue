<template>
  <div class="staffPayrollDetail">
    <el-divider>工资表信息</el-divider>
    <el-row :gutter="12">
      <el-col :span="8" >
        <el-card class="showWarning" shadow="always">状态：{{typeIdTxt(details.typeId)}}</el-card>
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
      <!-- <el-col :span="8" v-if="allowanceList && allowanceList.length > 0">
        <el-card shadow="always">津贴总额：{{details.detail.allowanceAmount}}</el-card>
      </el-col> -->
      <el-col :span="8" v-if="taxableItemsList && taxableItemsList.length > 0">
        <el-card shadow="always">应税项目总额：{{details.detail.taxableItemsAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="holidayList && holidayList.length > 0">
        <el-card shadow="always">请假应扣总额：-{{details.detail.claimAmount}}</el-card>
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
      <el-col :span="8" v-if="MPFList && MPFList.length > 0">
        <el-card shadow="always">MPF应扣总额：-{{details.detail.MPFAmount}}</el-card>
      </el-col>      
      <el-col :span="8">
        <el-card shadow="always">税前金额：{{details.grossPay}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">应税金额：{{details.taxableWages}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">个人所得税：{{details.taxAmount}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">税后收入：{{netAmount}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always"  v-if="notTaxableItemsList && notTaxableItemsList.length > 0">非应税金额：{{details.detail.notTaxableItemsAmount}}</el-card>
      </el-col>
      <el-col :span="8" v-if="claimList && claimList.length > 0">
        <el-card shadow="always">报销总额：{{details.detail.claimAmount}}</el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="always">实发工资：{{reallyAmount}}</el-card>
      </el-col>
    </el-row>
    <!-- <el-divider v-if="allowanceList && allowanceList.length > 0">津贴清单</el-divider>
    <el-table v-if="allowanceList && allowanceList.length > 0" :data="allowanceList" stripe border show-summary>
      <el-table-column prop="name" label="名 称"></el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
    </el-table> -->
    <el-divider v-if="taxableItemsList && taxableItemsList.length > 0">应税项目清单</el-divider>
    <el-table  v-if="taxableItemsList && taxableItemsList.length > 0"  :data="taxableItemsList" stripe border show-summary>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="notTaxableItemsList && notTaxableItemsList.length > 0">非应税项目清单</el-divider>
    <el-table  v-if="notTaxableItemsList && notTaxableItemsList.length > 0" :data="notTaxableItemsList" stripe border show-summary>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="claimList && claimList.length > 0">报销清单</el-divider>
    <el-table v-if="claimList && claimList.length > 0" :data="claimList" stripe border show-summary>
      <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
      <el-table-column prop="totalAmount" label="报销金额(元)"></el-table-column>
    </el-table>
    <el-divider v-if="holidayList && holidayList.length > 0">请假清单</el-divider>
    <el-table v-if="holidayList && holidayList.length > 0"  :data="holidayList" stripe border show-summary>
      <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
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
    <el-divider v-if="MPFList && MPFList.length > 0">MPF清单</el-divider>
    <el-table v-if="MPFList && MPFList.length > 0" :data="MPFList" stripe border show-summary>
      <el-table-column prop="paymentTxt" label="类 型"></el-table-column>
      <!-- <el-table-column prop="typeTxt" label="类 型"></el-table-column> -->
      <el-table-column prop="payment" label="金额(元)"></el-table-column>
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
      netAmount:0,
      reallyAmount:0
    };
  },
  mounted() {
    this.getDetails();

  },
  methods: {
    //0未审核1通过2有疑问，需重新审查
    typeIdTxt(typeId){
      let r = '未审核';
      if (typeId == 1){
        r = '已确认';
      }else if (typeId == 2){
        r = '退回'
      }
      return r;
    },
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
    getDetails() {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollDetail";
      var data = { code: this.curInfo.code };
      this.$http.post(reqUrl, data).then(res => {
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
            this.holidayList = this.details.detail.holidayList.map(item => {
              item.typeIdTxt = item.details[0].typeId == 1 ? "生效" : "未生效";
              switch (item.details[0].typeId) {
                case 1:
                  item.typeIdTxt = "事假";
                  break;
                case 2:
                  item.typeIdTxt = "年假";
                  break;
                case 3:
                  item.typeIdTxt = "病假";
                  break;
                case 4:
                  item.typeIdTxt = "婚假";
                  break;
                case 5:
                  item.typeIdTxt = "产假/陪产假";
                  break;
                case 6:
                  item.typeIdTxt = "丧假";
                  break;
                case 50:
                  item.typeIdTxt = "其他";
                  break;
              }
              item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
              return item;
            });
          }
          if (this.details.detail.specialDeductionList){
            this.specialDeductionList = this.details.detail.specialDeductionList.map(
            item => {
              item.statusTxt = item.status == 1 ? "生效" : "未生效";
              switch (item.typeId) {
                case 1:
                  item.typeIdTxt = "赡养老人";
                  break;
                case 2:
                  item.typeIdTxt = "子女教育";
                  break;
                case 3:
                  item.typeIdTxt = "房贷利息";
                  break;
                case 4:
                  item.typeIdTxt = "住房租金";
                  break;
                case 5:
                  item.typeIdTxt = "继续教育";
                  break;
                case 6:
                  item.typeIdTxt = "大病医疗";
                  break;
              }
              return item;
            });
          }

          this.taxableItemsList = this.details.detail.taxableItemsList;
          this.notTaxableItemsList = this.details.detail.notTaxableItemsList;
          this.MPFList = this.details.detail.MPFList || [];
          //console.log(this.details);
          
          this.netAmount = parseFloat(this.details.grossPay - this.details.taxAmount).toFixed(2);
          this.reallyAmount = parseFloat(parseFloat(this.netAmount) + parseFloat(this.details.notTaxableAmount) + parseFloat(this.arrSum(this.claimList,'totalAmount'))).toFixed(2);
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