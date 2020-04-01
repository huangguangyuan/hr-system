<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="学校/机构：" prop="school">
        <el-input v-model="ruleForm.school"></el-input>
      </el-form-item>
      <el-form-item label="专 业：" prop="degree">
        <el-input v-model="ruleForm.degree"></el-input>
      </el-form-item>
      <el-form-item label="入学日期：" prop="startDate">
        <el-date-picker
          v-model="ruleForm.startDate"
          type="date"
          format='yyyy-MM-dd'
          value-format="yyyy-MM-dd"
          placeholder="入学日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结业日期：" prop="endDate">
        <el-date-picker
          v-model="ruleForm.endDate"
          type="date"
          :format="('2100-01-01' == ruleForm.endDate?'至今':'yyyy-MM-dd')"
          :picker-options="pickerOptions"
          placeholder="结业日期"
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
        school: "",
        degree: "",
        fileSrc: "",
        details: "",
        startDate: "",
        endDate:"",
      }, //表单信息
      fileUpload_props:{
        uploadUrl:'',
        uploadFolder:'',
        fileList:[]
      },
      userRight:false,
      isShow: true, //是否显示
      rules: {
        school: [
          { required: true, message: "请选择输入学校名称", trigger: "blur" }
        ],
        degree: [
          { required: true, message: "请选择输入专业名称", trigger: "blur" }
        ],
        startDate: [{ required: true, message: "入学日期", trigger: "change" }],
        endDate: [{ required: true, message: "结业日期", trigger: "change" }]
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
      if(this.curInfo.type=='modify'){
        this.ruleForm.staffCode = this.curInfo.staffCode;
        this.ruleForm.school = this.curInfo.school;
        this.ruleForm.degree = this.curInfo.degree;
        this.ruleForm.details = this.curInfo.details;
        this.ruleForm.startDate = this.curInfo.startDate;
        this.ruleForm.endDate = this.curInfo.endDate;
      }
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
      
      var reqUrl = "/server/api/v1/staff/education/add";
      var data = {
        staffCode:this.curInfo.staffCode,
        school: this.ruleForm.school,
        degree: this.ruleForm.degree,
        details: this.ruleForm.details,
        fileSrc: '',
        startDate: this.$toolFn.timeFormat(this.ruleForm.startDate),
        endDate: this.$toolFn.timeFormat(this.ruleForm.endDate),
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
      
      var reqUrl = "/server/api/v1/staff/education/update";
      var data = {
        id:this.curInfo.id,
        staffCode:this.curInfo.staffCode,
        school: this.ruleForm.school,
        degree: this.ruleForm.degree,
        startDate: this.$toolFn.timeFormat(this.ruleForm.startDate),
        endDate: this.$toolFn.timeFormat(this.ruleForm.endDate),
        details: this.ruleForm.details,
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
.el-upload__tip{margin-top: 0;}
</style>