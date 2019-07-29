<template>
  <div class="login">
    <div class="container">
      <h5>HR人事及薪酬登录系统</h5>
      <el-form
        label-position="left"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="账 号：" prop="user">
          <el-input prefix-icon="el-icon-edit" v-model="formLabelAlign.user"></el-input>
        </el-form-item>
        <el-form-item label="密 码：" prop="pass">
          <el-input prefix-icon="el-icon-setting" v-model="formLabelAlign.pass" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
          <!-- <el-button type="danger">注 册</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import sidebarInfo from "@/lib/sidebarInfo.js";
import { setTimeout } from "timers";
export default {
  name: "login",
  data() {
    return {
      formLabelAlign: {
        user: "admin",
        pass: "000000"
      },
      rules: {
        user: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
        pass: [{ required: true, message: "请输入用户密码", trigger: "blur" }]
      },
      temporaryData: sidebarInfo
    };
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loginFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 登录
    loginFn() {
      var reqUrl = "/open/api/v1/hrSys/login";
      var data = {
        account: this.formLabelAlign.user,
        password: md5(this.formLabelAlign.pass)
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          // var sidebar = this.temporaryData;
          this.$toolFn.localSet("userInfo", res.data.data.data);
          var sidebar = res.data.data.data.roles[0].menuList.map(item => {
            item.id = item.id.toString();
            return item;
          });
          this.$store
            .dispatch("add_Routes", sidebar)
            .then(res => {
              return this.$store.dispatch('getAccessData_Fun',sidebar)
            }).then(res => {
              this.$router.replace({ path: "/home" });
            })
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 递归算法
    recursionFun(arr) {
      return arr.map(item => {
        item.id = item.code;
        item.authUrl = item.menuUrl;
        item.iconUrl = "el-icon-menu";
        if (item.items) {
          this.recursionFun(item.items);
        }
        return item;
      });
    }
  }
};
</script>
<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: url("../assets/images/login-bg.jpg") center center no-repeat;
  .container {
    position: absolute;
    width: 550px;
    padding: 50px 0;
    background-color: rgba(255, 255, 255, 0.8);
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    transition: 0.5s all;
    box-shadow: 0 0 30px #409eff;
    border: 1px solid #409eff;
    h5 {
      font-size: 25px;
      text-align: center;
      font-weight: 500;
    }
    .el-form {
      width: 400px;
      margin: 30px auto;
    }
  }
  .container:hover {
    border-radius: 30px;
    input {
      outline: none;
    }
  }
}
</style>





