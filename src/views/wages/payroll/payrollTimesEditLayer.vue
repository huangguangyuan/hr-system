<template>
  <div class="editLayer" v-if="!isLoading">
    <payroll-times-month-info :curInfo="curInfo"></payroll-times-month-info>
    <el-divider>本次出粮信息</el-divider>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="应税金额：" prop="totalAmount">
        <el-input v-model="ruleForm.totalAmount"  type="number" oninput="value=value.replace(/[^\d.]/g,'')" style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="非应税金额：" prop="notTaxableAmount">
        <el-input v-model="ruleForm.notTaxableAmount"  type="number" oninput="value=value.replace(/[^\d.]/g,'')" style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="MPF强制：" prop="MPFAmount">
        <el-input v-model="ruleForm.MPFAmount"  type="number" oninput="value=value.replace(/[^\d.]/g,'')" style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="MPF自愿：" prop="MPFAmountSelf">
        <el-input v-model="ruleForm.MPFAmountSelf" type="number" v-if="ruleForm.isInsured === true" oninput="value=value.replace(/[^\d.]/g,'')" style="width:153px;padding-right:15px"></el-input>
        <el-checkbox v-model="ruleForm.isInsured" >缴纳</el-checkbox> 
      </el-form-item>
      <el-form-item label="出粮日期：" prop="payDay">
        <el-date-picker
          v-model="ruleForm.payDay"
          type="date"
          placeholder="出粮日期"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {} from "@/lib/staticData.js";
import payrollTimesMonthInfo from "./payrollTimesMonthInfo.vue";
export default {
  components: {
    payrollTimesMonthInfo
  },
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    const checkMPFAmountSelf = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写MPF自愿金额'))
      }else{
        callback()
      }
    }
    return {
      isLoading:true,
      balanceAmount:0, // 剩余发放金额
      details:{},
      payrollTimesSummary:{},
      staffInsuredInfoMPF:{},
      ruleForm: {
        id:"",
        payrollCode: "",
        totalAmount: 0,
        notTaxableAmount:0,
        isInsured:0,
        MPFAmountSelf:0,
        MPFAmount:0,
        payDay: "",
        MPFCalc:false,
        remarks: ""
      }, //表单信息
      isShow: true, //是否显示
      rules: {
        totalAmount: [
          { required: true, message: "请输入应税金额", trigger: "blur" }
        ],
        notTaxableAmount: [
          { required: true, message: "请输入非应税金额", trigger: "blur" }
        ],
        MPFAmount: [
          { required: true, message: "请输入MPF金额", trigger: "blur" }
        ],
        MPFAmountSelf: [
          { required: true, trigger: 'blur', validator: checkMPFAmountSelf }
        ],        
        payDay: [
          { required: true, message: "请选择出粮日期", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      this.details = this.curInfo;
      this.details.payroll = this.curInfo.payrollMainInfo;
      this.staffInsuredInfoMPF = this.curInfo.staffPayrollInfo.staffInsuredInfoMPF;
      this.ruleForm.id = this.curInfo.id;
      this.ruleForm.MPFAmountSelf = this.staffInsuredInfoMPF.mpfVoluntarily;
      this.payrollTimesSummaryFn();
      if (this.curInfo.type == "modify") {
        this.ruleForm.id = this.curInfo.id;
        this.getItemFun();
      }else{
        this.isLoading = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.curInfo.type) {
            case "add":
              this.addFun();
              break;
            case "modify":
              this.modifyFun();
              break;
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 获取详情
     */
    getItemFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesItem";
      var data = {
        id: this.ruleForm.id
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        this.isLoading = false;
        if (res.data.code == 0) {
          this.ruleForm.totalAmount = res.data.data.totalAmount;
          this.ruleForm.notTaxableAmount = res.data.data.notTaxableAmount;
          this.ruleForm.MPFAmount = res.data.data.MPFAmount;
          this.ruleForm.MPFAmountSelf = res.data.data.MPFAmountSelf;
          this.ruleForm.payDay = res.data.data.payDay;
          this.ruleForm.remarks = res.data.data.remarks;
          this.ruleForm.isInsured = res.data.data.isInsured === 1 ? true : false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesAdd";
      var data = {
        payrollCode: this.ruleForm.payrollCode,
        totalAmount: Number.parseFloat(this.ruleForm.totalAmount),
        notTaxableAmount: Number.parseFloat(this.ruleForm.notTaxableAmount),
        payDay: this.$toolFn.timeFormat(this.ruleForm.payDay,'yyyy-MM-dd'),
        MPFAmount: this.ruleForm.MPFAmount,
        MPFAmountSelf: 0,
        remarks: this.ruleForm.remarks,
        isInsured : this.ruleForm.isInsured ? 1 : 0,
        MPFCalc:this.ruleForm.MPFCalc
      };
      if (data.isInsured === 1){
        if (this.payrollTimesSummary.MPFAmountSelfSum > 0){
          this.$message.error("自愿缴纳已经缴纳");
          return;
        }
        data.MPFAmountSelf = this.ruleForm.MPFAmountSelf;
      }
      if ( data.notTaxableAmount + this.payrollTimesSummary.notTaxableAmountSum > this.details.payroll.notTaxableAmount){
        this.$message.error("出粮非应税金额大于剩余总非应税金额");
        return;
      }
      if (this.balanceAmount + data.notTaxableAmount - data.totalAmount - data.MPFAmount - data.MPFAmountSelf < 0){
        this.$message.error("出粮金额大于剩余出粮金额");
        return;
      }

      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**
     * @description: 多次出粮汇总数据
     */
    payrollTimesSummaryFn() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesSummary";
      var data = {
        payrollCode:this.curInfo.payrollMainInfo.code
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.payrollTimesSummary = res.data.data;
          this.balanceAmount = this.details.payroll.totalAmount - this.payrollTimesSummary.MPFAmountSum - this.payrollTimesSummary.MPFAmountSelfSum - this.payrollTimesSummary.totalAmountSum
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesUpdate";
      var data = {
        id:this.curInfo.id,
        totalAmount: Number.parseFloat(this.ruleForm.totalAmount),
        notTaxableAmount: Number.parseFloat(this.ruleForm.notTaxableAmount),
        MPFAmount:  Number.parseFloat(this.ruleForm.MPFAmount),
        // MPFAmountSelf: this.ruleForm.MPFAmountSelf,
        isInsured : this.ruleForm.isInsured ? 1 : 0,
        payDay: this.$toolFn.timeFormat(this.ruleForm.payDay,'yyyy-MM-dd'),
        remarks: this.ruleForm.remarks
      };
      if (this.ruleForm.isInsured){
        data.MPFAmountSelf =  Number.parseFloat(this.ruleForm.MPFAmountSelf)
      }
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功");
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    },
    /**
     * @description: 计算MPF
     * amt 本次输入金额
     * amtPaid 未计算MPF的多次出粮总额
     * amtMPFPaid 多次出粮MPF总额
     */
    calMPF(amt,amtPaid,amtMPFPaid) {
      let payment = 0.00;
      amt = amt + amtMPFPaid;
      const model = this.staffInsuredInfoMPF.MPFSchemeDetail.schemeMPFList[0];
      if (amtMPFPaid >= model.baseUpper){// 如果已缴纳是MPF最高基数，则不再缴纳
        return payment;
      }
      let paymentRatio = Number.parseFloat(amt * model.paymentRatio) ;
      if (paymentRatio <= Number.parseFloat(model.baseLower)){
        payment = 0;
      }else if (paymentRatio >= Number.parseFloat(model.baseUpper)){
        payment = model.baseUpper;
      }else{
        payment = paymentRatio;
      }
      if (amtMPFPaid + payment > model.baseUpper){ // 如果即将缴纳MPF与已缴纳MPF大于最高基数，则即将缴纳为 （最高基数 - 已缴纳MPF）
        payment = model.baseUpper - amtMPFPaid;
      }
      if (payment > 0){ // 如果缴纳MPF不为0，则把未计算的出粮金额设置为已参与计算
        this.ruleForm.MPFCalc = true
      }
      payment = Number.parseFloat(payment.toFixed(2));
      return payment;
    }
  },
  watch:{
    "ruleForm.totalAmount":{
      handler: function(newVal) {
        this.ruleForm.MPFAmount = this.calMPF(newVal,this.payrollTimesSummary.MPFCalcAmount,this.payrollTimesSummary.MPFAmountSum);
      }
    },
  }
};
</script>
<style scoped lang="scss">
.editLayer{
  .el-card {
    margin-bottom: 12px;
  }
}

</style>


