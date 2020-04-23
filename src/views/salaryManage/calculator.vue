<template>
  <div class="wrap calculator">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>个税计算器</span>
    </div>
    <!-- 表格 -->
    <el-table :data="dataList" style="width: 100%" height="520">
      <el-table-column prop="Mth" label="月份" width="80px"></el-table-column>
      <el-table-column label="税前收入（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.income" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="税前收入（元）累计">
        <template slot-scope="scope">
          <el-input :disabled="true"  v-model="scope.row.incomeSum"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deduct" label="专项扣除（元）">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.deduct"
            placeholder="请输入内容"
            suffix-icon="el-icon-caret-right"
            readonly
            @click.native="deductFn(scope.$index, scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="专项扣除（元）累计">
        <template slot-scope="scope">
          <el-input :disabled="true"  v-model="scope.row.deductSum"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="addDeduct" label="專項附加扣除（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.addDeduct" placeholder="请输入内容" suffix-icon="el-icon-caret-right" readonly @click.native="addDeductFn(scope.$index, scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="專項附加扣除（元）累计">
        <template slot-scope="scope">
          <el-input :disabled="true"  v-model="scope.row.addDeductSum"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fixedDeduct" label="起征点（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fixedDeduct" placeholder=""></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fixedDeductSum" label="起征点（元）累计">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fixedDeductSum" placeholder=""></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="grossAmt" label="应税金额（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.grossAmt" placeholder="" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="grossAmtSum" label="累计应税金额（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.grossAmtSum" placeholder="" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率">
        <template slot-scope="scope">
          <el-input v-model="monthlyTax[scope.$index].taxRateTxt" placeholder="" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="quickDeduct" label="速减扣除" >
        <template slot-scope="scope">
          <el-input v-model="monthlyTax[scope.$index].quickDeduct" placeholder="" :disabled="true"></el-input>
        </template>
      </el-table-column> -->
      <el-table-column prop="iit" label="当月个人所得税（元）">
        <template slot-scope="scope">
          <el-input v-model="monthlyTax[scope.$index].iit" placeholder="" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="当月个人所得税（元）累计">
        <template slot-scope="scope">
          <el-input :disabled="true"  v-model="scope.row.taxRateAmtSum"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="accumulate" label="当月税后所得额（元）">
        <template slot-scope="scope">
          <el-input
            v-model="monthlyTax[scope.$index].accumulate"
            placeholder=""
            :disabled="true"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="当月税后所得额（元）累计">
        <template slot-scope="scope">
          <el-input :disabled="true"  v-model="scope.row.accumulateSum"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-tag size="medium">累计应纳税总额：{{cummGrossAmt}}元</el-tag>
      <el-tag size="medium">累计个人所得税：{{cummIIT}}元</el-tag>
      <el-tag size="medium">累计税后所得额：{{cummExpense}}元</el-tag>
    </div>
    <!-- 專項扣除 -->
    <el-dialog title="專項扣除" :visible.sync="isShowDeduct" :close-on-click-modal="false" width="40%">
      <div class="container">
        <el-form :model="deductFrom" ref="deductFrom" label-width="100px">
          <el-form-item label="养老保险">
            <el-input v-model="deductFrom.insurance1"></el-input>
          </el-form-item>
          <el-form-item label="医疗保险">
            <el-input v-model="deductFrom.insurance2"></el-input>
          </el-form-item>
          <el-form-item label="失业保险">
            <el-input v-model="deductFrom.insurance3"></el-input>
          </el-form-item>
          <el-form-item label="住房公积金">
            <el-input v-model="deductFrom.insurance4"></el-input>
          </el-form-item>
          <el-form-item label="累计（元）">
            <el-input v-model="totalDeduct" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(deductFrom)">确 定</el-button>
            <el-button @click="isShowDeduct = false;">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 專項附加扣除 -->
    <el-dialog
      title="專項附加扣除"
      :visible.sync="isShowAddDeduct"
      :close-on-click-modal="false"
      width="40%"
    >
      <div class="container">
        <el-form :model="addDeductFrom" ref="addDeductFrom" label-width="100px">
          <el-form-item label="贍養老人">
            <el-input v-model.number="addDeductFrom.val1"></el-input>
          </el-form-item>
          <el-form-item label="子女教育">
            <el-input v-model.number="addDeductFrom.val2"></el-input>
          </el-form-item>
          <el-form-item label="房貸利息">
            <el-input v-model.number="addDeductFrom.val3"></el-input>
          </el-form-item>
          <el-form-item label="住房租金">
            <el-input v-model.number="addDeductFrom.val4"></el-input>
          </el-form-item>
          <el-form-item label="繼續教育">
            <el-input v-model.number="addDeductFrom.val5"></el-input>
          </el-form-item>
          <el-form-item label="累计（元）">
            <el-input v-model.number="totalAddDeduct" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit2(addDeductFrom)">确 定</el-button>
            <el-button @click="isShowAddDeduct = false;">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setInterval } from "timers";
import { all } from 'q';
export default {
  name: "calculator",
  inject: ["reload"],
  data() {
    return {
      demo:{
          id: 1,
          Mth: "",
          income: null,//收入
          incomeSum:0,//收入累计
          deduct: 0,//社保
          deductSum:0,//社保累计
          addDeduct: 0,//附加扣除
          addDeductSum:0,//附加扣除累计
          fixedDeduct: 5000,//起征点
          fixedDeductSum:0,//起征点累计
          //fixedDeductNoUsedSum:0,//已用起征点累计
          taxRate: 0.03,//税点
          quickDeduct:0,//速减扣除
          iit: 0,//个人所得税
          taxRateAmtSum:0,//个人所得税累计
          accumulate: 0,//税后所得额
          accumulateSum: 0,//税后所得额累计
          grossAmt:0,//应税金额
          grossAmtSum:0,//应税金额累计
          deductList:[],//社保明细
          addDeductList: [],//附加明细
      },
      dataList: [], //表单列表
      deductFrom: {
        insurance1: 0, //养老保险
        insurance2: 0, //医疗保险
        insurance3: 0, //失业保险
        insurance4: 0 //住房公积金
      }, //專項扣除
      addDeductFrom: {
        val1: 0, //贍養老人
        val2: 0, //子女教育
        val3: 0, //房貸利息
        val4: 0, //住房租金
        val5: 0 //繼續教育
      },
      isShowDeduct: false, //是否显示专项扣除
      isShowAddDeduct: false, //是否显示附近专项扣除
      currentInfo: {}, //当前信息
      grossAmtSum:0,//应税工资总额
      taxRateAmtSum:0,//应税总额
      netPayAmtSum:0,//税后总额
      incomeSum:0,
      deductSum:0,
      addDeductSum:0,
      accumulateSum:0,
      deductSum:0,
      deductSum:0,
    };
  },
  mounted() {
    
    for (let index = 1; index < 13; index++) {
      let demo = JSON.parse(JSON.stringify(this.demo));
      demo.id = index;
      demo.Mth = index + "月";
      this.dataList.push(demo);
    }
  },
  methods: {
    changeRow(index){
      //this.changeRowIndex = index;
    },
    //专项扣除
    deductFn(index, res) {
      
      let deductListIndex = 0;
      let deductListLogic = res.deductList;
      if (deductListLogic.length == 0){
        let logicIndex = index - 1;
        if (logicIndex <= 0){
          logicIndex = 0;
        }
        deductListLogic = this.dataList[logicIndex].deductList;
      }
      for (let i in this.deductFrom) {
        this.deductFrom[i] = deductListLogic[deductListIndex] || 0;
        deductListIndex++;
      }
      this.isShowDeduct = true;
      this.currentInfo.index = index;
    },
    onSubmit(deductFrom) {
      
      this.isShowDeduct = false;
      this.dataList[this.currentInfo.index].deductList = [];
      for (let i in deductFrom) {
        this.dataList[this.currentInfo.index].deductList.push(deductFrom[i]);
      }
      this.dataList[this.currentInfo.index].deduct = this.totalDeduct;
    },
    // 附加专项扣除
    addDeductFn(index, res) {
      
      let deductListIndex = 0;
      let addDeductListLogic = res.addDeductList;
      if (addDeductListLogic.length == 0){
        let logicIndex = index - 1;
        if (logicIndex <= 0){
          logicIndex = 0;
        }
        addDeductListLogic = this.dataList[logicIndex].addDeductList;
      }
      for (let i in this.addDeductFrom) {
        this.addDeductFrom[i] = addDeductListLogic[deductListIndex] || 0;
        deductListIndex++;
      }
      this.isShowAddDeduct = true;
      this.currentInfo.index = index;
    },
    onSubmit2(addDeductFrom) {
      
      this.isShowAddDeduct = false;
      this.dataList[this.currentInfo.index].addDeductList = [];
      for (let i in addDeductFrom) {
        this.dataList[this.currentInfo.index].addDeductList.push(addDeductFrom[i]);
      }
      this.dataList[this.currentInfo.index].addDeduct = this.totalAddDeduct;
    },
    // 计算当月个税(累计)
    monthlySumIit(grossAmtSum,taxRateAmtSum,fixedDeductSum) {
      let taxRate = 0.00; //税率
      let quickDeduct = 0.00; //速算扣除数
      let result = {iit:0,taxRate:0,quickDeduct:0};
      let val = parseFloat(grossAmtSum);
      if (val < 36000) {
        taxRate = 0.03;
        quickDeduct = 0;
      } else if (val >= 36000 && val < 144000) {
        taxRate = 0.1;
        quickDeduct = 2520;
      } else if (val >= 144000 && val < 300000) {
        taxRate = 0.2;
        quickDeduct = 16920;
      } else if (val >= 300000 && val < 420000) {
        taxRate = 0.25;
        quickDeduct = 31920;
      } else if (val >= 420000 && val < 600000) {
        taxRate = 0.3;
        quickDeduct = 52920;
      } else if (val >= 600000 && val < 960000) {
        taxRate = 0.35;
        quickDeduct = 85920;
      } else if (val >= 960000) {
        taxRate = 0.45;
        quickDeduct = 181920;
      }
      result.iit = parseFloat(val * taxRate - quickDeduct - taxRateAmtSum) < 0 ? 0 : parseFloat(val * taxRate - quickDeduct - taxRateAmtSum).toFixed(2);
      result.taxRate = taxRate;
      result.quickDeduct = quickDeduct;
      //console.log(result.toFixed(2));
      return result;
    },

    // 计算当月所得工资
    monthlyWages(b,d) {
      /* b = 税前工资，d = 个人所得税 */
      var wages = 0;
      wages = b - d > 0?b - d:0;
      return parseFloat(wages);
    }
  },
  computed: {
    // 计算个税
    monthlyTax() {
      
      let grossAmtSum = 0;//累计应税收入
      let taxRateAmtSum = 0;//累计纳税金额
      let fixedDeductNoUsedSum = 0;//累计起征点结余
      this.netPayAmtSum = 0;//累计税后所得额
      this.incomeSum = 0;//累计税前收入
      this.deductSum = 0;//社保累计
      this.addDeductSum = 0;//附加扣除累计
      this.fixedDeductSum = 0;//累计起征点
      
      //this.grossAmtSum = 0;//累计应税金额
      //let grossAmtSumNotCur = 0;//累计纳税金额不包当前月纳税
      for (var i = 0; i < this.dataList.length; i++) {
        // if (this.dataList[i].income && this.dataList[i].income > 0){
        if (this.dataList[i].income){
          this.dataList[i].iit = 0;
          let curGrossAmt = parseFloat(this.dataList[i].income - this.dataList[i].deduct -  this.dataList[i].addDeduct - this.dataList[i].fixedDeduct) > 0 ? parseFloat(this.dataList[i].income - this.dataList[i].deduct -  this.dataList[i].addDeduct - this.dataList[i].fixedDeduct) : 0; //应税工资
          //this.dataList[i].grossAmtSum = grossAmtSum;
          let fixedDeductNoUsed = parseFloat(this.dataList[i].fixedDeduct - (this.dataList[i].income - this.dataList[i].deduct -  this.dataList[i].addDeduct));//当月已用起征点
          fixedDeductNoUsedSum += fixedDeductNoUsed > 0 ? fixedDeductNoUsed : 0;//累计起征点结余
          console.log(fixedDeductNoUsed);
          console.log(fixedDeductNoUsedSum);
          if(fixedDeductNoUsedSum > 0 && curGrossAmt > 0){//如果累计起征点结余不为 0 且应税金额不为 0
            let curGrossAmtTmp = curGrossAmt;
            if (curGrossAmt > fixedDeductNoUsedSum){
              curGrossAmt =  curGrossAmtTmp - fixedDeductNoUsedSum;
              fixedDeductNoUsedSum = 0;
            }else{
              curGrossAmt = 0;
              fixedDeductNoUsedSum = fixedDeductNoUsedSum -  curGrossAmtTmp;
            }
          }
          console.log(fixedDeductNoUsedSum);
          grossAmtSum += curGrossAmt > 0?curGrossAmt:0;
          let monthlyIit = this.monthlySumIit(grossAmtSum,taxRateAmtSum);
          this.dataList[i].grossAmt = curGrossAmt;
          this.dataList[i].iit = curGrossAmt > 0 ? monthlyIit.iit : 0;
          this.dataList[i].taxRate = curGrossAmt > 0 ? monthlyIit.taxRate : 0;
          this.dataList[i].taxRateTxt = this.dataList[i].taxRate * 100 + "%";
          this.dataList[i].quickDeduct = curGrossAmt > 0 ? monthlyIit.quickDeduct : 0;
          this.dataList[i].accumulate = this.monthlyWages(
            this.dataList[i].income - this.dataList[i].deduct,
            this.dataList[i].iit
          );

          taxRateAmtSum += parseFloat(this.dataList[i].iit);
          this.incomeSum += parseFloat(this.dataList[i].income);
          this.deductSum += parseFloat(this.dataList[i].deduct);
          this.addDeductSum += parseFloat(this.dataList[i].addDeduct);
          this.fixedDeductSum += parseFloat(this.dataList[i].fixedDeduct);
         
          this.dataList[i].incomeSum = this.incomeSum;
          this.dataList[i].deductSum = this.deductSum;
          this.dataList[i].addDeductSum = this.addDeductSum;
          this.dataList[i].fixedDeductSum = this.fixedDeductSum;
          this.dataList[i].taxRateAmtSum = taxRateAmtSum;
          this.dataList[i].grossAmtSum = grossAmtSum;
          this.taxRateAmtSum = taxRateAmtSum;
          this.netPayAmtSum += parseFloat(this.dataList[i].accumulate);
          this.dataList[i].accumulateSum = this.netPayAmtSum;
        }
      }
      this.grossAmtSum = grossAmtSum;
      //this.grossAmtSum = grossAmtSum;
      return this.dataList;
    },
    // 累计应纳税总额
    cummGrossAmt() {
      return this.grossAmtSum;
    },
    // 累计应纳个人所得税
    cummIIT() {
      return this.taxRateAmtSum;
    },
    // 累计税后所得额
    cummExpense() {
      return this.netPayAmtSum;
    },
    //获取专项扣除
    totalDeduct() {
      var sum =
        parseInt(this.deductFrom.insurance1) +
        parseInt(this.deductFrom.insurance2) +
        parseInt(this.deductFrom.insurance3) +
        parseInt(this.deductFrom.insurance4);
      if (isNaN(sum)) {
        return 0;
      }
      return sum;
    },
    // 附加专项扣除
    totalAddDeduct() {
      var sum =
        parseInt(this.addDeductFrom.val1) +
        parseInt(this.addDeductFrom.val2) +
        parseInt(this.addDeductFrom.val3) +
        parseInt(this.addDeductFrom.val4) +
        parseInt(this.addDeductFrom.val5);
      if (isNaN(sum)) {
        return 0;
      }
      return sum;
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  p {
    margin: 0 10px;
  }
  span {
    margin-left: 10px;
  }
}
</style>