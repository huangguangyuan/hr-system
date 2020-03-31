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
    
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.ruleForm.taxable = this.ruleForm.taxable.toString();
    }
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.curInfo.type == "add") {
            this.addFun();
          } else {
            this.modifyFun();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加
    addFun() {
      
      var reqUrl = "/server/api/v1/claim/add";
      var data = {
        name: this.ruleForm.name,
        taxable: Number(this.ruleForm.taxable),
        description: this.ruleForm.description
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message("添加成功~");
        } else {
          this.$alert(res.data.msg, "提 示");
        }
      });
    },
    // 修改
    modifyFun() {
      
      var reqUrl = "/server/api/v1/claim/update";
      var data = {
        id: this.ruleForm.id,
        name: this.ruleForm.name,
        taxable: 0,
        description: this.ruleForm.description
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message("修改成功~");
        } else {
          this.$alert(res.data.msg, "提 示");
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
<style scoped lang="scss">
</style>


