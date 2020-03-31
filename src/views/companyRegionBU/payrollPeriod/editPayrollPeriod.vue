<template>
  <div class="editPayrollPeriod">
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-form-item label="应税及社保月份：">
        <el-input v-model="ruleForm.forMonth" class="setWidth" type="number" min="0" max="12"></el-input><span class="setTip">  0 表示与当前出粮月份一致，其他为对应增减。例如（1：下月社保，-2上上月社保）</span>
      </el-form-item>
      <el-form-item label="计粮周期起始日：">
        <el-input v-model="ruleForm.startDate" class="setWidth" type="number" min="0" max="31"></el-input><span class="setTip">  计粮周期起始日</span>
      </el-form-item>
      <el-form-item label="计粮周期截止日：">
        <el-input v-model="ruleForm.endDate" class="setWidth" type="number" min="0" max="31"></el-input><span class="setTip">  计粮周期截止日，31为当月最后一天</span>
      </el-form-item>
      <el-form-item label="薪水发放日：">
        <el-input v-model="ruleForm.payDay" class="setWidth" type="number" min="0" max="31"></el-input><span class="setTip">  薪水发放日，31为当月最后一天</span>
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
        forMonth:"0",
        startDate:"1",
        endDate:"31",
        payDay:"31",
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
        this.ruleForm.payDay = this.curInfo.payDay;
        this.ruleForm.remarks = this.curInfo.remarks;
      }
    },
    // 提交表单
    submitForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          var reqUrl = '/server/api/v1/payroll/payrollPeriodUpdate';
          this.$myApi.http.post(reqUrl,this.ruleForm).then(res => {
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
      
      this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style scoped lang="scss">
.setWidth{
  width:80px
}
.setTip{
  color: #ff6600;
}
</style>


