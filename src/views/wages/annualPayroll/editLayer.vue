<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px">
      <el-form-item label="税前金额：" prop="taxableWages">
        <el-input v-model="ruleForm.taxableWages" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>      
      <el-form-item label="个人所得税：" prop="taxAmount">
        <el-input v-model="ruleForm.taxAmount" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        year:0,
        month:0,
        staffCode:'',
        taxableWages:'',
        taxAmount:'',
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      rules: {
        taxableWages: [
          { required: true, message: "请输入税前金额", trigger: "blur" }
        ],
        taxAmount: [
          { required: true, message: "请输入个人所得税", trigger: "blur" }
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
        this.ruleForm.year = this.curInfo.year;
        this.ruleForm.month = this.curInfo.month;
        this.ruleForm.staffCode = this.curInfo.code;
        this.ruleForm.taxableWages = this.curInfo.taxableWages;
        this.ruleForm.taxAmount = this.curInfo.taxAmount;
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editFun() {
      var reqUrl = "/server/api/v1/payroll/staff/addOrUpdateStaffPayroll";
      var data = {
        year:parseInt(this.ruleForm.year),
        month:parseInt(this.ruleForm.month),
        staffCode:this.curInfo.staffCode,
        taxableWages:parseFloat(this.ruleForm.taxableWages),
        taxAmount:parseFloat(this.ruleForm.taxAmount)
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


