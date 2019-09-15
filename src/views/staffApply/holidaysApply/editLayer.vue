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
      <el-form-item label="是否带薪" prop="isWithpay">
        <el-radio-group v-model="ruleForm.isWithpay">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
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
      <fileUpload :fileUpload_props="fileUpload_props" @fileUpload_tf="fileUpload_tf"></fileUpload>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import fileUpload from "@/components/fileUpload.vue";
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
      fileUpload_props:{
        uploadUrl:'',
        uploadFolder:'',
        fileList:[]
      },
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
        ],
        isWithpay: [
          { required: true, message: "请选择假期性质", trigger: "change" }
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
      var _this = this;
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
        details: details,
        fileSrc:''
      };
      for (let index = 0; index < _this.fileUpload_props.fileList.length; index++) {
        const element = _this.fileUpload_props.fileList[index];
        data.fileSrc += data.fileSrc != ""?',' + element.url:element.url
      }
      
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
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取子组件数据
    fileUpload_tf(data){
      this.fileUpload_props.fileList = data;
    }
  },
  components: {
    fileUpload
  }
};
</script>


<style scoped lang="scss">
.inptTip{padding: 0 10px;color: #ff6600}

</style>


