<template>
  <div class="staffPayrollSlip wrap"  id="monthPayroll">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-date-picker
        v-model="seachMsg.year"
        type="year"
        placeholder="选择年"
        value-format="yyyy"
        format="yyyy"
        @change="selectYear"
      ></el-date-picker>
      <el-select
        style="width:200px;"
        v-model="seachMsg.month"
        placeholder="请选择月份"
        @change="selectMonth"
      >
        <el-option label="全年" value="0"></el-option>
        <el-option v-for="(item,key) in monthList" :key="key" :label="item.txt" :value="item.val"></el-option>
      </el-select>
    </div>
    <div class="monthPayroll" v-if="isShowPayrollMonth">
      <!--startprint-->
      <el-divider></el-divider>
      <div class="nothing" v-if="!tableData">
        暂无薪水数据
      </div>
      <div id="monthPayrollData" class="monthPayrollData">
        <br >
        <el-divider v-if="tableData" content-position="left">个人信息</el-divider>
        <ul class="msgList" v-if="tableData">
          <li v-if="tableData.buName">
            <span class="title">{{tableData.buName.title}}</span>：
            <span class="val">{{tableData.buName.val}}</span>
          </li>
          <li v-if="tableData.insuredCity">
            <span class="title">{{tableData.insuredCity.title}}</span>：
            <span class="val">{{tableData.insuredCity.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.name">
            <span class="title">{{tableData.name.title}}</span>：
            <span class="val">{{tableData.name.val}}</span>
          </li>
          <li v-if="tableData.bankName">
            <span class="title">{{tableData.bankName.title}}</span>：
            <span class="val">{{tableData.bankName.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.IDNo">
            <span class="title">{{tableData.IDNo.title}}</span>：
            <span class="val">{{tableData.IDNo.val || '暂无'}}</span>
          </li>
           <li v-if="tableData.bankAccountNo">
            <span class="title">{{tableData.bankAccountNo.title}}</span>：
            <span class="val">{{tableData.bankAccountNo.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.departmentName">
            <span class="title">{{tableData.departmentName.title}}</span>：
            <span class="val">{{tableData.departmentName.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.payDay">
            <span class="title">{{tableData.payDay.title}}</span>：
            <span class="val">{{tableData.payDay.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.position">
            <span class="title">{{tableData.position.title}}</span>：
            <span class="val">{{tableData.position.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.payrollPeriod">
            <span class="title">{{tableData.payrollPeriod.title}}</span>：
            <span class="val">{{tableData.payrollPeriod.val}}</span>
          </li> 
          <li v-if="tableData.remarks">
            <span class="title">{{tableData.remarks.title}}</span>：
            <span class="val">{{tableData.remarks.val || '暂无'}}</span>
          </li>
        </ul>
        <br >
        <el-divider v-if="tableData" content-position="left">薪资构成</el-divider>
        <ul class="msgList" v-if="tableData">
          <li v-if="tableData.totalAmount">
            <span class="title">{{tableData.totalAmount.title}}</span>：
            <span class="val">{{tableData.totalAmount.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.grossPay">
            <span class="title">{{tableData.grossPay.title}}</span>：
            <span class="val">{{tableData.grossPay.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.holiday">
            <span class="title">{{tableData.holiday.title}}</span>：
            <span class="val">{{tableData.holiday.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.SI">
            <span class="title">{{tableData.SI.title}}</span>：
            <span class="val">{{tableData.SI.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.taxableWages">
            <span class="title">{{tableData.taxableWages.title}}</span>：
            <span class="val">{{tableData.taxableWages.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.HC">
            <span class="title">{{tableData.HC.title}}</span>：
            <span class="val">{{tableData.HC.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.taxAmount">
            <span class="title">{{tableData.taxAmount.title}}</span>：
            <span class="val">{{tableData.taxAmount.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.specialDeduction">
            <span class="title">{{tableData.specialDeduction.title}}</span>：
            <span class="val">{{tableData.specialDeduction.val || '暂无'}}</span>
          </li>

          <!-- <li v-if="tableData.netAmount">
            <span class="title">{{tableData.netAmount.title}}</span>：
            <span class="val">{{tableData.netAmount.val || '暂无'}}</span>
          </li> -->
          <!-- <li v-if="tableData.netAmount">
            <span class="title">{{tableData.netAmount.title}}</span>：
            <span class="val">{{tableData.netAmount.val || '暂无'}}</span>
          </li>
          <li v-if="tableData.netAmount">
            <span class="title">{{tableData.netAmount.title}}</span>：
            <span class="val">{{tableData.netAmount.val || '暂无'}}</span>
          </li> -->
          <li v-if="tableData.reallyAmount">
            <span class="title">{{tableData.reallyAmount.title}}</span>：
            <span class="val">{{tableData.reallyAmount.val || '暂无'}}</span>
          </li>
        </ul>
        <div class="table-wrap" v-if="tableData">
          <div class="table-item">
            <el-divider>收入列表</el-divider>
            <el-table
              v-if="tableData.staffSalaryItemTaxableList"
              :data="tableData.staffSalaryItemTaxableList"
              stripe
              border
              show-summary
            >
              <el-table-column prop="title" label="名 称"></el-table-column>
              <el-table-column prop="val" label="金 额"></el-table-column>
            </el-table>
          </div>
          <div class="table-item" v-if="tableData.SIList" >
            <el-divider>社保/公积金明细</el-divider>
            <el-table :data="tableData.SIList.val" stripe border show-summary>
              <!-- <el-table-column prop="paymentTxt" label="支付对象"></el-table-column> -->
              <el-table-column prop="typeTxt" label="类型"></el-table-column>
              <el-table-column prop="payment" label="金 额"></el-table-column>
            </el-table>
          </div>
          <div class="table-item" v-if="tableData.MPFList" >
            <el-divider>MPF明细</el-divider>
            <el-table :data="tableData.MPFList.val" stripe border show-summary>
              <!-- <el-table-column prop="paymentTxt" label="支付对象"></el-table-column> -->
              <el-table-column prop="paymentTxt" label="类 型"></el-table-column>
              <el-table-column prop="payment" label="金 额"></el-table-column>
            </el-table>
          </div>
          <div class="table-item">
            <el-divider>不应税项目列表</el-divider>
            <el-table v-if="tableData.staffSalaryItemNotTaxableList"
              :data="tableData.staffSalaryItemNotTaxableList"
              stripe border show-summary>
              <el-table-column prop="title" label="名 称"></el-table-column>
              <el-table-column prop="val" label="金 额"></el-table-column>
            </el-table>
          </div>
        </div>
        <!--endprint-->
        <br />
      </div>
      <div class="btnSet">
          <el-button type="primary" class="printBtn" @click='doPrint'>打 印</el-button>
          <el-button type="primary" class="printBtn" @click='creatPdf'>下 载</el-button>
      </div>
    </div>
    <div class="yearPayroll" v-if="isShowPayrollYear">
      <staff-payroll-year :curInfo="curInfo" ></staff-payroll-year>
    </div>

  </div>
</template>
<script>

import staffPayrollYear from "./staffPayrollSlipList.vue";
import {monthList} from "@/lib/staticData.js";
import {createPdf,createImgToPrint} from '@/lib/htmlToPDF'
export default {
  name: "staffPayrollSlip",
  inject: ["reload"],
  data() {
    return {
      tableData: {},
      staffCode: "",
      seachMsg: {
        year: "", //年份
        month: "" //月份
      },
      userInfo:{},
      curInfo:{},
      monthList:[],
      isShowPayrollMonth:true,
      isShowPayrollYear:false
    };
  },
  mounted() {
    this.monthList = monthList();
    this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      this.userInfo = this.$toolFn.curUser;
      if (this.userInfo.roleTypeId == 1){
          this.staffCode = this.userInfo.staffCode;
      }
      this.curInfo.code = this.staffCode;
      var date = new Date();
      this.seachMsg = {year: date.getFullYear().toString(),month: (date.getMonth()+1).toString()};
      // if (this.$toolFn.sessionGet("staffPayrollSlip")) {
      //   this.seachMsg = {
      //     year: this.$toolFn.sessionGet("staffPayrollSlip").year.toString(),
      //     month: this.$toolFn.sessionGet("staffPayrollSlip").month.toString()
      //   };
      // }
      this.getData(this.staffCode,parseInt(this.seachMsg.year),parseInt(this.seachMsg.month));
    },
    //获取项目数据列表
    getData(staffCode, year, month) {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollSlip";
      var myData = {
        staffCode: staffCode,
        year: year,
        month: month
      };
      this.$myApi.http.post(reqUrl, myData).then(res => {
          this.tableData = res.data.data[0];
        })
    },
    // 选择年份
    selectYear(val) {
      this.seachMsg.year = val;
      this.getData(
        this.staffCode,
        parseInt(this.seachMsg.year),
        parseInt(this.seachMsg.month)
      );
      this.$toolFn.sessionSet("staffPayrollSlip", this.seachMsg);
      // this.isShowPayrollMonth = false;
      // this.isShowPayrollYear = true;
      // this.curInfo.isShowYear = false;
      this.curInfo.year = this.seachMsg.year;
      //this.seachMsg.month = "0";
      this.selectMonth("0");
      
    },
    // 选择月份
    selectMonth(val) {
      this.seachMsg.month = val;
      if (this.seachMsg.month != "0"){
        this.getData(this.staffCode,parseInt(this.seachMsg.year),parseInt(this.seachMsg.month));
        this.isShowPayrollMonth = true;
        this.isShowPayrollYear = false;
        this.curInfo.year = this.seachMsg.year;
      }else{
        this.isShowPayrollMonth = false;
        this.isShowPayrollYear = true;
        this.curInfo.isShowYear = false;
        this.curInfo.year = this.seachMsg.year;
      }
      //this.$toolFn.sessionSet("staffPayrollSlip", this.seachMsg);
    },
    // 打印
    doPrint() {
      // printJS({
      //   printable: 'monthPayroll',// 标签元素id
      //   type: 'html',
      //   header: '这是标题'})
      // var bdhtml = window.document.body.innerHTML;
      // var sprnstr = "<!--startprint-->";
      // var eprnstr = "<!--endprint-->";
      // var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
      // prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
      // window.document.body.innerHTML = prnhtml;
      // console.log(prnhtml)
      // window.print();
      // window.document.body.innerHTML = bdhtml; 
      var data = {
        title:this.tableData.name.val,
        bdhtml: document.querySelector('#monthPayrollData')
      }
      createImgToPrint(data);
    },
    creatPdf() {
      var data = {
        title:this.tableData.name.val,
        bdhtml: document.querySelector('#monthPayrollData')
      }
      createPdf(data);
    }
  },
  computed: {},
  components: {staffPayrollYear}
};
</script>
<style scoped lang="scss">
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .el-date-editor {
    margin-left: 15px;
    margin-right: 15px;
  }
  .buPayrollConfirmBtn {
    float: right;
  }
}
.table-expand {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 23%;
    box-sizing: border-box;
    border-bottom: 1px #99a9bf solid;
    padding: 0 10px;
    box-shadow: darkgrey 0px 2px 15px 1px;
    border-radius: 8px;
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
.nothing{
  text-align:center;
  padding: 15px;
  font-size: 14px;
  color: #99a9bf
}
.monthPayrollData{
  padding: 25px;
}
</style>






