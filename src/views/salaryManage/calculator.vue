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
          <el-input v-model="scope.row.income" placeholder="请输入内容" @input="changeRow(scope.$index)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deduct" label="专项扣除（元）">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.deduct"
            placeholder="请输入内容"
            suffix-icon="el-icon-caret-right"
            readonly
            @click.native="deductFn(scope.$index, scope.row)"
            @input="changeRow(scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="addDeduct" label="專項附加扣除（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.addDeduct" placeholder="请输入内容" suffix-icon="el-icon-caret-right" readonly @click.native="addDeductFn(scope.$index, scope.row)" @input="changeRow(scope.$index)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fixedDeduct" label="起征点（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fixedDeduct" placeholder="" @input="changeRow(scope.$index)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="iit" label="当月个人所得税（元）">
        <template slot-scope="scope">
          <el-input v-model="monthlyTax[scope.$index].iit" placeholder="" :disabled="true" @input="changeRow(scope.$index)"></el-input>
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
            <el-input v-model.number="deductFrom.insurance1"></el-input>
          </el-form-item>
          <el-form-item label="医疗保险">
            <el-input v-model.number="deductFrom.insurance2"></el-input>
          </el-form-item>
          <el-form-item label="失业保险">
            <el-input v-model.number="deductFrom.insurance3"></el-input>
          </el-form-item>
          <el-form-item label="住房公积金">
            <el-input v-model.number="deductFrom.insurance4"></el-input>
          </el-form-item>
          <el-form-item label="累计（元）">
            <el-input v-model.number="totalDeduct" disabled></el-input>
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
      dataList: [
        {
          id: 1,
          Mth: "1月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 2,
          Mth: "2月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 3,
          Mth: "3月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 4,
          Mth: "4月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 5,
          Mth: "5月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 6,
          Mth: "6月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 7,
          Mth: "7月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 8,
          Mth: "8月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 9,
          Mth: "9月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 10,
          Mth: "10月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 11,
          Mth: "11月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        },
        {
          id: 12,
          Mth: "12月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 0,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0,
          grossAmtSum:0,
          taxRateAmtSum:0,
          deductList:[],
          addDeductList: [],
        }
      ], //表单列表
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
      changeRowIndex:1000

    };
  },
  mounted() {
    var _this = this;
  },
  methods: {
    changeRow(index){
      this.changeRowIndex = index;
    },
    //专项扣除
    deductFn(index, res) {
      var _this = this;
      let deductListIndex = 0;
      for (let i in _this.deductFrom) {
        _this.deductFrom[i] = res.deductList[deductListIndex] || 0;
        deductListIndex++;
      }
      _this.isShowDeduct = true;
      _this.currentInfo.index = index;
    },
    onSubmit(deductFrom) {
      var _this = this;
      _this.isShowDeduct = false;
      _this.dataList[_this.currentInfo.index].deductList = [];
      for (let i in deductFrom) {
        _this.dataList[_this.currentInfo.index].deductList.push(deductFrom[i]);
      }
      _this.dataList[_this.currentInfo.index].deduct = _this.totalDeduct;
    },
    // 附加专项扣除
    addDeductFn(index, res) {
      var _this = this;
      let deductListIndex = 0;
      for (let i in _this.addDeductFrom) {
        _this.addDeductFrom[i] = res.addDeductList[deductListIndex] || 0;
        deductListIndex++;
      }
      _this.isShowAddDeduct = true;
      _this.currentInfo.index = index;
    },
    onSubmit2(addDeductFrom) {
      var _this = this;
      _this.isShowAddDeduct = false;
      _this.dataList[_this.currentInfo.index].addDeductList = [];
      for (let i in addDeductFrom) {
        _this.dataList[_this.currentInfo.index].addDeductList.push(addDeductFrom[i]);
      }
      _this.dataList[_this.currentInfo.index].addDeduct = _this.totalAddDeduct;
    },

    // 计算当月个税(累计)
    monthlySumIit(grossAmtSum,taxRateAmtSum) {
      let taxRate = 0.00; //税率
      let quickDeduct = 0.00; //速算扣除数
      let result = 0.00;
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
      result = parseFloat(val * taxRate - quickDeduct - taxRateAmtSum) < 0?0:parseFloat(val * taxRate - quickDeduct - taxRateAmtSum);
      //console.log(result.toFixed(2));
      return result.toFixed(2);
    },
    // 计算当月个税
    monthlyIit(a, b, c, d, e) {
      /* a=当前月份，b=税前收入，c=专项扣除，d=专项附加扣除，e=起征点 */
      var taxRate = 0; //税率
      var fixedNum = 0; //速算扣除数
      var result = 0; //个人说的税 输出结果
      var val = b - c - d - e;
      if (val < 36000) {
        taxRate = 0.03;
        fixedNum = 0;
      } else if (val >= 36000 && val < 144000) {
        taxRate = 0.1;
        fixedNum = 2520;
      } else if (val >= 144000 && val < 300000) {
        taxRate = 0.2;
        fixedNum = 16920;
      } else if (val >= 300000 && val < 420000) {
        taxRate = 0.25;
        fixedNum = 31920;
      } else if (val >= 420000 && val < 600000) {
        taxRate = 0.3;
        fixedNum = 52920;
      } else if (val >= 600000 && val < 960000) {
        taxRate = 0.35;
        fixedNum = 85920;
      } else if (val >= 960000) {
        taxRate = 0.45;
        fixedNum = 181920;
      }
      result = val * taxRate - fixedNum;
      return result;
    },
    // 计算当月所得工资
    monthlyWages(a, b, c, d) {
      /* a=当前月份，b=税前收入，c=专项扣除，d=个人所得税 */
      var wages = 0;
      wages = b - c - d;
      return parseFloat(wages);
    }
    // 计算
  },
  computed: {
    // 计算个税
    monthlyTax() {
      var _this = this;
      let grossAmtSum = 0;//累计应税收入
      let taxRateAmtSumNotCur = 0;//累计纳税金额不包当前月纳税
      let taxRateAmtSum = 0;//累计纳税金额
      //let grossAmtSumNotCur = 0;//累计纳税金额不包当前月纳税
      for (var i = 0; i < _this.dataList.length; i++) {
        if (_this.dataList[i].income && _this.dataList[i].income > 0){
          let curGrossAmt = parseFloat(_this.dataList[i].income - _this.dataList[i].deduct -  _this.dataList[i].addDeduct - _this.dataList[i].fixedDeduct); //应税工资
          let curtaxRateAmt = _this.changeRowIndex != i ? parseFloat(_this.dataList[i].iit) : 0;
          //let curtaxRateAmt = parseFloat(_this.dataList[i].iit) ;
          grossAmtSum += curGrossAmt > 0?curGrossAmt:0;
          taxRateAmtSumNotCur += curtaxRateAmt;
          //console.log(grossAmtSum,taxRateAmtSumNotCur);
          _this.dataList[i].grossAmtSum = grossAmtSum;
          _this.dataList[i].iit = curGrossAmt > 0 ? _this.monthlySumIit(grossAmtSum,taxRateAmtSumNotCur) : 0;
          _this.dataList[i].accumulate = _this.monthlyWages(
            _this.dataList[i].id,
            _this.dataList[i].income,
            _this.dataList[i].deduct,
            _this.dataList[i].iit
          );
          console.log(_this.dataList[i].accumulate);
          _this.dataList[i].taxRateAmtSum = parseFloat(taxRateAmtSumNotCur + _this.dataList[i].iit);
          _this.taxRateAmtSum = _this.dataList[i].taxRateAmtSum;
          _this.netPayAmtSum += _this.dataList[i].accumulate;
          console.log(_this.taxRateAmtSum,_this.netPayAmtSum);
        }
      }
      _this.grossAmtSum = grossAmtSum;
      //_this.grossAmtSum = grossAmtSum;
      return _this.dataList;
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