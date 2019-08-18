<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="请假时间" prop="applyTime">
        <el-date-picker
          v-model="ruleForm.applyTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="请假天数" prop="days">
        <el-input-number v-model="ruleForm.days" :precision="2" :step="0.5" :max="30" :min="0.5"></el-input-number>
        <span class="inptTip">最少单位为0.5</span>
      </el-form-item>

      <el-form-item label="请假类型" prop="typeId">
        <el-select v-model="ruleForm.typeId" placeholder="请选择请假类型">
          <el-option
            v-for="item in holidaysApplyTypeList"
            :key="item.typeId"
            :label="item.val"
            :value="item.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否带薪" prop="isWithpay">
        <el-radio-group v-model="ruleForm.isWithpay">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
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
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
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
        applyTime: [],
        days: 1,
        typeId: "",
        remarks: "",
        isWithpay:0,
        fileSrc: ""
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      holidaysApplyTypeList: [], //请假类型
      rules: {
        applyTime: [
          { required: true, message: "请选择请假时间", trigger: "blur" }
        ],
        days: [{ required: true, message: "请填写请假天数", trigger: "blur" }],
        typeId: [
          { required: true, message: "请选择请假类型", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.initializeFun();
    let s = this.$toolFn.timeFormat(this.$toolFn.formatTime(new Date(),"yyyy-MM-dd") + " 09:00:00");
    let e = this.$toolFn.timeFormat(this.$toolFn.formatTime(new Date(),"yyyy-MM-dd") + " 18:00:00");
    this.ruleForm.applyTime.push(s,e);
  },
  methods: {
    // 初始化
    initializeFun() {
      this.getHolidaysApplyTypeFun();
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
    // 获取请假类型
    getHolidaysApplyTypeFun() {
      var reqUrl = "/server/api/v1/staff/holidaysApply/getHolidaysApplyTypeId";
      this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.holidaysApplyTypeList = res.data.data;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/staff/holidaysApply/approveApply";
      var details = [
        {
          startDate: this.ruleForm.applyTime[0],
          endDate: this.ruleForm.applyTime[1],
          days: parseFloat(this.ruleForm.days),
          isWithpay: parseInt(this.ruleForm.isWithpay),
          typeId: parseInt(this.ruleForm.typeId),
          remarks: this.ruleForm.remarks
        }
      ];
      var data = {
        staffCode: this.curInfo.staffCode,
        totalDay: parseFloat(this.ruleForm.days),
        isWithpay: parseInt(this.ruleForm.isWithpay),
        fileSrc: this.ruleForm.fileSrc,
        details: details
      };
      
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
.inptTip{padding: 0 10px;color: #ff6600}

</style>


