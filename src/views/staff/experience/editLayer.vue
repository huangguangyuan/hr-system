<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="公司名称：" prop="companyName">
        <el-input v-model="ruleForm.companyName"></el-input>
      </el-form-item>
      <el-form-item label="职 位：" prop="position">
        <el-input v-model="ruleForm.position"></el-input>
      </el-form-item>
      <el-form-item label="工作性质：">
        <el-input v-model="ruleForm.jobNature" maxlength="200"></el-input>
      </el-form-item>
      
      <el-form-item label="入职日期：" prop="startDate">
        <el-date-picker
          v-model="ruleForm.startDate"
          type="date"
          format='yyyy-MM-dd'
          placeholder="入职日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="离职日期：" prop="endDate">
        <el-date-picker
          v-model="ruleForm.endDate"
          type="date"
          :format="('2100-01-01' == ruleForm.endDate?'至今':'yyyy-MM-dd')"
          :picker-options="pickerOptions"
          placeholder="离职日期"
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
        companyName: "",
        position: "",
        jobNature:"",
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
      userRight:true,
      isShow: true, //是否显示
      rules: {
        companyName: [
          { required: true, message: "请选择输入公司名称", trigger: "blur" }
        ],
        position: [
          { required: true, message: "请选择输入职位名称", trigger: "blur" }
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
        this.ruleForm.companyName = this.curInfo.companyName;
        this.ruleForm.position = this.curInfo.position;
        this.ruleForm.jobNature = this.curInfo.jobNature;
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
      
      var reqUrl = "/server/api/v1/staff/working/add";
      var data = {
        staffCode:this.curInfo.staffCode,
        companyName: this.ruleForm.companyName,
        position: this.ruleForm.position,
        jobNature: this.ruleForm.jobNature,
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
          this.$message.success("新增成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      
      var reqUrl = "/server/api/v1/staff/working/update";
      var data = {
        id:this.curInfo.id,
        staffCode:this.curInfo.staffCode,
        companyName: this.ruleForm.companyName,
        position: this.ruleForm.position,
        jobNature: this.ruleForm.jobNature,
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
  }
  ,
  components: {
    fileUpload
  }
};
</script>
<style scoped lang="scss">
.el-upload__tip{margin-top: 0;}
</style>


