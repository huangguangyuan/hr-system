<template>
  <div class="modifyAccess">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="权限名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="权限代号：" prop="rightCode">
        <el-input v-model="ruleForm.rightCode"></el-input>
      </el-form-item>
      <el-form-item label="权限描述：" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="权限路径：" prop="menuUrl">
        <el-input v-model="ruleForm.menuUrl"></el-input>
      </el-form-item>
      <el-form-item label="排序号：">
        <el-input v-model="ruleForm.orderNo"></el-input>
      </el-form-item>
      <el-form-item label="自定义数据：" prop="addField1">
        <el-input v-model="ruleForm.addField1"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "modifyAccess",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        name: "",
        rightCode:"",
        description: "",
        menuUrl:"",
        isMenu:"",
        orderNo:0,
        addField1:""
      },
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: false, message: "请输入权限描述", trigger: "blur" }
        ],
        menuUrl: [
          { required: false, message: "请输入权限路径", trigger: "blur" }
        ],
      }
    };
  },
  mounted() {
    console.log(this.curInfo);
    var _this = this;
    _this.initializationFun();
  },
  methods: {
    // 初始化
    initializationFun(){
        var _this = this;
        _this.ruleForm.name = _this.curInfo.name;
        _this.ruleForm.rightCode = _this.curInfo.rightCode;
        _this.ruleForm.description = _this.curInfo.description;
        _this.ruleForm.menuUrl = _this.curInfo.menuUrl;
        _this.ruleForm.orderNo = _this.curInfo.orderNo;
        _this.ruleForm.addField1 = _this.curInfo.addField1;
    },
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.modifyFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改权限
    modifyFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/projectAccess/update";
      var data = {
        id:_this.curInfo.id,
        rightCode:_this.ruleForm.rightCode,
        menuUrl:_this.ruleForm.menuUrl,
        name: _this.ruleForm.name,
        description: _this.ruleForm.description,
        addField1: _this.ruleForm.addField1,
        orderNo:_this.ruleForm.orderNo
      };
      _this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          _this.reload();
        }
      })
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped lang="scss">
</style>




