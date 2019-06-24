<template>
  <div class="editTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="所属公司" prop="companyCode" v-if="isShow">
        <el-select v-model="ruleForm.companyCode" placeholder="请选择所属公司" @change="getRegionData">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域" prop="companyRegionCode" v-if="isShow">
        <el-select v-model="ruleForm.companyRegionCode" placeholder="请选择所属区域" :loading="loading">
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name" v-if="isShow">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号：" prop="account" v-if="isShow">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="isShow">
        <el-input v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item label="国家：" v-if="isShow">
        <el-input v-model="ruleForm.country"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-input v-model="ruleForm.location"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="logo图片：">
        <el-input v-model="ruleForm.logo"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input v-model="ruleForm.contactName"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话：">
        <el-input v-model="ruleForm.contactTel"></el-input>
      </el-form-item>
      <el-form-item label="联系人邮箱：">
        <el-input v-model="ruleForm.contactEmail"></el-input>
      </el-form-item>
      <el-form-item label="联系人职位：">
        <el-input v-model="ruleForm.contactTitle"></el-input>
      </el-form-item>
      <el-form-item label="联系人位置：">
        <el-input v-model="ruleForm.contactLocation"></el-input>
      </el-form-item>
      <el-form-item label="联系人备注：">
        <el-input v-model="ruleForm.contactRemarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editTemplate",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        companyCode: "",
        companyRegionCode: "",
        name: "",
        account: "",
        password: "",
        address: "",
        country: "",
        location: "",
        logo: "",
        remarks: "",
        contactName: "",
        contactTel: "",
        contactEmail: "",
        contactTitle: "",
        contactLocation: "",
        contactRemarks: ""
      }, //表单信息
      companyList: [], //公司列表
      regionList: [], //地区列表
      loading: false, //公司ID号
      isShow: true, //是否显示
      rules: {
        companyCode: [
          { required: true, message: "请选择所属公司", trigger: "change" }
        ],
        companyRegionCode: [
          { required: true, message: "请选择所属区域", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getCompanyData();
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.isShow = false;
    }
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          switch (_this.curInfo.type) {
            case "add":
              _this.addFun();
              break;
            case "modify":
              _this.modifyFun();
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增单位
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUAdd";
      var data = _this.ruleForm;
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message.success("新增成功~");
        } else {
          _this.$message(res.data.msg);
        }
      });
    },
    // 修改信息
    modifyFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUUpdate";
      var data = {
        id: _this.ruleForm.id,
        location: _this.ruleForm.location,
        address: _this.ruleForm.address,
        logo: _this.ruleForm.logo,
        remarks: _this.ruleForm.remarks,
        contactName: _this.ruleForm.contactName,
        contactTel: _this.ruleForm.contactTel,
        contactEmail: _this.ruleForm.contactEmail,
        contactTitle: _this.ruleForm.contactTitle,
        contactLocation: _this.ruleForm.contactLocation,
        contactRemarks: _this.ruleForm.contactRemarks
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message("修改成功~");
        } else {
          _this.$message(res.data.msg);
        }
      });
    },
    // 获取公司列表
    getCompanyData() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/companys";
      _this.$http.post(reqUrl, {}).then(res => {
        _this.companyList = res.data.data;
      });
    },
    // 获取区域列表
    getRegionData(val) {
      var _this = this;
      _this.loading = true;
      var result = _this.companyList.filter(item => {
        return item.code == val;
      });
      var reqUrl = "/server/api/v1/company/company";
      var data = { id: result[0].id };
      _this.$http.post(reqUrl, data).then(res => {
        _this.loading = false;
        _this.regionList = res.data.data.companyRegionList;
      });
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
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


