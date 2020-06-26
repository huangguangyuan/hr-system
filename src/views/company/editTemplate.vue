<template>
  <div class="editTemplate" v-if="isShow">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="名称：" prop="name" v-if='isShowItem'>
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="帐号：" prop="account" v-if='isShowItem'>
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if='isShowItem'>
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="国家：" v-if='isShowItem'>
        <el-input v-model="ruleForm.country"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-input v-model="ruleForm.location"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="logo图片：">
        <image-upload :imageUpload_props="imageUpload_props" :imageSrc.sync="ruleForm.logo"></image-upload>
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
import imageUpload from "@/components/imageUpload.vue";
export default {
  components: {
    imageUpload
  },
  name: "editTemplate",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isShow:false,
      isShowItem:true,
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
      imageUpload_props:{
        imageSrc:'',
        uploadFolder:''
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入帐号", trigger: "blur" },
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
      }
    };
  },
  mounted() {
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.imageUpload_props.imageSrc = this.ruleForm.logo;
      this.isShowItem = false;
    }
    this.isShow = true;
  },
  methods: {
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.curInfo.type) {
            case "add":
              this.addFun();
              break;
            case "modify":
              this.modifyFun();
              break;
          }
        } else {
          return false;
        }
      });
    },
    // 新增公司
    addFun() {
      var reqUrl = "/server/api/v1/company/companyAdd";
      var data = this.ruleForm;
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message("添加成功");
        }
      });
    },
    // 修改信息
    modifyFun() {
      var reqUrl = "/server/api/v1/company/companyUpdate";
      var data = {
        id: this.ruleForm.id,
        country: this.ruleForm.country,
        location: this.ruleForm.location,
        logo: this.ruleForm.logo,
        remarks: this.ruleForm.remarks,
        contactName: this.ruleForm.contactName,
        contactTel: this.ruleForm.contactTel,
        contactEmail: this.ruleForm.contactEmail,
        contactTitle: this.ruleForm.contactTitle,
        contactLocation: this.ruleForm.contactLocation,
        contactRemarks: this.ruleForm.contactRemarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message("修改成功");
        } else {
          this.$alert(res.data.msg, "提 示");
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
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
</style>



