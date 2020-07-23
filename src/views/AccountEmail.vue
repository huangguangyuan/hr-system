<template>
  <div class="login">
    <div class="container">
      <div class="title-container">
        <h5 class="title">取回密码</h5>
      </div>
      <el-form
        label-position="left"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
        @submit.native.prevent
        v-if="showType === 1 "
      >
        <el-form-item label="用户名" prop="user">
          <el-input prefix-icon="el-icon-edit" v-model="formLabelAlign.user" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input prefix-icon="el-icon-s-promotion" v-model="formLabelAlign.email" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" >提交</el-button>
        </el-form-item>
      </el-form>
      <div class="showTip" v-if="showType === 2">
        <div class="show-text">
          <div class="icon"><i class="el-icon-alarm-clock"></i></div><div class="text"><span>邮件已经发送</span><br />
        您的密码修改链接已经发送到邮箱，请尽快操作，谢谢<br /></div> </div>
      </div>
    </div>
  </div>
</template>
<script>
import sidebarInfo from "@/lib/sidebarInfo.js";
import Cookies from 'js-cookie'
export default {
  name: "login",
  data() {
    return {
      showType:1,
      rediredUrl:'',
      formLabelAlign: {
        user: "teststaff",
        email: "80223120@qq.com"
      },
      rules: {
        user: [{ required: true, message: '请输入账户', trigger: "blur" }],
        email: [{ required: true, message: '请输入邮箱', trigger: "blur" }]
      },
      temporaryData: sidebarInfo
    };
  },
  mounted(){
  },
  created () {
    /**
     * 按回车键执行登录
     */
    document.onkeypress = (e) => {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        this.submitForm('ruleForm')
        return false
      }
    }
  },
  methods: {
    handleCommand(command) {
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
      var reqUrl = "/open/api/v1/sentLinkByAccountEmail";
      var data = {
        account: this.formLabelAlign.user,
        email: this.formLabelAlign.email
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.showType = 2;
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
  
  .showTip{
    font-size: 14px;
    .show-text{
      display: flex;
      justify-content: center;
      line-height: 30px;
      .icon{
        color:#1989fa;
        i{
          font-size: 60px;
        }
      }
      .text{
        padding-left:10px;
      }
      span{
        font-size:14px;
        padding-bottom: 5px;
        display: inline-block;
        color:#ff6600;
      }
      text-align:left;
      color:#888;
    }
  }
}
</style>





