<template>
  <div class="addChildren">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
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
  name: "addChildren",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        BUCode: "",
        name: "",
        description: "",
        status: ""
      }, //表单信息
      isShow: true, //是否显示
      rules: {
        BUCode: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择转态", trigger: "change" }]
      }
    };
  },
  mounted() {
    console.log(this.curInfo);
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.addFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增单位
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/buDepartment/childrenAdd";
      var data = {
        superCode:_this.curInfo.code,
        name:_this.ruleForm.name,
        description:_this.ruleForm.description,
        status:parseInt(_this.ruleForm.status),
      }
      _this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message("新增成功~");
        } else {
          _this.$message(res.data.msg);
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


