<template>
  <div class="editLayer" v-if="!isLoding">
    <payroll-times-month-info :curInfo="curInfo"></payroll-times-month-info>
    <el-divider>本次出粮信息</el-divider>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="金额：" prop="totalAmount">
        <el-input v-model="ruleForm.totalAmount" oninput="value=value.replace(/[^\d.]/g,'')" style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="MPF强制：" prop="MPFAmount">
        <el-input v-model="ruleForm.MPFAmount" oninput="value=value.replace(/[^\d.]/g,'')" style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="MPF自愿：" prop="MPFAmountSelf">
        <el-input v-model="ruleForm.MPFAmountSelf" v-if="ruleForm.isInsured===true" oninput="value=value.replace(/[^\d.]/g,'')" style="width:153px;padding-right:15px"></el-input>
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
      isLoding:true,
      details:{},
      ruleForm: {
        id:"",
        payrollCode: "",
        totalAmount: 0,
        isInsured:0,
        MPFAmountSelf:0,
        MPFAmount:0,
        payDay: "",
        remarks: ""
      }, //表单信息
      isShow: true, //是否显示
      rules: {
        totalAmount: [
          { required: true, message: "请输入金额", trigger: "blur" }
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
      console.log(this.curInfo.staffPayrollInfo.staffInsuredInfoMPF)
      this.ruleForm.id = this.curInfo.id;
      if (this.curInfo.type == "modify") {
        this.ruleForm.id = this.curInfo.id;
        this.getItemFun();
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
        this.isLoding = false;
        if (res.data.code == 0) {
          this.ruleForm.totalAmount = res.data.data.totalAmount;
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
        payDay: this.$toolFn.timeFormat(this.ruleForm.payDay,'yyyy-MM-dd'),
        MPFAmount: this.ruleForm.MPFAmount,
        MPFAmountSelf: this.ruleForm.MPFAmountSelf,
        remarks: this.ruleForm.remarks,
        isInsured : this.ruleForm.isInsured ? 1 : 0
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesUpdate";
      var data = {
        id:this.curInfo.id,
        totalAmount: Number.parseFloat(this.ruleForm.totalAmount),
        MPFAmount: this.ruleForm.MPFAmount,
        MPFAmountSelf: this.ruleForm.MPFAmountSelf,
        isInsured : this.ruleForm.isInsured ? 1 : 0,
        payDay: this.$toolFn.timeFormat(this.ruleForm.payDay,'yyyy-MM-dd'),
        remarks: this.ruleForm.remarks
      };
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
    }
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


