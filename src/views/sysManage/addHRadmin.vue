<template>
  <div class="addHRadmin">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="所属单位：" prop="BUCode">
        <el-select v-model="ruleForm.BUCode" placeholder="请选择所属单位">
          <el-option
            v-for="item in regionList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户名：" prop="account">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="mobile">
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="管理员角色：" prop="lev">
        <el-select v-model="ruleForm.lev" placeholder="请选择管理员类型">
          <el-option label="hr系统管理员" value="301"></el-option>
          <el-option label="薪酬主管" value="401"></el-option>
          <el-option label="薪酬工资文员" value="411"></el-option>
          <el-option label="审批主管" value="501"></el-option>
          <el-option label="假期审批主管" value="511"></el-option>
          <el-option label="报销审批主管" value="521"></el-option>
          <el-option label="人事主管" value="601"></el-option>
          <el-option label="人事文员" value="611"></el-option>
          <el-option label="信息复核" value="701"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务归属：" prop="serveId">
        <el-radio-group v-model="ruleForm.serveId">
          <el-radio label="1">单位</el-radio>
          <el-radio label="2">区域</el-radio>
          <el-radio label="3">公司</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
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
  name: "addHRadmin",
  inject: ["reload"],
  props: ["modifyInfo"],
  data() {
    return {
      ruleForm: {
        BUCode: "",
        account: "",
        password: "",
        name: "",
        status: "",
        email: "",
        mobile: "",
        lev:'',
        serveId:''
      },
      regionList: [],
      rules: {
        account: [
          { required: true, message: "请输入账号名", trigger: "blur" },
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
        BUCode: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        lev: [
          { required: true, message: "请选择管理员等级", trigger: "change" }
        ],
        serveId: [
          { required: true, message: "请选择服务归属", trigger: "change" }
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
    this.getBUCodeFun();
  },
  methods: {
    // 获取单位列表
    getBUCodeFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUs";
      _this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.regionList = res.data.data;
        }
      });
    },
    //提交表单
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.addAmdinFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增后台管理员
    addAmdinFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/hrSys/add";
      var data = {
        BUCode:_this.ruleForm.BUCode,
        account: _this.ruleForm.account,
        email: _this.ruleForm.email,
        password: md5(_this.ruleForm.password),
        mobile: _this.ruleForm.mobile,
        status: parseInt(_this.ruleForm.status),
        lev: parseInt(_this.ruleForm.lev),
        serveId: parseInt(_this.ruleForm.serveId),
        name: _this.ruleForm.name
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.$message("新增成功");
          _this.reload();
        } else {
          _this.$message(res.data.msg);
          return false;
        }
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




