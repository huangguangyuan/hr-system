<template>
  <div class="wrap calculator">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>个税计算器</span>
    </div>
    <!-- 表格 -->
    <el-table :data="dataList" style="width: 100%">
      <el-table-column prop="Mth" label="月份"></el-table-column>
      <el-table-column label="税前收入（元）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.income" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deduct" label="专项扣除">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deduct" placeholder="请输入内容" readonly @click.native='deductFn(scope.$index, scope.row)'></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="addDeduct" label="專項附加扣除">
        <template slot-scope="scope">
          <el-input v-model="scope.row.addDeduct" placeholder="请输入内容" readonly @click.native='addDeductFn(scope.$index, scope.row)'></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fixedDeduct" label="起征点"></el-table-column>
      <el-table-column prop="iit" label="个人所得税">
        <template slot-scope="scope">
          <el-input v-model="JANtax" placeholder="请输入内容" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="accumulate" label="月累计应纳税所得额"></el-table-column>
    </el-table>
    <div class="footer">
        <p>
            <span>累计应纳个人所得税:</span><span>0元</span>
        </p>
        <p>
            <span>累计应纳税所得额:</span><span>0元</span>
        </p>
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
            <el-button @click='isShowDeduct = false;'>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 專項附加扣除 -->
    <el-dialog title="專項附加扣除" :visible.sync="isShowAddDeduct" :close-on-click-modal="false" width="40%">
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
            <el-button @click='isShowAddDeduct = false;'>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setInterval } from 'timers';
export default {
  name: "calculator",
  inject: ["reload"],
  data() {
    return {
      dataList: [
        {
          id:1,
          Mth: "1月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 5000,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0
        },
        {
          id:2,
          Mth: "2月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 5000,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0
        },
        {
          id:3,
          Mth: "3月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 5000,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0
        },
        {
          id:4,
          Mth: "4月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 5000,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0
        },
        {
          id:5,
          Mth: "5月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 5000,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0
        },
        {
          id:6,
          Mth: "6月",
          income: 0,
          deduct: 0,
          addDeduct: 0,
          fixedDeduct: 5000,
          taxRate: 0.03,
          iit: 0,
          accumulate: 0
        }
      ], //表单列表
      deductFrom: {
        insurance1: 0, //养老保险
        insurance2: 0, //医疗保险
        insurance3: 0, //失业保险
        insurance4: 0, //住房公积金
      },//專項扣除
      addDeductFrom:{
          val1:0,//贍養老人
          val2:0,//子女教育	
          val3:0,//房貸利息	
          val4:0,//住房租金	
          val5:0,//繼續教育	
      },
      isShowDeduct: false, //是否显示专项扣除
      isShowAddDeduct: false, //是否显示附近专项扣除
      currentInfo:{}//当前信息
    };
  },
  mounted() {
    var _this = this;
  },
  methods: {
    //专项扣除
    deductFn(index,res){
        var _this = this;
        for(let i in _this.deductFrom){
            _this.deductFrom[i] = 0;
        }
        _this.isShowDeduct = true;
        _this.currentInfo.index = index;
    },
    onSubmit(){
        var _this = this;
        _this.isShowDeduct = false;
        _this.dataList[_this.currentInfo.index].deduct = _this.totalDeduct;
    },
    // 附加专项扣除
    addDeductFn(index,res){
        var _this = this;
        for(let i in _this.addDeductFrom){
            _this.addDeductFrom[i] = 0;
        }
        _this.isShowAddDeduct = true;
        _this.currentInfo.index = index;
    },
    onSubmit2(){
        var _this = this;
        _this.isShowAddDeduct = false;
        _this.dataList[_this.currentInfo.index].addDeduct = _this.totalAddDeduct;
    },
    // 计算当月个税
    countIit(a,b,c,d,e){
        /* a=当前月份，b=税前收入，c=专项扣除，d=专项附加扣除，e=起征点 */
        var taxRate = 0;
        var val = b-c-d-e;
        if(val<36000){
            taxRate = 0.03;
        }else if(val>=36000 && val < 144000){
            taxRate = 0.1;
        }else if(val>=144000 && val < 300000){
            taxRate = 0.2;
        }else if(val>=300000 && val < 420000){
            taxRate = 0.25;
        }else if(val>=420000 && val < 600000){
            taxRate = 0.3;
        }else if(val>=600000 && val < 960000){
            taxRate = 0.35;
        }else if(val>=960000){
            taxRate = 0.45;
        }
        var result = val * taxRate;
        return result;
    }
  },
  computed: {
    //获取专项扣除   
    totalDeduct(){
        var sum = parseInt(this.deductFrom.insurance1) + parseInt(this.deductFrom.insurance2) + parseInt(this.deductFrom.insurance3) + parseInt(this.deductFrom.insurance4);
        if(isNaN(sum)){
            return 0;
        }
        return sum;
    },
    // 附加专项扣除 
    totalAddDeduct(){
        var sum = parseInt(this.addDeductFrom.val1) + parseInt(this.addDeductFrom.val2) + parseInt(this.addDeductFrom.val3) + parseInt(this.addDeductFrom.val4) + parseInt(this.addDeductFrom.val5);
        if(isNaN(sum)){
            return 0;
        }
        return sum;
    },
    // 1月份所得税
    JANtax(){
        return this.countIit(this.dataList[0].id,this.dataList[0].income,this.dataList[0].deduct,this.dataList[0].addDeduct,this.dataList[0].fixedDeduct);
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
.footer{
    margin-top: 20px;display: flex;justify-content:flex-end;
    p{margin: 0 10px;}
    span{margin-left: 10px;}
}
</style>






