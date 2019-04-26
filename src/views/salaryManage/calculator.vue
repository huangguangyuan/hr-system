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
      <el-table-column prop="deduct" label="专项扣除（元）">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.deduct"
            placeholder="请输入内容"
            suffix-icon="el-icon-caret-right"
            readonly
            @click.native="deductFn(scope.$index, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="addDeduct" label="專項附加扣除（元）">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.addDeduct"
            placeholder="请输入内容"
            suffix-icon="el-icon-caret-right"
            readonly
            @click.native="addDeductFn(scope.$index, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fixedDeduct" label="起征点（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fixedDeduct" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="iit" label="当月个人所得税（元）">
        <template slot-scope="scope">
          <el-input v-model="monthlyTax[scope.$index].iit" placeholder="请输入内容" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="accumulate" label="当月应纳税所得额（元）">
        <template slot-scope="scope">
          <el-input
            v-model="monthlyTax[scope.$index].accumulate"
            placeholder="请输入内容"
            :disabled="true"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-tag size="medium">累计应纳个人所得税：{{cummIIT}}元</el-tag>
      <el-tag size="medium">累计应纳税所得额：{{cummExpense}}元</el-tag>
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
            <el-button type="primary" @click="onSubmit">确 定</el-button>
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
            <el-button type="primary" @click="onSubmit2">确 定</el-button>
            <el-button @click="isShowAddDeduct = false;">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setInterval } from "timers";
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
          accumulate: 0
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
      currentInfo: {} //当前信息
    };
  },
  mounted() {
    var _this = this;
  },
  methods: {
    //专项扣除
    deductFn(index, res) {
      var _this = this;
      for (let i in _this.deductFrom) {
        _this.deductFrom[i] = 0;
      }
      _this.isShowDeduct = true;
      _this.currentInfo.index = index;
    },
    onSubmit() {
      var _this = this;
      _this.isShowDeduct = false;
      _this.dataList[_this.currentInfo.index].deduct = _this.totalDeduct;
    },
    // 附加专项扣除
    addDeductFn(index, res) {
      var _this = this;
      for (let i in _this.addDeductFrom) {
        _this.addDeductFrom[i] = 0;
      }
      _this.isShowAddDeduct = true;
      _this.currentInfo.index = index;
    },
    onSubmit2() {
      var _this = this;
      _this.isShowAddDeduct = false;
      _this.dataList[_this.currentInfo.index].addDeduct = _this.totalAddDeduct;
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
      return wages;
    }
    // 计算
  },
  computed: {
    // 计算个税
    monthlyTax() {
      var resultArr = [
        { iit: 1, accumulate: 0 },
        { iit: 2, accumulate: 0 },
        { iit: 3, accumulate: 0 },
        { iit: 4, accumulate: 0 },
        { iit: 5, accumulate: 0 },
        { iit: 6, accumulate: 0 },
        { iit: 7, accumulate: 0 },
        { iit: 8, accumulate: 0 },
        { iit: 9, accumulate: 0 },
        { iit: 10, accumulate: 0 },
        { iit: 11, accumulate: 0 },
        { iit: 12, accumulate: 0 }
      ];
      for (var i = 0; i < resultArr.length; i++) {
        resultArr[i].iit = this.monthlyIit(
          this.dataList[i].id,
          this.dataList[i].income,
          this.dataList[i].deduct,
          this.dataList[i].addDeduct,
          this.dataList[i].fixedDeduct
        );
      }
      for (var i = 0; i < resultArr.length; i++) {
        resultArr[i].accumulate = this.monthlyWages(
          this.dataList[i].id,
          this.dataList[i].income,
          this.dataList[i].deduct,
          resultArr[i].iit
        );
      }
      return resultArr;
    },
    // 累计应纳个人所得税
    cummIIT() {
      var a = 0; //税前收入
      var b = 0; //专项扣除
      var c = 0; //专项附加扣除
      var d = 0; //起征点
      for (var i = 0; i < this.dataList.length; i++) {
        a += parseInt(this.dataList[i].income);
        b += parseInt(this.dataList[i].deduct);
        c += parseInt(this.dataList[i].addDeduct);
        d += parseInt(this.dataList[i].fixedDeduct);
      }
      return this.monthlyIit(0,a,b,c,d);
    },
    cummExpense() {
      var res = 0;
      for (var i = 0; i < this.dataList.length; i++) {
        res += parseInt(this.monthlyTax[i].accumulate);
      }
      return res;
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