<template>
  <div class="editPayrollPeriod">
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-form-item label="应税及社保月份：">
        <el-input v-model="ruleForm.forMonth"></el-input>
      </el-form-item>
      <el-form-item label="计粮周期起始日：">
        <el-input v-model="ruleForm.startDate"></el-input>
      </el-form-item>
      <el-form-item label="计粮周期截止日：">
        <el-input v-model="ruleForm.endDate"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>      
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editPayrollPeriod",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        BUCode: "",
        forMonth:"",
        startDate:"",
        endDate:"",
        remarks:""
      }, //表单信息
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      if (this.curInfo){
        this.ruleForm.BUCode = this.curInfo.BUCode;
        this.ruleForm.forMonth = this.curInfo.forMonth;
        this.ruleForm.startDate = this.curInfo.startDate;
        this.ruleForm.endDate = this.curInfo.endDate;
        this.ruleForm.remarks = this.curInfo.remarks;
      }
    },
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          var reqUrl = '/server/api/v1/payroll/payrollPeriodUpdate';
          this.$http.post(reqUrl,this.ruleForm).then(res => {
            if(res.data.code == 0){
              this.$message.success('修改成功！');
              this.reload();
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style scoped lang="scss">
</style>


