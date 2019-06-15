<template>
  <div class="modifyAdmin">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="mobile">
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  name: "modifyAdmin",
  inject: ["reload"],
  props: ["modifyInfo"],
  data() {
    return {
      ruleForm: {
        id: 0,
        name: "",
        email: "",
        mobile: "",
        superCode: "15a1ede0-2818-11e8-9aae-1fc72b92c9af"
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请输入正确的手机号码",
            trigger: ["blur"]
          }
        ],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          {
            pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            message: "请输入正确的邮箱号",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  mounted() {
    this.initFn();
  },
  methods: {
    //初始化
    initFn() {
      this.ruleForm.id = this.modifyInfo.id;
      this.ruleForm.name = this.modifyInfo.name;
      this.ruleForm.email = this.modifyInfo.email;
      this.ruleForm.mobile = this.modifyInfo.mobile;
    },
    //提交表单
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.modifyAmdinFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改管理员信息
    modifyAmdinFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/update";
      var data = {
        id: _this.ruleForm.id,
        email: _this.ruleForm.email,
        mobile: _this.ruleForm.mobile,
        name: _this.ruleForm.name
      };
      _this.$http
        .post(reqUrl, data)
        .then(res => {
          _this.reload();
          this.$message("修改成功~");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改HR管理员
    modifyHRadminFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/addHr";
      var data = {
        account: _this.ruleForm.account,
        email: _this.ruleForm.email,
        password: md5(_this.ruleForm.password),
        mobile: _this.ruleForm.mobile,
        name: _this.ruleForm.name
      };
      _this.$http
        .post(reqUrl, data)
        .then(res => {
          _this.reload();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改客户管理员
    modifyCustomFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/client/update";
      var data = {
        id: _this.ruleForm.id,
        email: _this.ruleForm.email,
        mobile: _this.ruleForm.mobile,
        name: _this.ruleForm.name
      };
      _this.$http
        .post(reqUrl, data)
        .then(res => {
          _this.reload();
          this.$message("修改成功~");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowAddAdmin", false);
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




