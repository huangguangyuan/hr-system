<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="发起人：" prop="issueBy">
        <el-select v-model="ruleForm.issueBy" placeholder="请选择发起人">
          <el-option v-for='item in HRadminList' :key='item.code' :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发起时间：" prop="issueTime">
        <el-date-picker
          v-model="ruleForm.issueTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="内 容" prop="contents">
        <el-input type="textarea" v-model="ruleForm.contents"></el-input>
      </el-form-item>
      <el-form-item label="文 件：">
        <el-upload
          class="upload-demo"
          action="http://134.175.150.60:9527/app/api/v1/file/fileUpload"
          :on-change="handleChange"
          :file-list="fileList"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
        >
          <el-button plain>点击上传</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >上传文件格式为：'.jpg','.png','.gif','.csv','.csv','.xlsx','.xls','.docx','.doc'</div>
        </el-upload>
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
      userRight:false,
      ruleForm: {
        staffCode: "",
        issueBy: "",
        issueTime: "",
        contents: "",
        fileSrc: ""
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      HRadminList:[],//HR管理员列表
      rules: {
        issueBy: [
          { required: true, message: "请选择发起人", trigger: "blur" }
        ],
        issueTime: [
          { required: true, message: "请选择发起时间", trigger: "blur" }
        ],
        contents: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      this.getHRadminList();
      if (this.curInfo.type == "modify") {
        this.ruleForm.issueTime = this.curInfo.issueTime;
        this.ruleForm.issueBy = this.curInfo.issueBy;
        this.ruleForm.fileSrc = this.curInfo.fileSrc;
        this.ruleForm.contents = this.curInfo.contents;
      }
    },
    // 获取HR管理员列表
    getHRadminList(){
      var reqUrl = '/server/api/v1/admin/hrSys/getAll';
      var data = {BUCode:this.curInfo.BUCode}
      this.$http.post(reqUrl,data).then(res => {
        if(res.data.data){
          this.HRadminList = res.data.data;
        }
      })
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
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/warning/add";
      var data = {
        staffCode: _this.curInfo.staffCode,
        issueBy: _this.ruleForm.issueBy,
        issueTime: _this.ruleForm.issueTime,
        contents: _this.ruleForm.contents,
        fileSrc: _this.ruleForm.fileSrc
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
      var reqUrl = "/server/api/v1/staff/education/update";
      var data = {
        id: _this.curInfo.id,
        staffCode: _this.curInfo.staffCode,
        school: _this.ruleForm.school,
        degree: _this.ruleForm.degree,
        startDate: _this.ruleForm.startDate,
        endDate: _this.ruleForm.endDate,
        details: _this.ruleForm.details,
        fileSrc: _this.ruleForm.fileSrc
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


