<template>
  <div class="editTemplate" v-if="isShow" >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
      <el-divider>
        <i class="hr-icon-jichuxinxi"></i> 基础信息
      </el-divider>
      <el-form-item label="所属公司/地区" prop="selectedOptions" v-if="isShowItem">
        <el-cascader v-model="ruleForm.selectedOptions" :props="props"></el-cascader>
      </el-form-item>
      <el-form-item label="名称：" prop="name" v-if="isShowItem">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号：" prop="account" v-if="isShowItem">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="isShowItem">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="国家：" v-if="isShowItem">
        <el-input v-model="ruleForm.country"></el-input>
      </el-form-item>
      <el-form-item label="所属行政区：">
          <el-select v-model="ruleForm.locationType" placeholder="请选择单位所属">
          <el-option key="1" label="中国大陆" value="1"></el-option>
          <el-option key="2" label="中国香港" value="2"></el-option>
          <el-option key="3" label="中国台湾" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="位置：">
        <el-input v-model="ruleForm.location"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item label="logo图片：">
        <image-upload :imageUpload_props="imageUpload_props" :imageSrc.sync="ruleForm.logo"></image-upload>
      </el-form-item>
      <el-divider>
        <i class="el-icon-user"></i> 联系人信息
      </el-divider>
      <el-form-item label="联系人：" >
        <el-input v-model="ruleForm.contactName"></el-input>
      </el-form-item>
      <el-form-item label="联系人手机："  prop="contactTel">
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
      <el-form-item class="btn-ground">
        <el-button type="primary" @click="submitForm('ruleForm')" size="medium">确 定</el-button>
        <el-button @click="cancelFn" size="medium">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
import md5 from "js-md5";
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
        selectedOptions:[],
        name: "",
        account: "",
        password: "",
        address: "",
        country: "",
        location: "",
        locationType: "",
        logo: "",
        remarks: "",
        contactName: "",
        contactTel: "",
        contactEmail: "",
        contactTitle: "",
        contactLocation: "",
        contactRemarks: ""
      }, //表单信息
      props: {
        lazy: true,
        value: "code",
        label: "name",
        children: "children",
        lazyLoad(node, resolve) {
          var nodes;
          if (node.level == 0) {
            var reqUrl = "/server/api/v1/company/companys";
            axios.post(reqUrl, {}).then(res => {
              nodes = res.data.data.map(item => {
                return {
                  id: item.id,
                  code: item.code,
                  name: item.name
                };
              });
              resolve(nodes);
            });
          } else if (node.level == 1) {
            axios.post("/server/api/v1/company/company", { id: node.data.id }).then(res => {
                nodes = res.data.data.companyRegionList.map(item => {
                  return {
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    leaf: item.code
                  };
                });
                resolve(nodes);
              });
          }
        },
      },
      logoSrc:'',//图片路径
      loading: false, //公司ID号
      imageUpload_props:{
        imageSrc:'',
        uploadFolder:''
      },
      rules: {
        selectedOptions: [
          {
            required: true,
            message: "请选择所属公司/区域",
            trigger: "change"
          }
        ],
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
        ],
        locationType: [
          { required: true, message: "请选择行政区", trigger: "blur" }
        ]

      }
    };
  },
  mounted() {
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.imageUpload_props.imageSrc = this.ruleForm.logo;
      this.isShowItem = false;
      this.logoSrc = this.ruleForm.logo;
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
    // 新增单位
    addFun() {
      var reqUrl = "/server/api/v1/company/regionBUAdd";
      var data = {
        companyCode:this.ruleForm.selectedOptions[0],
        companyRegionCode:this.ruleForm.selectedOptions[1],
        name:this.ruleForm.name,
        account:this.ruleForm.account,
        password:md5(this.ruleForm.password),
        address:this.ruleForm.address,
        country:this.ruleForm.country,
        location:this.ruleForm.location,
        locationType:this.ruleForm.locationType.toString(),
        logo:this.ruleForm.logo,
        remarks:this.ruleForm.remarks,
        contactName:this.ruleForm.contactName,
        contactTel:this.ruleForm.contactTel,
        contactEmail:this.ruleForm.contactEmail,
        contactTitle:this.ruleForm.contactTitle,
        contactLocation:this.ruleForm.contactLocation,
        contactRemarks:this.ruleForm.contactRemarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    // 修改信息
    modifyFun() {
      var reqUrl = "/server/api/v1/company/regionBUUpdate";
      var data = {
        id: this.ruleForm.id,
        location: this.ruleForm.location,
        locationType: this.ruleForm.locationType,
        address: this.ruleForm.address,
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
          this.$message(res.data.msg);
        }
      });
    },
    // 获取上传头像
    uploadLogo(res, file) {
      this.ruleForm.logo = res.data.path;
      this.logoSrc = URL.createObjectURL(file.raw);
    },
    // 取消
    cancelFn() {
      
      this.$emit("listenisShowItemMask", false);
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


