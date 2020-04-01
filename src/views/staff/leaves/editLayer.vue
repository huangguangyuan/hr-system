<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" v-if="!ruleForm.showText">
      <el-form-item label="变动天数" prop="applyDay">
        <el-input-number v-model="ruleForm.applyDay" :precision="2" :step="0.5" :max="20" :min="-10"></el-input-number>
        <span class="inptTip">最少单位为0.5</span>
      </el-form-item>
      <el-form-item label="变动日期：" prop="applyDate">
        <el-date-picker
          v-model="ruleForm.applyDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="内 容" prop="remarks">
        <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="userRight" type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="160px"
      v-if="ruleForm.showText"
    >
      <p style="padding:15px;">{{ruleForm.remarks}}</p>
      <p style="text-align:right;padding:5px;">变动天数：{{ruleForm.applyDay}}</p>
      <p style="text-align:right;padding:5px;">变动日期:{{ruleForm.applyDate}}</p>
      <el-divider></el-divider>
      <el-form-item>
        <el-button @click="cancelFn" style="float:right">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo","userRight_props"],
  data() {
    return {
      userRight:false,
      ruleForm: {
        staffCode: "",
        applyDate: "",
        applyDay: "",
        remarks:"",
        showText:false
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      HRadminList:[],//HR管理员列表
      rules: {
        applyDate: [
          { required: true, message: "请选择变动天数", trigger: "blur" }
        ],
        applyDay: [
          { required: true, message: "请选择日期", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      }
    };
  },
  beforeMount(){
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
    },
    
    submitForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.curInfo.type) {
            case "add":
              this.addFun();
              break;
            case "modify":
              //this.modifyFun();
              break;
          }
        } else {
          return false;
        }
      });
    },
    // 新增
    addFun() {
      
      var reqUrl = "/server/api/v1/staff/holidaysApply/addLeavesHis";
      if (this.ruleForm.applyDay == 0){
        this.$message.error("天数不能为0");
        return;
      }
      var data = {
        typeId:2,//年假
        hisTypeId:3,//hr管理员录入
        staffCode: this.curInfo.staffCode,
        applyDate: this.ruleForm.applyDate,
        applyDay: this.ruleForm.applyDay,
        remarks: this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
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
      //this.fileUpload_props.fileList = data;
    }
  },
  components: {
    //fileUpload
  }
};
</script>
<style scoped lang="scss">
.el-upload__tip {
  margin-top: 0;
}
</style>


