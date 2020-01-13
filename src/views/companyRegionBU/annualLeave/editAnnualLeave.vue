<template>
  <div class="editPayrollPeriod">
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-form-item label="每年可享有薪年假：">
        <el-input v-model="ruleForm.forMonth" class="setWidth" type="number" min="0" max="100"></el-input>
      </el-form-item>
      <el-form-item label="自定义年假清空日期：">
        <el-date-picker
            v-model="ruleForm.annualLeaveWriteOffDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="年假清空后可保留天数：">
        <el-input v-model="ruleForm.annualLeaveRetain" class="setWidth" type="number" min="0" max="1000"></el-input>
      </el-form-item>
      <el-form-item label="年假清空后可保留天数清空日期：">
          <el-date-picker
            v-model="ruleForm.annualLeaveRetainClearDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
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
        this.ruleForm.annualLeaveEntitled = this.curInfo.annualLeaveEntitled;
        this.ruleForm.annualLeaveWriteOffDate = this.curInfo.annualLeaveWriteOffDate;
        this.ruleForm.annualLeaveRetain = this.curInfo.annualLeaveRetain;
        this.ruleForm.annualLeaveRetainClearDate = this.curInfo.annualLeaveRetainClearDate;
        this.ruleForm.remarks = this.curInfo.remarks;
      }
    },
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          var reqUrl = '/server/api/v1/bu/annualLeaveUpdate';
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
.setWidth{
  width:80px
}
.setTip{
  color: #ff6600;
}
</style>


