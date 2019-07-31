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
      <el-form-item  label="服务归属：" prop="serveId" v-if='userRight && modifyInfo.adminType=="HRadmin"'>
        <el-radio-group v-model="ruleForm.serveId">
          <el-radio :label="1">单位</el-radio>
          <el-radio :label="2">区域</el-radio>
          <el-radio :label="3">公司</el-radio>
        </el-radio-group>
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
  props: ["modifyInfo","userRight"],
  data() {
    return {
      ruleForm: {
        id: 0,
        name: "",
        email: "",
        mobile: "",
        serveId:"",
        userRight:true
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: false, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请输入正确的手机号码",
            trigger: ["blur"]
          }
        ],
        email: [
          { required: false, message: "请输入电子邮箱", trigger: "blur" },
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
    this.userRight = this.userRight;
  },
  methods: {
    //初始化
    initFn() {
      this.ruleForm.id = this.modifyInfo.id;
      this.ruleForm.name = this.modifyInfo.name;
      this.ruleForm.email = this.modifyInfo.email;
      this.ruleForm.mobile = this.modifyInfo.mobile;
      this.ruleForm.serveId = this.modifyInfo.serveId;
    },
    //提交表单
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch(this.modifyInfo.adminType)
          {
            case 'admin':
              _this.modifyAmdinFn();
              break;
            case 'HRadmin':
              _this.modifyHRadminFn();
              break;
            case 'customerAdmin':
              _this.modifyAmdinFn();
              break;
          }
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
        name: _this.ruleForm.name,
        serveId : _this.ruleForm.serveId
      };
      _this.$http.post(reqUrl, data).then(res => {
          _this.reload();
          this.$message("修改成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改HR管理员
    modifyHRadminFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/hrSys/update";
      var data = {
        id:_this.ruleForm.id,
        email: _this.ruleForm.email,
        mobile: _this.ruleForm.mobile,
        name: _this.ruleForm.name,
        serveId:_this.ruleForm.serveId
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




