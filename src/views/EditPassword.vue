<template>
  <div class="login">
    <div class="container">
        
        <div class="title-container">
          <h5 class="title">修改密码</h5>
    </div>
      <el-form
        label-position="left"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
        @submit.native.prevent
      >
        <el-form-item label="密码" prop="pass1">
          <el-input prefix-icon="el-icon-edit" v-model="formLabelAlign.pass1" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="pass2">
          <el-input prefix-icon="el-icon-setting" v-model="formLabelAlign.pass2" show-password ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" >提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import sidebarInfo from "@/lib/sidebarInfo.js";
export default {
  name: "login",
  data() {
    return {
      code:this.$route.params.code,
      rediredUrl:'',
      formLabelAlign: {
        // user: "testHrAdmin01",
        // pass: "000000"
        pass1: "",
        pass2: ""
      },
      rules: {
        pass1: [{ required: true, message: '请输入密码', trigger: "blur" }],
        pass2: [{ required: true, message: '请再次输入密码', trigger: "blur" }]
      },
      temporaryData: sidebarInfo
    };
  },
  mounted(){
    console.log(this.code)
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editPassword();
        } else {
          return false;
        }
      });
    },
    // 登录
    editPassword() {
      var reqUrl = "/open/api/v1/updatePasswordByLink";
      if (this.formLabelAlign.pass1 !== this.formLabelAlign.pass2){
        this.$message.error('两次密码输入不一致');
        return;
      }
      var data = {
        code: this.code,
        password: md5(this.formLabelAlign.pass1)
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$message.info("密码修改成功，请重新登录系统");
          var returnUrl = "/";
          if (res.data.data.roleTypeId === 1 || res.data.data.roleTypeId === 2){
            returnUrl = "/hr";
          }
          this.$router.replace({
              path: returnUrl // 到登录页重新获取token
            });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
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
  
}
</style>





