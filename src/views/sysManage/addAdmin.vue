<template>
  <div class="addAdmin">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="账户名：" prop="account">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="mobile">
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  name: "addAdmin",
  inject: ["reload"],
  props: ["modifyInfo"],
  data() {
    return {
      ruleForm: {
        account: "",
        password: "",
        name: "",
        status: "",
        email: "",
        mobile: "",
        superCode: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入帐号名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择管理员状态", trigger: "change" }
        ],
        mobile: [
          { required: false, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "请输入正确的手机号码",
            trigger: ["blur"]
          }
        ],
        email: [
          { required: false, message: "请输入电子邮箱", trigger: "blur" },
          {
            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            message: "请输入正确的邮箱",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  mounted() {
    if(this.modifyInfo.adminType == 'customerAdmin'){
      this.ruleForm.superCode = this.modifyInfo.code;
    }
  },
  methods: {
    //提交表单
    submitForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch(this.modifyInfo.adminType){
            case 'admin':
              this.addAmdinFn();
              break;
            case 'customerAdmin':
              this.addCustomerFn();
              break;
          }
        } else {
          
          return false;
        }
      });
    },
    // 新增后台管理员
    addAmdinFn() {
      var reqUrl = '/server/api/v1/admin/add';
      var data = {
        account: this.ruleForm.account,
        email: this.ruleForm.email,
        password: md5(this.ruleForm.password),
        mobile: this.ruleForm.mobile,
        status: parseInt(this.ruleForm.status),
        name: this.ruleForm.name
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$message("新增成功");
          this.reload();
        } else {
          this.$message(res.data.msg);
          return false;
        }
      })
    },
    // 新增客户管理员子帐号
    addCustomerFn(){
      var reqUrl = '/server/api/v1/admin/client/childrenAdd';
      var data = {
        account: this.ruleForm.account,
        email: this.ruleForm.email,
        password: md5(this.ruleForm.password),
        mobile: this.ruleForm.mobile,
        superCode: this.ruleForm.superCode,
        status: parseInt(this.ruleForm.status),
        name: this.ruleForm.name
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$message("新增成功");
          this.reload();
        } else {
          this.$message(res.data.msg);
          return false;
        }
      })
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowAddAdmin", false);
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




