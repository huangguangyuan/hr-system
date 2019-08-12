<template>
  <div class="editCityTemplate">
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <el-form-item label="所在城市：">
        <el-input v-model="ruleForm.name" readonly="readonly" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定修改</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editCityTemplate",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        code: "",
        name:"",
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
      this.ruleForm.code = this.curInfo.code;
      this.ruleForm.name = this.curInfo.name;
      this.ruleForm.remarks = this.curInfo.remarks;
    },
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          var reqUrl = '/server/api/v1/bu/cityUpdate';
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


