<template>
  <div class="addSTitems">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定提交</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "addSTitems",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        name: "",
        taxable: "",
        description: ""
      }, //表单信息
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    var _this = this;
    console.log(this.curInfo);
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.ruleForm.taxable = this.ruleForm.taxable.toString();
    }
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          if (_this.curInfo.type == "add") {
            _this.addFun();
          } else {
            _this.modifyFun();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/allowance/add";
      var data = {
        name: _this.ruleForm.name,
        taxable: Number(_this.ruleForm.taxable),
        description: _this.ruleForm.description
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message("添加成功~");
        } else {
          _this.$alert(res.data.msg, "提 示");
        }
      });
    },
    // 修改
    modifyFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/allowance/update";
      var data = {
        id: _this.ruleForm.id,
        name: _this.ruleForm.name,
        taxable: 0,
        description: _this.ruleForm.description
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message("修改成功~");
        } else {
          _this.$alert(res.data.msg, "提 示");
        }
      });
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


