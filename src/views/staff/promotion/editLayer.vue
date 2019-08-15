<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="职 位：" prop="position">
        <el-input v-model="ruleForm.position"></el-input>
      </el-form-item>
      <el-form-item label="工 资：" prop="salary">
        <el-input v-model="ruleForm.salary"></el-input>
      </el-form-item>
      <el-form-item label="上 级：" prop="reportTo">
        <el-input v-model="ruleForm.reportTo"></el-input>
      </el-form-item>
      <el-form-item label="员工职级：">
        <el-input v-model="ruleForm.staffGrade"></el-input>
      </el-form-item>
      <el-form-item label="开始日期：" prop="startDate">
        <el-date-picker
          v-model="ruleForm.startDate"
          type="date"
          format='yyyy-MM-dd'
          placeholder="开始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期：" prop="endDate">
        <el-date-picker
          v-model="ruleForm.endDate"
          type="date"
          :format="('2100-01-01' == ruleForm.endDate?'至今':'yyyy-MM-dd')"
          :picker-options="pickerOptions"
          placeholder="结束日期"
        ></el-date-picker>
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
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.details"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="userRight" type="primary" @click="submitForm('ruleForm')">确定{{this.curInfo.type=="modify"?"修改":"增加"}}</el-button>
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
        salary: "",
        position: "",
        reportTo: "",
        staffGrade: "",
        fileSrc: "",
        details: "",
      }, //表单信息
      userRight:false,
      isShow: true, //是否显示
      fileList: [],
      rules: {
        salary: [
          { required: true, message: "请输入工资金额", trigger: "blur" }
        ],
        position: [
          { required: true, message: "请输入职位名称", trigger: "blur" }
        ]
      },
      pickerOptions: {
          shortcuts: [{
            text: '至今',
            onClick(picker) {
              const endDate = "2100-01-01";
              picker.$emit('pick', endDate);
            }
          }]
        },
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
        this.ruleForm.position = this.curInfo.position;
        this.ruleForm.reportTo = this.curInfo.reportTo;
        this.ruleForm.salary = this.curInfo.salary;
        this.ruleForm.staffGrade = this.curInfo.staffGrade;
        this.ruleForm.startDate = this.curInfo.startDate;
        this.ruleForm.endDate = this.curInfo.endDate;
        this.ruleForm.details = this.curInfo.details;
      }
      console.log(this.ruleForm);
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
      var reqUrl = "/server/api/v1/staff/promotion/add";
      var data = {
        staffCode: _this.curInfo.staffCode,
        salary: parseInt(_this.ruleForm.salary),
        position: _this.ruleForm.position,
        reportTo: _this.ruleForm.reportTo,
        staffGrade: _this.ruleForm.staffGrade,
        startDate: _this.ruleForm.startDate,
        endDate: _this.ruleForm.endDate,
        remarks: _this.ruleForm.details,
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
      var reqUrl = "/server/api/v1/staff/promotion/update";
      var data = {
        id: _this.curInfo.id,
        staffCode: _this.curInfo.staffCode,
        salary: parseInt(_this.ruleForm.salary),
        position: _this.ruleForm.position,
        reportTo: _this.ruleForm.reportTo,
        staffGrade: _this.ruleForm.staffGrade,
        startDate: _this.ruleForm.startDate,
        endDate: _this.ruleForm.endDate,
        remarks: _this.ruleForm.details,
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


