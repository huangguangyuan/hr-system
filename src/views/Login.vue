<template>
  <div class="login">
    <div class="container">
        
        <div class="title-container">
          <h5 class="title">{{$t('Login.title')}}</h5>
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
        @submit.native.prevent
      >
        <el-form-item :label="$t('Login.user')" prop="user">
          <el-input prefix-icon="el-icon-edit" v-model="formLabelAlign.user" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('Login.pass')" prop="pass">
          <el-input prefix-icon="el-icon-setting" v-model="formLabelAlign.pass" show-password ></el-input>
        </el-form-item>
        <div class="forget"><span @click="goLink()">忘记密码</span></div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" >{{$t('Login.loginBtn')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import sidebarInfo from "@/lib/sidebarInfo.js";
import Cookies from 'js-cookie'
export default {
  name: "login",
  data() {
    return {
      rediredUrl:'',
      formLabelAlign: {
        // user: "testHrAdmin01",
        // pass: "000000"
        user: "",
        pass: ""
      },
      rules: {
        user: [{ required: true, message: this.$t('Login.userTip'), trigger: "blur" }],
        pass: [{ required: true, message: this.$t('Login.passTip'), trigger: "blur" }]
      },
      temporaryData: sidebarInfo
    };
  },
  mounted(){
    this.rediredUrl = this.$toolFn.getQueryString('redirect')
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
    goLink(){
      this.$router.push({path:'/accountEmail'})
    },
    handleCommand(command) {
      this.$i18n.locale = command;
      Cookies.set("language", command, { expires: 7 });
    },
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loginFn();
        } else {
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
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          // var sidebar = this.temporaryData;
          sessionStorage.clear();
          localStorage.clear();
          this.$store.commit({
            type: "getNavTabs",
            navTabs: []
          });
          this.$toolFn.localSet("userInfo", res.data.data.data);
          var sidebar = res.data.data.data.menuList.map(item => {
            item.id = item.id.toString();
            return item;
          });
          
          this.$store.dispatch("add_Routes", sidebar).then(res => {
              return this.$store.dispatch('getAccessData_Fun',sidebar)
            }).then(res => {
              var userInfo = this.$toolFn.localGet("userInfo");
              if (userInfo.roleTypeId == 1){
                this.$router.replace({ path: "/applyMain" });
              }else{
                if (this.rediredUrl && this.rediredUrl !==''){
                  this.$router.replace({ path: this.rediredUrl });
                }else{
                  this.$router.replace({ path: "/home" });
                }
              }
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
   .title-container {
    .languageContent{
      display:none;
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
  .forget{
    font-size: 14px;
    text-align:right;
    color: #606266;
    cursor: pointer;
    
  }
}
</style>





