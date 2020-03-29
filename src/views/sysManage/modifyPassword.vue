<template>
  <div class="modifyPassword">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="账户名：">
        <el-input v-model="ruleForm.account" readonly></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import md5 from 'js-md5'
export default {
  name: "modifyPassword",
  inject:['reload'],
  props:['modifyInfo'],
  data() {
    return {
      ruleForm: {
        id:0,
        account:"",
        password:"",
        superCode: "15a1ede0-2818-11e8-9aae-1fc72b92c9af"
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      }
    };
  },
  mounted(){
      console.log(this.modifyInfo);
      this.initFn();
  },
  methods: {
    //初始化
    initFn(){
        this.ruleForm.id = this.modifyInfo.id;
        this.ruleForm.account = this.modifyInfo.account;
    },
    //提交表单
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
            if(_this.modifyInfo.adminType == 'admin'){
                _this.modifyAmdinFn();
            }else{
                _this.modifyHRadminFn();
            }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改后台管理员信息
    modifyAmdinFn(){
        var _this = this;
        var reqUrl = '/server/api/v1/admin/editPwd';
        var data = {
            "id":_this.ruleForm.id,
            "password": md5(_this.ruleForm.password),
            "superCode": _this.ruleForm.superCode
        }
        _this.$myApi.http.post(reqUrl,data).then(res => {
          if (res.data.code == 0) {
            _this.reload();
            _this.$message('修改成功！');
          }
        }).catch(err => {
            console.log(err);
        })
    },
    // 修改HR管理员
    modifyHRadminFn(){
        var _this = this;
        var reqUrl = '/server/api/v1/admin/hrSys/editPwd';
        var data = {
            "id":_this.ruleForm.id,
            "password": md5(_this.ruleForm.password),
            "superCode": _this.ruleForm.superCode
        }
        _this.$myApi.http.post(reqUrl,data).then(res => {
          if (res.data.code == 0) {
            _this.reload();
            _this.$message('修改成功！');
          }
        }).catch(err => {
            console.log(err);
        })
    },
    // 取消
    cancelFn(){
      var _this = this;
      _this.$emit('listenIsShowAddAdmin',false);
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




