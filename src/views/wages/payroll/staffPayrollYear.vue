<template>
  <div class="staffPayrollYear">
    <!-- 搜索 -->
    <div class="search-wrap" v-if="isShowYear">
      <el-date-picker
        class="selectItem"
        v-model="year"
        type="year"
        placeholder="选择年"
        value-format="yyyy"
        format="yyyy"
        @change="selectYear"
      ></el-date-picker>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="table-wrap">
          <!-- <div class="table-item"  v-if="props.row.allowanceList && props.row.allowanceList.length > 0">
            <el-divider>津贴清单</el-divider>
            <el-table :data="props.row.allowanceList" stripe border show-summary size="mini">
              <el-table-column prop="name" label="名 称"></el-table-column>
              <el-table-column prop="amount" label="金额(元)"></el-table-column>
            </el-table>
          </div> -->
          <div class="table-item" v-if="props.row.taxableItemsList && props.row.taxableItemsList.length > 0" >
            <el-divider>应税项目清单</el-divider>
            <el-table :data="props.row.taxableItemsList" stripe border show-summary>
            <el-table-column prop="name" label="项目名称"></el-table-column>
            <el-table-column prop="amount" label="金额(元)"></el-table-column>
            </el-table>
          </div>
          <div class="table-item" v-if="props.row.notTaxableItemsList && props.row.notTaxableItemsList.length > 0" >
            <el-divider>非应税项目清单</el-divider>
            <el-table  :data="props.row.notTaxableItemsList" stripe border show-summary>
              <el-table-column prop="name" label="项目名称"></el-table-column>
              <el-table-column prop="amount" label="金额(元)"></el-table-column>
            </el-table>
          </div>          
          <div class="table-item"  v-if="props.row.holidayList && props.row.holidayList.length > 0">
          <el-divider>请假清单</el-divider>
          <el-table :data="props.row.holidayList" stripe border show-summary size="mini">
            <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
            <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
            <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
            <el-table-column prop="totalDay" label="请假天数"></el-table-column>
            <el-table-column prop="totalAmount" label="扣除金额(元)"></el-table-column>
          </el-table>
          </div>
          <div class="table-item"  v-if="props.row.SIList &&  props.row.SIList.length > 0">
          <el-divider>社保清单</el-divider>
          <el-table :data="props.row.SIList" stripe border show-summary size="mini">
            <el-table-column prop="typeTxt" label="类型"></el-table-column>
            <el-table-column prop="payment" label="金额(元)"></el-table-column>
          </el-table>
          </div>
          <div class="table-item"  v-if="props.row.HCList &&  props.row.HCList.length > 0">
          <el-divider>住房公积金清单</el-divider>
          <el-table :data="props.row.HCList" border show-summary size="mini">
            <el-table-column prop="typeTxt" label="缴纳类型"></el-table-column>
            <el-table-column prop="payment" label="金额（元）"></el-table-column>
          </el-table>
          </div>
          <div class="table-item" v-if="props.row.claimList && props.row.claimList.length > 0">
          <el-divider >报销清单</el-divider>
          <el-table :data="props.row.claimList" stripe border show-summary size="mini">
            <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
            <el-table-column prop="totalAmount" label="报销金额(元)"></el-table-column>
          </el-table>
          </div>
          <div class="table-item" v-if="props.row.specialDeductionList && props.row.specialDeductionList.length > 0">
          <el-divider >专项扣除清单</el-divider>
          <el-table :data="props.row.specialDeductionList" stripe border show-summary size="mini">
            <el-table-column prop="typeIdTxt" label="专项扣除类型"></el-table-column>
            <el-table-column prop="amount" label="专项扣除金额"></el-table-column>
          </el-table>
          </div>
          <div class="table-item" v-if="props.row.MPFList && props.row.MPFList.length > 0">
            <el-divider >MPF清单</el-divider>
            <el-table :data="props.row.MPFList"  stripe border show-summary size="mini">
              <el-table-column prop="paymentTxt" label="类 型"></el-table-column>
              <el-table-column prop="payment" label="金额(元)"></el-table-column>
            </el-table>
          </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="month" label="月份" ></el-table-column>
      <el-table-column prop="totalAmount" label="税前金额"></el-table-column>
      <!-- <el-table-column prop="totalAmountSum" label="累计税前金额"></el-table-column> -->
      <el-table-column prop="SHAmount" label="专项扣除"></el-table-column>
      <!-- <el-table-column prop="SHAmountSum" label="累计专项扣除"></el-table-column> -->
      <el-table-column prop="grossPay" label="税前工资"></el-table-column>
      <el-table-column prop="specialDeductionAmount" label="专项附加"></el-table-column>
      <!-- <el-table-column prop="specialDeductionAmountSum" label="累计专项附加"></el-table-column> -->
      <!-- <el-table-column prop="taxThreshold" label="起征点"></el-table-column>
      <el-table-column prop="taxThresholdSum" label="累计起征点"></el-table-column>      -->
      <el-table-column prop="taxableWages" label="应税金额"></el-table-column>
      <!-- <el-table-column prop="taxableWagesSum" label="累计应税金额"></el-table-column>  -->
      <!-- <el-table-column prop="buName" label="所在单位"></el-table-column> -->
      <!-- <el-table-column prop="salary" label="基础工资"></el-table-column> -->
      <el-table-column prop="claimAmount" label="报销金额"></el-table-column>
      <el-table-column prop="taxableWages" label="应税金额"></el-table-column>
      <el-table-column prop="taxAmount" label="个人所得税"></el-table-column>
      <!-- <el-table-column prop="taxAmountSum" label="累计个人所得税"></el-table-column> -->
      <el-table-column prop="netAmount" label="税后工资"></el-table-column>
      <!-- <el-table-column prop="netAmountSum" label="累计税后工资"></el-table-column> -->
      <el-table-column prop="reallyAmount" label="实发工资"></el-table-column>
      <el-table-column prop="reallyAmountSum" label="累计实发工资"></el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
  </div>
</template>
<script>
import {deductionTypeTxt} from "@/lib/staticData.js";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    pageInfo
  },
  name: "staffPayrollYear",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isShowYear:true,
      pageList: [],
      isShowLoading: false, //是否显示loading页
      year: "2020",
      holidayTypes:[],
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/payroll/staff/staffPayrollYear",
            data:{staffCode:this.curInfo.code,year:parseInt(this.year)}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        if(item.claimList){
          item.claimList.map(nodes => {
            nodes.isBalanceTxt = nodes.isBalance == 1 ? "已结算" : "未结算";
            return nodes;
          });
        }
        if(item.holidayList){
          item.holidayList.map(nodes => {
          // nodes.typeIdTxt = nodes.details[0].typeId == 1 ? "生效" : "未生效";
          if (item.details){
            nodes.typeIdTxt = this.holidayTypes.filter(child => {
                return child.typeId == item.details[0].typeId;
            })[0].val;
          }

          nodes.isBalanceTxt = nodes.isBalance == 1 ? "已结算" : "未结算";
          return nodes;
          });
        }
        if(item.specialDeductionList){
          item.specialDeductionList.map(nodes => {
            nodes.statusTxt = nodes.status == 1 ? "生效" : "未生效";
            nodes.typeIdTxt = deductionTypeTxt(nodes.typeId);
            return nodes;
          });
        }
        return item;
      });
    }
  },
  mounted() {
    this.init();
    if (this.curInfo.year){
      this.year = this.curInfo.year;
    }
    if (this.curInfo.isShowYear != undefined){
      this.isShowYear = this.curInfo.isShowYear;
    }
    //this.getData(this.curInfo.code, parseInt(this.year));
  },
  methods: {
    async init(){
      this.holidayTypes = await this.$myApi.getHolidaysTypeId();
    },
    // 选择年份
    selectYear(val) {
      //this.getData(this.curInfo.code, parseInt(val));
      this.$toolFn.sessionSet("staffPayrollYear", parseInt(val));
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
    }
  }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  .selectItem {
    display: flex;
    min-width: 200px;
    align-items: center;
    font-size: 14px;
    color: rgb(237, 137, 55);
    margin-right: 15px;
  }
  .el-date-editor {
    margin-right: 15px;
  }
  .buPayrollConfirmBtn {
    float: right;
  } 

}
.table-wrap {
  display: flex;
  margin: 30px auto 0;
  width: 100%;
  justify-content: space-between;
  flex-wrap:wrap;
  align-items: flex-start;
  .table-item {
    width: 48%;
  }
}
</style>






