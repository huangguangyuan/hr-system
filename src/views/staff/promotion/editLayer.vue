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
      <fileUpload :fileUpload_props="fileUpload_props" @fileUpload_tf="fileUpload_tf"></fileUpload>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.details"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="userRight" type="primary" @click="submitForm('ruleForm')">确定</el-button>
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
  props: ["curInfo","userRight_props"],
  data() {
    return {
      ruleForm: {
        staffCode: "",
        salary: "",
        position: "",
        reportTo: "",
        startDate:"",
        endDate:"",
        staffGrade: "",
        fileSrc: "",
        details: "",
      }, //表单信息
      fileUpload_props:{
        uploadUrl:'',
        uploadFolder:'',
        fileList:[]
      },
      userRight:false,
      isShow: true, //是否显示
      fileList: [],
      rules: {
        // salary: [
        //   { required: true, message: "请输入工资金额", trigger: "blur" }
        // ],
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
  beforeMount(){
    this.fileUpload_props.fileList = [];
    if (this.curInfo.fileSrc && this.curInfo.fileSrc != ""){
      var fileSrcArr = this.curInfo.fileSrc.split(',');
      for (let index = 0; index < fileSrcArr.length; index++) {
          this.fileUpload_props.fileList.push({
          name: '文件' + (index + 1),
          url: fileSrcArr[index]
        });
      }
    }
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
        this.ruleForm.details = this.curInfo.remarks;
      }
      //console.log(this.ruleForm);
    },
    
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
    // 新增
    addFun() {
      
      var reqUrl = "/server/api/v1/staff/promotion/add";
      var data = {
        staffCode: this.curInfo.staffCode,
        salary: parseInt(this.ruleForm.salary),
        position: this.ruleForm.position,
        reportTo: this.ruleForm.reportTo,
        staffGrade: this.ruleForm.staffGrade,
        startDate: this.$toolFn.timeFormat(this.ruleForm.startDate).slice(0, 10),
        endDate: this.$toolFn.timeFormat(this.ruleForm.endDate).slice(0, 10),
        remarks: this.ruleForm.details,
        fileSrc:''
      };
      for (let index = 0; index < this.fileUpload_props.fileList.length; index++) {
        const element = this.fileUpload_props.fileList[index];
        data.fileSrc += data.fileSrc != ""?',' + element.url:element.url
      }
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      
      var reqUrl = "/server/api/v1/staff/promotion/update";
      var data = {
        id: this.curInfo.id,
        staffCode: this.curInfo.staffCode,
        salary: parseInt(this.ruleForm.salary),
        position: this.ruleForm.position,
        reportTo: this.ruleForm.reportTo,
        staffGrade: this.ruleForm.staffGrade,
        startDate: this.$toolFn.timeFormat(this.ruleForm.startDate).slice(0, 10),
        endDate: this.$toolFn.timeFormat(this.ruleForm.endDate).slice(0, 10),
        remarks: this.ruleForm.details,
        fileSrc:''
      };
      for (let index = 0; index < this.fileUpload_props.fileList.length; index++) {
        const element = this.fileUpload_props.fileList[index];
        data.fileSrc += data.fileSrc != ""?',' + element.url:element.url
      }
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功~");
        } else {
          this.$message(res.data.msg);
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
  }
  ,
  components: {
    fileUpload
  }
};
</script>
<style scoped lang="scss">
.el-upload__tip {
  margin-top: 0;
}
</style>


