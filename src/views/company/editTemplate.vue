<template>
  <div class="editTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="名称：" prop="name" v-if="isShow">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号：" prop="account" v-if="isShow">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="isShow">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="国家：">
        <el-input v-model="ruleForm.country"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-input v-model="ruleForm.location"></el-input>
      </el-form-item>
      <el-form-item label="地址：" v-if="isShow">
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
      <el-form-item label="联系人：" >
        <el-input v-model="ruleForm.contactName"></el-input>
      </el-form-item>
      <el-form-item label="联系人手机：" prop="contactTel">
        <el-input v-model="ruleForm.contactTel"></el-input>
      </el-form-item>
      <el-form-item label="联系人邮箱：" prop="contactEmail">
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
        <el-button type="primary" @click="submitForm('ruleForm')">确定提交</el-button>
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
      },
      logoSrc:'',//图片路径
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        contactTel: [
          { required: false, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "请输入正确的手机号码",
            trigger: ["blur"]
          }
        ],
        contactEmail: [
          { required: false, message: "请输入电子邮箱", trigger: "blur" },
          {
            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            message: "请输入正确的邮箱",
            trigger: ["blur"]
          }
        ]
      },
      isShow: true //是否显示
    };
  },
  mounted() {
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
    // 新增公司
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/companyAdd";
      var data = _this.ruleForm;
      console.log(data);
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message("添加成功~");
        }
      });
    },
    // 修改信息
    modifyFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/companyUpdate";
      var data = {
        id: _this.ruleForm.id,
        country: _this.ruleForm.country,
        location: _this.ruleForm.location,
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
          _this.$alert(res.data.msg, "提 示");
        }
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



