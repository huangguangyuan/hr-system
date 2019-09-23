<template>
  <div class="editTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="所属公司" prop="companyCode" v-if='isShow'>
        <el-select v-model="ruleForm.companyCode" placeholder="请选择所属公司">
            <el-option v-for='item in companyList' :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name" v-if='isShow'>
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号：" prop="account" v-if='isShow'>
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if='isShow'>
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="国家：" v-if='isShow'>
        <el-input v-model="ruleForm.country"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-input v-model="ruleForm.location"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="logo图片：">
        <el-upload
          class="avatar-uploader"
          action="/app/api/v1/file/imageUpload"
          :show-file-list="false"
          :on-success="uploadLogo"
        >
          <el-image v-if="ruleForm.logo" :src="logoSrc" class="avatar" fit="cover"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
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
        companyCode:"",
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
      },//表单信息
      logoSrc:'',//图片路径
      rules: {
        companyCode: [
          { required: true, message: "请选择所属公司", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      companyList:[],//公司列表
      isShow: true //是否显示
    };
  },
  mounted() {
    this.getCompanyData();
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.isShow = false;
      this.logoSrc = this.ruleForm.logo;
    }
  },
  methods: {
    // 获取上传头像
    uploadLogo(res, file) {
      this.ruleForm.logo = res.data.path;
      this.logoSrc = URL.createObjectURL(file.raw);
    },
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
    // 新增区域
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionAdd";
      var data = _this.ruleForm;
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message('添加成功~');
        }else{
          _this.$message(res.data.msg);
        }
      });
    },
    // 修改信息
    modifyFun(){
        var _this = this;
        var reqUrl = '/server/api/v1/company/regionUpdate';
        var data = {
            id:_this.ruleForm.id,
            location:_this.ruleForm.location,
            address:_this.ruleForm.address,
            logo:_this.ruleForm.logo,
            remarks:_this.ruleForm.remarks,
            contactName:_this.ruleForm.contactName,
            contactTel:_this.ruleForm.contactTel,
            contactEmail:_this.ruleForm.contactEmail,
            contactTitle:_this.ruleForm.contactTitle,
            contactLocation:_this.ruleForm.contactLocation,
            contactRemarks:_this.ruleForm.contactRemarks,
        }
        _this.$http.post(reqUrl,data).then(res => {
          if (res.data.code == 0) {
            _this.reload();
            _this.$message('修改成功~');
          }else{
            _this.$message(res.data.msg);
          }
        })
    },
    // 获取公司列表
    async getCompanyData(){
        var _this = this;
        var companys = await _this.$myApi.companys(_this,{isCache:true});
        if (companys) {
            _this.companyList = companys;
        }
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
<style lang="scss">
.editTemplate {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: 49%;
    }
    h5 {
      width: 100%;
    }
    .el-divider--horizontal {
      margin-bottom: 60px;
    }
    .btn-ground {
      width: 100%;
      margin-top: 50px;
      .el-form-item__content {
        margin-left: 0 !important;
        text-align: center;
      }
    }
    .el-divider__text {
      font-size: 16px;
      color: #f28c38;
    }
    .el-divider i {
      font-size: 16px;
    }
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #ebb563;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

