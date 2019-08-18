<template>
  <div class="editLayer">
    <el-form :model="ruleForm" ref="ruleForm" label-width="110px">
      <div v-for="(domain,index) in ruleForm.details" :key="domain.key" class="fromBlock">
        <div class="deleteBtn">
            <i class="el-icon-error" @click="removeDomain(domain)"></i>
        </div>
        <el-form-item label="报销项目名称" :prop="'details.'+index+'.title'" :rules="{required: true, message: '报销项目名称不能为空', trigger: 'blur'}">
          <el-input v-model="domain.title"></el-input>
        </el-form-item>
        <el-form-item label="报销金额" :prop="'details.'+index+'.amount'" :rules="{required: true, message: '报销金额不能为空', trigger: 'blur'}">
          <el-input v-model="domain.amount"></el-input>
        </el-form-item>
        <el-form-item label="报销类型" :prop="'details.'+index+'.typeId'" :rules="{required: true, message: '请选择报销类型', trigger: 'change'}">
          <el-select v-model="domain.typeId" placeholder="请选择报销类型">
            <el-option
              v-for="(item,_index) in claimTypeList"
              :key="_index"
              :label="item.val"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :prop="'details.'+index+'.remarks'">
          <el-input v-model="domain.remarks"></el-input>
        </el-form-item>
        <el-divider></el-divider>
      </div>
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
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="addDomain">新增报销项目</el-button>
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
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        staffCode: "",
        totalAmount: "",
        fileSrc: "",
        details: [{ title: "", amount: "", typeId: "", remarks: "" }]
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      claimTypeList: []
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      this.getClaimTypeId(); //获取报销类型
      if (this.curInfo.type == "modify") {
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取报销类型
    getClaimTypeId() {
      var reqUrl = "/server/api/v1/staff/claim/getClaimTypeId";
      this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.claimTypeList = res.data.data;
        }
      });
    },
    // 添加报销项目
    addDomain() {
      this.ruleForm.details.push({
        title: "",
        amount: "",
        typeId: "",
        remarks: "",
        key: Date.now()
      });
    },
    // 删除报销项目
    removeDomain(item){
        if (this.ruleForm.details.length == 1){
          return;
        }
        var index = this.ruleForm.details.indexOf(item)
        if (index !== -1) {
          this.ruleForm.details.splice(index, 1)
        }
    },
    // 新增
    addFun() {
      var totalAmount = 0;
      for(var i = 0;i<this.ruleForm.details.length;i++){
          totalAmount += parseFloat(this.ruleForm.details[i].amount);
      }
      this.ruleForm.details = this.ruleForm.details.map(item => {
          item.amount = parseFloat(item.amount);
          item.typeId = parseInt(item.typeId);
          return item;
      })
      var reqUrl = "/server/api/v1/staff/claim/approveApply";
      var data = {
          staffCode:this.curInfo.staffCode,
          fileSrc:this.ruleForm.fileSrc,
          totalAmount:totalAmount,
          details:this.ruleForm.details
      };
      console.log(data);
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
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
.fromBlock{position: relative;}
.deleteBtn{margin-bottom: 20px;display: flex;justify-content: flex-end;}
.deleteBtn i{font-size: 25px;cursor: pointer;}
.el-upload__tip {
  margin-top: 0;
}
</style>


