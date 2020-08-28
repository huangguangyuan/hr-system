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
          <div class="monthPayroll">
            <div id="monthPayrollData" class="monthPayrollData">
              <br >
              <el-divider content-position="left">个人信息</el-divider>
              <ul class="msgList">
                <li v-if="props.row.payrollSlip.buName">
                  <span class="title">{{props.row.payrollSlip.buName.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.buName.val}}</span>
                </li>
                <li v-if="props.row.payrollSlip.insuredCity">
                  <span class="title">{{props.row.payrollSlip.insuredCity.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.insuredCity.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.name">
                  <span class="title">{{props.row.payrollSlip.name.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.name.val}}</span>
                </li>
                <li v-if="props.row.payrollSlip.bankName">
                  <span class="title">{{props.row.payrollSlip.bankName.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.bankName.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.IDNo">
                  <span class="title">{{props.row.payrollSlip.IDNo.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.IDNo.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.bankAccountNo">
                  <span class="title">{{props.row.payrollSlip.bankAccountNo.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.bankAccountNo.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.departmentName">
                  <span class="title">{{props.row.payrollSlip.departmentName.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.departmentName.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.payDay">
                  <span class="title">{{props.row.payrollSlip.payDay.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.payDay.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.position">
                  <span class="title">{{props.row.payrollSlip.position.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.position.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.payrollPeriod">
                  <span class="title">{{props.row.payrollSlip.payrollPeriod.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.payrollPeriod.val}}</span>
                </li> 
                <li v-if="props.row.payrollSlip.remarks">
                  <span class="title">{{props.row.payrollSlip.remarks.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.remarks.val || '暂无'}}</span>
                </li>
              </ul>
              <br >
              <el-divider v-if="props.row.payrollSlip" content-position="left">薪资构成</el-divider>
              <ul class="msgList" v-if="props.row.payrollSlip">
                <li v-if="props.row.payrollSlip.totalAmount">
                  <span class="title">{{props.row.payrollSlip.totalAmount.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.totalAmount.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.grossPay">
                  <span class="title">{{props.row.payrollSlip.grossPay.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.grossPay.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.holiday">
                  <span class="title">{{props.row.payrollSlip.holiday.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.holiday.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.SI">
                  <span class="title">{{props.row.payrollSlip.SI.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.SI.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.taxableWages">
                  <span class="title">{{props.row.payrollSlip.taxableWages.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.taxableWages.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.HC">
                  <span class="title">{{props.row.payrollSlip.HC.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.HC.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.taxAmount">
                  <span class="title">{{props.row.payrollSlip.taxAmount.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.taxAmount.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.specialDeduction">
                  <span class="title">{{props.row.payrollSlip.specialDeduction.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.specialDeduction.val || '暂无'}}</span>
                </li>
                <li v-if="props.row.payrollSlip.reallyAmount">
                  <span class="title">{{props.row.payrollSlip.reallyAmount.title}}</span>：
                  <span class="val">{{props.row.payrollSlip.reallyAmount.val || '暂无'}}</span>
                </li>
              </ul>
              <div class="table-wrap" v-if="props.row.payrollSlip">
                <div class="table-item">
                  <el-divider>收入列表</el-divider>
                  <el-table
                    v-if="props.row.payrollSlip.staffSalaryItemTaxableList"
                    :data="props.row.payrollSlip.staffSalaryItemTaxableList"
                    stripe
                    border
                    show-summary
                  >
                    <el-table-column prop="title" label="名 称"></el-table-column>
                    <el-table-column prop="val" label="金 额"></el-table-column>
                  </el-table>
                </div>
                <div class="table-item" v-if="props.row.payrollSlip.SIList" >
                  <el-divider>社保/公积金明细</el-divider>
                  <el-table :data="props.row.payrollSlip.SIList.val" stripe border show-summary>
                    <!-- <el-table-column prop="paymentTxt" label="支付对象"></el-table-column> -->
                    <el-table-column prop="typeTxt" label="类型"></el-table-column>
                    <el-table-column prop="payment" label="金 额"></el-table-column>
                  </el-table>
                </div>
                <div class="table-item" v-if="props.row.payrollSlip.MPFList" >
                  <el-divider>MPF明细</el-divider>
                  <el-table :data="props.row.payrollSlip.MPFList.val" stripe border show-summary>
                    <el-table-column prop="paymentTxt" label="类 型"></el-table-column>
                    <el-table-column prop="payment" label="金 额"></el-table-column>
                  </el-table>
                </div>
                <div class="table-item">
                  <el-divider>不应税项目列表</el-divider>
                  <el-table v-if="props.row.payrollSlip.staffSalaryItemNotTaxableList"
                    :data="props.row.payrollSlip.staffSalaryItemNotTaxableList"
                    stripe border show-summary>
                    <el-table-column prop="title" label="名 称"></el-table-column>
                    <el-table-column prop="val" label="金 额"></el-table-column>
                  </el-table>
                </div>
              </div>
              <br />
            </div>
            <div class="btnSet">
                <el-button type="primary" class="printBtn" @click='doPrint(props.row.payrollSlip)'>打 印</el-button>
                <el-button type="primary" class="printBtn" @click='creatPdf(props.row.payrollSlip)'>下 载</el-button>
              </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="month" label="月份" ></el-table-column>
      <el-table-column prop="totalAmount" label="收入总金额"></el-table-column>
      <!-- <el-table-column prop="totalAmountSum" label="累计税前金额"></el-table-column> -->
      <el-table-column prop="SHAmount" label="专项扣除"></el-table-column>
      <!-- <el-table-column prop="SHAmountSum" label="累计专项扣除"></el-table-column> -->
      <!-- <el-table-column prop="grossPay" label="税前工资"></el-table-column> -->
      <el-table-column prop="specialDeductionAmount" label="专项附加"></el-table-column>
      <!-- <el-table-column prop="specialDeductionAmountSum" label="累计专项附加"></el-table-column> -->
      <!-- <el-table-column prop="taxThreshold" label="起征点"></el-table-column>
      <el-table-column prop="taxThresholdSum" label="累计起征点"></el-table-column>      -->
      <el-table-column prop="taxableWages" label="应税金额"></el-table-column>
      <!-- <el-table-column prop="taxableWagesSum" label="累计应税金额"></el-table-column>  -->
      <!-- <el-table-column prop="buName" label="所在单位"></el-table-column> -->
      <!-- <el-table-column prop="salary" label="基础工资"></el-table-column> -->
      <el-table-column prop="claimAmount" label="报销金额"></el-table-column>
      <!-- <el-table-column prop="taxableWages" label="应税金额"></el-table-column> -->
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
import {createPdf,createImgToPrint} from '@/lib/htmlToPDF'
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
      payrollSlip:{},
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/payroll/staff/staffPayrollYearAndStaffSlip",
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
    },
    // 打印
    doPrint(row) {
      var data = {
        title:row.name.val,
        bdhtml: document.querySelector('#monthPayrollData')
      }
      createImgToPrint(data);
    },
    creatPdf(row) {
      var data = {
        title:row.name.val,
        bdhtml: document.querySelector('#monthPayrollData')
      }
      createPdf(data);
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
.msgList {
  margin: 20px auto 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    padding: 15px 10px;
    font-size: 14px;
    width: 48%;
    box-sizing: border-box;
    list-style: none;
    .title {
      color: #99a9bf;
      display: inline-block;
      width: 100px;
      text-align: left;
    }
    border-bottom: 1px #99a9bf dashed;
  }
}
.table-wrap {
  display: flex;
  margin: 30px auto 0;
  justify-content: space-around;
  .table-item {
    width: 32%;
  }
}
.btnSet{
  text-align:center;
  margin: 30px;
  .printBtn {
    display:inline-block;
    margin: 20px;
  }
}
</style>






