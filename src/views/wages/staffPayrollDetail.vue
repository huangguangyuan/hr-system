<template>
  <div class="staffPayrollDetail">
    <el-divider>工资表信息</el-divider>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="always">年份：{{details.year}}</el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">月份：{{details.month}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">基本工资：{{details.salary}}</el-card>
      </el-col>
      <el-col :span="8" v-if="allowanceList.length > 0">
        <el-card shadow="always">津贴总额：{{arrSum(allowanceList,'amount')}}</el-card>
      </el-col>
      <el-col :span="8" v-if="taxableItemsList.length > 0">
        <el-card shadow="always">应税项目总额：{{arrSum(taxableItemsList,'amount')}}</el-card>
      </el-col>
      <el-col :span="8" v-if="claimList.length > 0">
        <el-card shadow="always">报销总额：{{arrSum(claimList,'totalAmount')}}</el-card>
      </el-col>
      <el-col :span="8" v-if="holidayList.length > 0">
        <el-card shadow="always">请假总额：-{{arrSum(holidayList,'totalAmount')}}</el-card>
      </el-col>
      <el-col :span="8" >
        <el-card shadow="always">收入总额：{{details.totalAmount}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">应纳税工资：{{details.taxAmount}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">税前金额：{{details.grossPay}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">个人所得税：{{details.taxableWages}}</el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">不应税金额：{{details.notTaxableAmount}}</el-card>
      </el-col>
    </el-row>
    <el-divider>津贴清单</el-divider>
    <el-table :data="allowanceList" stripe border show-summary>
      <el-table-column prop="name" label="名 称"></el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider>应税项目清单</el-divider>
    <el-table :data="taxableItemsList" stripe border show-summary>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider>报销清单</el-divider>
    <el-table :data="claimList" stripe border show-summary>
      <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
      <el-table-column prop="totalAmount" label="报销金额(元)"></el-table-column>
    </el-table>
    <el-divider>请假清单</el-divider>
    <el-table :data="holidayList" stripe border show-summary>
      <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
      <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
      <el-table-column prop="totalDay" label="请假天数"></el-table-column>
      <el-table-column prop="totalAmount" label="扣除金额(元)"></el-table-column>
    </el-table>
    <el-divider>住房公积金清单</el-divider>
    <el-table :data="HCList" stripe border show-summary>
      <el-table-column prop="paymentTxt" label="付款对象"></el-table-column>
      <el-table-column prop="typeTxt" label="类型"></el-table-column>
      <el-table-column prop="payment" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider>社保清单</el-divider>
    <el-table :data="SIList" stripe border show-summary>
      <el-table-column prop="paymentTxt" label="付款对象"></el-table-column>
      <el-table-column prop="typeTxt" label="类型"></el-table-column>
      <el-table-column prop="payment" label="金额(元)"></el-table-column>
    </el-table>
    <el-divider>专项扣除清单</el-divider>
    <el-table :data="specialDeductionList" stripe border show-summary>
      <el-table-column prop="statusTxt" label="是否生效"></el-table-column>
      <el-table-column prop="typeIdTxt" label="专项扣除类型"></el-table-column>
      <el-table-column prop="amount" label="专项扣除金额"></el-table-column>
    </el-table>
    <el-divider>MPF清单</el-divider>
    <el-table :data="MPFList" stripe border show-summary>
      <el-table-column prop="paymentTxt" label="缴费对象"></el-table-column>
      <el-table-column prop="typeTxt" label="类 型"></el-table-column>
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
      MPFList:[]
    };
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    arrSum(list,val){
      var n = 0;
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
          this.HCList = res.data.data.detail.HCList;
          this.SIList = res.data.data.detail.SIList;
          this.allowanceList = res.data.data.detail.allowanceList;
          this.claimList = res.data.data.detail.claimList.map(item => {
            item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
            return item;
          });
          this.holidayList = res.data.data.detail.holidayList.map(item => {
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
          this.specialDeductionList = res.data.data.detail.specialDeductionList.map(
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
            }
          );
          this.taxableItemsList = res.data.data.detail.taxableItemsList;
          this.MPFList = res.data.data.detail.MPFList || [];
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