<template>
  <div class="editPayrollPeriod">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px">
      <el-form-item label="每年可享有薪年假天数：">
        <el-input v-model="ruleForm.annualLeaveEntitled" class="setWidth" type="number" min="0" max="100"></el-input>
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
        <el-input v-model="ruleForm.annualLeaveRetain" class="setWidth" type="number" min="0" max="100"></el-input>
      </el-form-item>
      <el-form-item label="可保留天数清空日期：">
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
        annualLeaveEntitled:"10",
        annualLeaveWriteOffDate:new Date(new Date().getFullYear()+1 + "-01-01"),
        annualLeaveRetain:"0",
        annualLeaveRetainClearDate:new Date(new Date().getFullYear()+1 + "-03-01"),
        remarks:""
      }, //表单信息
      rules: {
        annualLeaveEntitled: [{required: true,message: "请填写每年可享有薪年假",trigger: "blur"}],
        annualLeaveWriteOffDate: [{ required: true, message: "请选择自定义年假清空日期", trigger: "change" }],
        annualLeaveRetain: [{required: true,message: "请填写年假清空后可保留天数",trigger: "blur"}],
        annualLeaveRetainClearDate: [{ required: true, message: "请选择可保留天数清空日期", trigger: "change" }],
      }
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
        if (this.curInfo.annualLeaveEntitled){
          this.ruleForm.annualLeaveEntitled = this.curInfo.annualLeaveEntitled;
        }
        if (this.curInfo.annualLeaveWriteOffDate){
          this.ruleForm.annualLeaveWriteOffDate = new Date(this.$toolFn.timeFormat(this.curInfo.annualLeaveWriteOffDate,"yyyy-MM-dd"));
        }
        if (this.curInfo.annualLeaveRetain){
          this.ruleForm.annualLeaveRetain = this.curInfo.annualLeaveRetain;
        }
        if (this.curInfo.annualLeaveRetainClearDate){
          this.ruleForm.annualLeaveRetainClearDate = new Date(this.$toolFn.timeFormat(this.curInfo.annualLeaveRetainClearDate,"yyyy-MM-dd"));
        }
        this.ruleForm.remarks = this.curInfo.remarks;
      }
    },
    // 提交表单
    submitForm(formName) {
      this.ruleForm.annualLeaveWriteOffDate = new Date((new Date().getFullYear()+1) + "-" + this.$toolFn.timeFormat(this.ruleForm.annualLeaveWriteOffDate,"MM-dd"));
      this.ruleForm.annualLeaveRetainClearDate = new Date((new Date().getFullYear()+1) + "-" +  this.$toolFn.timeFormat(this.ruleForm.annualLeaveRetainClearDate,"MM-dd"));
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.annualLeaveWriteOffDate > this.ruleForm.annualLeaveRetainClearDate){
            this.$message.error("年假保留天数清空日期不能早于年假清空日期");
            return false;
          }
          var postData = {
            BUCode:this.ruleForm.BUCode,
            annualLeaveWriteOffDate : this.$toolFn.timeFormat(this.ruleForm.annualLeaveWriteOffDate,"yyyy-MM-dd"),
            annualLeaveRetainClearDate : this.$toolFn.timeFormat(this.ruleForm.annualLeaveRetainClearDate,"yyyy-MM-dd"),
            annualLeaveEntitled : this.ruleForm.annualLeaveEntitled,
            annualLeaveRetain : this.ruleForm.annualLeaveRetain
          }
          var reqUrl = '/server/api/v1/bu/annualLeaveUpdate';
          this.$myApi.http.post(reqUrl,postData).then(res => {
            if(res.data.code == 0){
              this.$message.success('修改成功！');
              this.reload();
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
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
  width:120px
}
.setTip{
  color: #ff6600;
}
</style>


