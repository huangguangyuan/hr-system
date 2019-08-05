<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="媒体名称：" prop="media">
        <el-input v-model="ruleForm.media"></el-input>
      </el-form-item>
      <el-form-item label="媒体账号：" prop="account">
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="userRight" type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo","userRight_props"],
  data() {
    return {
      ruleForm: {
        staffCode: "",
        media: "",
        account: "",
        remarks: ""
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      rules: {
        media: [
          { required: true, message: "请输入媒体名称：", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入媒体账号：", trigger: "blur" }
        ]
      },
      userRight:false,
    };
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      if (this.curInfo.type == "modify") {
        this.ruleForm.media = this.curInfo.media;
        this.ruleForm.account = this.curInfo.account;
        this.ruleForm.remarks = this.curInfo.remarks;
      }
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
    // 新增
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/socialMedia/add";
      var data = {
        staffCode: this.curInfo.staffCode,
        media:this.ruleForm.media,
        account:this.ruleForm.account,
        remarks:this.ruleForm.remarks
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message.success("新增成功~");
        } else {
          _this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/socialMedia/update";
      var data = {
        id: _this.curInfo.id,
        staffCode: this.curInfo.staffCode,
        media:this.ruleForm.media,
        account:this.ruleForm.account,
        remarks:this.ruleForm.remarks
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message.success("修改成功~");
        } else {
          _this.$message(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
    },
    // 限制当前文件个数
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    // 限制上传文件格式
    beforeAvatarUpload(file) {
      var isOk;
      var fileType = [
        ".jpg",
        ".png",
        ".gif",
        ".csv",
        ".csv",
        ".xlsx",
        ".xls",
        ".docx",
        ".doc"
      ];
      for (var i = 0; i < fileType.length; i++) {
        if (file.name.indexOf(fileType[i]) != -1) {
          isOk = true;
        }
      }
      if (!isOk) {
        this.$message.error("文件格式错误~");
      }
      return isOk;
    },
    // 获取上传文件路径
    handleChange(file, fileList) {
      setTimeout(() => {
        this.ruleForm.fileSrc = file.response.data.path;
      }, 500);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped lang="scss">
.el-upload__tip {
  margin-top: 0;
}
</style>


