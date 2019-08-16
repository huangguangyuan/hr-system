<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px">
      
      <el-form-item label="税前工资：" prop="salary">
        <el-input v-model="ruleForm.salary" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="是否正常缴纳社保：" prop="needSI">
        <el-radio-group v-model="ruleForm.needSI">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否正常缴纳公积金：" prop="needHC">
        <el-radio-group v-model="ruleForm.needHC">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否正常使用专项附加扣除：" prop="needSD">
        <el-radio-group v-model="ruleForm.needSD">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否正常扣税：" prop="needTaxRate">
        <el-radio-group v-model="ruleForm.needTaxRate">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状 态：" prop="typeId">
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">正常</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="强制缴纳类型：" prop="insuredTypeId">
        <el-radio-group v-model="ruleForm.insuredTypeId">
          <el-radio label="1">中国（社保，医保，公积金）</el-radio>
          <el-radio label="2">香港（MPF）</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        salary:'',
        needSI:'',
        needHC:'',
        needSD:'',
        needTaxRate:'',
        typeId:'',
        insuredTypeId:''
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      holidaysApplyTypeList: [], //请假类型
      rules: {
        salary: [
          { required: true, message: "请输入税前工资", trigger: "blur" }
        ],
        needSI: [
          { required: true, message: "请选择是否正常缴纳社保", trigger: "change" }
        ],
        needHC: [
          { required: true, message: "请选择是否正常缴纳公积金", trigger: "change" }
        ],
        needSD: [
          { required: true, message: "请选择是否正常使用专项附加扣除", trigger: "change" }
        ],
        needTaxRate: [
          { required: true, message: "是否正常扣税", trigger: "change" }
        ],
        typeId: [
          { required: true, message: "请选择请假类型", trigger: "change" }
        ],
        insuredTypeId: [
          { required: true, message: "请选择请强制缴纳类型", trigger: "change" }
        ],
      }
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      
      if(this.curInfo.type == 'modify'){
        this.ruleForm.salary = this.curInfo.salary;
        this.ruleForm.needSI = this.curInfo.needSI.toString();
        this.ruleForm.needHC = this.curInfo.needHC.toString();
        this.ruleForm.needSD = this.curInfo.needSD.toString();
        this.ruleForm.needTaxRate = this.curInfo.needTaxRate.toString();
        this.ruleForm.typeId = this.curInfo.typeId.toString();
        this.ruleForm.insuredTypeId = this.curInfo.insuredTypeId.toString();
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollConfigEdit";
      var data = {
        staffCode:this.curInfo.staffCode,
        salary:parseFloat(this.ruleForm.salary),
        needSI:parseInt(this.ruleForm.needSI),
        needHC:parseInt(this.ruleForm.needHC),
        needSD:parseInt(this.ruleForm.needSD),
        needTaxRate:parseInt(this.ruleForm.needTaxRate),
        typeId:parseInt(this.ruleForm.typeId),
        insuredTypeId:parseInt(this.ruleForm.insuredTypeId)
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("更新成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


