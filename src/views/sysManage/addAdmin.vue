<template>
  <div class="addAdmin">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="新增管理员类型：" prop="addType">
        <el-radio-group v-model="ruleForm.addType">
          <el-radio label="admin">后台管理员</el-radio>
          <el-radio label="HRadmin">HR系统管理员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账户名：" prop="account">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
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
import md5 from 'js-md5'
export default {
  name: "addAdmin",
  inject:['reload'],
  data() {
    return {
      ruleForm: {
        addType: "",
        account: "",
        password: "",
        name:"",
        status: "",
        email: "",
        mobile: "",
        superCode: "15a1ede0-2818-11e8-9aae-1fc72b92c9af"
      },
      rules: {
        addType: [
          { required: true, message: "请选择管理员类型", trigger: "change" }
        ],
        account: [
          { required: true, message: "请输入账号名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择管理员状态", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/,message: "请输入正确的手机号码",trigger: ["blur"]},
        ],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          { pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,message: "请输入正确的邮箱号",trigger: ["blur"]},
        ]
      }
    };
  },
  methods: {
    //提交表单
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(_this.ruleForm.addType == 'admin'){
              _this.addAmdinFn();
          }else{
              _this.addHRadminFn();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增后台管理员
    addAmdinFn(){
        var _this = this;
        var reqUrl = '/server/api/v1/admin/add';
        var data = {
            "account": _this.ruleForm.account,
            "email": _this.ruleForm.email,
            "password": md5(_this.ruleForm.password),
            "mobile": _this.ruleForm.mobile,
            "superCode": _this.ruleForm.superCode,
            "status":parseInt(_this.ruleForm.status),
            "name": _this.ruleForm.name
        }
        _this.$http.post(reqUrl,data).then(res => {
            _this.reload();
        }).catch(err => {
            console.log(err);
        })
    },
    // 新增HR管理员
    addHRadminFn(){
        var _this = this;
        var reqUrl = '/server/api/v1/admin/addHr';
        var data = {
            "account": _this.ruleForm.account,
            "email": _this.ruleForm.email,
            "password": md5(_this.ruleForm.password),
            "mobile": _this.ruleForm.mobile,
            "superCode": _this.ruleForm.superCode,
            "status":parseInt(_this.ruleForm.status),
            "name": _this.ruleForm.name
        }
        _this.$http.post(reqUrl,data).then(res => {
            _this.reload();
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




