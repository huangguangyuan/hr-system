<template>
  <div class="login">
    <div class="container">
      <div class="title-container">
        <h5 class="title">{{$t('AdminLogin.title')}}</h5>
        <div class="languageContent">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{$t('common.language')}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
      </div>
      <el-form
        label-position="left"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item :label="$t('AdminLogin.user')" prop="user">
          <el-input prefix-icon="el-icon-edit" v-model="formLabelAlign.user"></el-input>
        </el-form-item>
        <el-form-item :label="$t('AdminLogin.pass')" prop="pass">
          <el-input prefix-icon="el-icon-setting" v-model="formLabelAlign.pass" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t('AdminLogin.loginBtn')}}</el-button>
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
import Cookies from 'js-cookie'
export default {
  name: "login",
  data() {
    return {
      formLabelAlign: {
        user: "admin",
        pass: "000000"
      },
      rules: {
        user: [{ required: true, message: this.$t('AdminLogin.userTip'), trigger: "blur" }],
        pass: [{ required: true, message: this.$t('AdminLogin.passTip'), trigger: "blur" }]
      },
      temporaryData: sidebarInfo
    };
  },
  created () {
    /**
     * 按回车键执行登录
     */
    document.onkeypress = (e) => {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        this.submitForm('ruleForm') // 登录方法名
        return false
      }
    }
  },
  methods: {
    handleCommand(command) {
      this.$i18n.locale = command;
      Cookies.set("language", command, { expires: 7 });
    },
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
      var reqUrl = "/open/api/v1/admin/login";
      var data = {
        account: this.formLabelAlign.user,
        password: md5(this.formLabelAlign.pass)
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          //var sidebar = this.temporaryData;
          sessionStorage.clear();
          localStorage.clear();
          this.$store.commit({
            type: "getNavTabs",
            navTabs: []
          });
          this.$toolFn.localSet("userInfo", res.data.data.data);
          var sidebar = res.data.data.data.roles[0].menuList.map(item => {
            item.id = item.id.toString();
            return item;
          });
          
          this.$store.dispatch("add_Routes", sidebar).then(res => {
              return this.$store.dispatch('getAccessData_Fun',sidebar)
            }).then(res => {
              var userInfo = this.$toolFn.localGet("userInfo");
              if (userInfo.roleTypeId == 4){
                if (userInfo.lev < 210 && userInfo.lev >= 201){
                  this.$router.replace({ path: "/companyList" });
                }else if (userInfo.lev < 220 && userInfo.lev >= 211){
                  this.$router.replace({ path: "/regionList" });
                }else if (userInfo.lev < 230 && userInfo.lev >= 221){
                  this.$router.replace({ path: "/BUMain" });
                }
              }else if (userInfo.roleTypeId == 3){
                this.$router.replace({ path: "/adminList" });
              }
            })
        } else {
          this.$message.error(res.data.msg);
        }
      });
      // this.$store.dispatch('getAccessData_Fun',res.data.data.data.roles[0].accessList).then(res => {
      //       console.log(res);
      //     });
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
  .title-container {
    .languageContent{
      float: right;
      margin-top:-25px;
      padding-right:15px;
    }
  }
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





