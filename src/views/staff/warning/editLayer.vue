<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" v-if="!ruleForm.showText">
      <!-- <el-form-item label="发起人：" prop="issueBy">
        <el-select v-model="ruleForm.issueBy" placeholder="请选择发起人">
          <el-option v-for='item in HRadminList' :key='item.code' :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item> -->
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
      <fileUpload :fileUpload_props="fileUpload_props" @fileUpload_tf="fileUpload_tf"></fileUpload>
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

      <p style="padding:15px;">{{ruleForm.contents}}</p>
      <p style="text-align:right;padding:5px;">发起人：{{ruleForm.hrName}}</p>
      <p style="text-align:right;padding:5px;">{{ruleForm.issueTime}}</p>
      <el-divider></el-divider>
      <el-form-item>
        <el-button @click="cancelFn" style="float:right">关闭</el-button>
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
      userRight:false,
      ruleForm: {
        staffCode: "",
        issueBy: "",
        hrName:"",
        issueTime: "",
        contents: "",
        fileSrc: "",
        showText:false
      }, //表单信息
      fileUpload_props:{
        uploadUrl:'',
        uploadFolder:'',
        fileList:[]
      },
      isShow: true, //是否显示
      fileList: [],
      HRadminList:[],//HR管理员列表
      rules: {
        // issueBy: [
        //   { required: true, message: "请选择发起人", trigger: "blur" }
        // ],
        issueTime: [
          { required: true, message: "请选择发起时间", trigger: "blur" }
        ],
        contents: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      }
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
      this.ruleForm.hrName = this.curInfo.hrName;
      this.ruleForm.issueBy = this.curInfo.issueBy;
      if (this.curInfo.type == "modify") {
        this.ruleForm.issueTime = this.curInfo.issueTime;
        this.ruleForm.fileSrc = this.curInfo.fileSrc;
        this.ruleForm.contents = this.curInfo.contents;
        this.ruleForm.showText = this.curInfo.showText;
      }
    },
    // 获取HR管理员列表
    getHRadminList(){
      var reqUrl = '/server/api/v1/admin/hrSys/getAll';
      var data = {BUCode:this.curInfo.BUCode}
      this.$myApi.http.post(reqUrl,data).then(res => {
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
        fileSrc:''
      };
      for (let index = 0; index < _this.fileUpload_props.fileList.length; index++) {
        const element = _this.fileUpload_props.fileList[index];
        data.fileSrc += data.fileSrc != ""?',' + element.url:element.url
      }
      _this.$myApi.http.post(reqUrl, data).then(res => {
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
      var reqUrl = "/server/api/v1/staff/warning/update";
      var data = {
        id: _this.curInfo.id,
        staffCode: _this.curInfo.staffCode,
        issueTime: _this.ruleForm.issueTime,
        issueBy: _this.ruleForm.issueBy,
        contents: _this.ruleForm.contents,
        fileSrc:''
      };
      for (let index = 0; index < _this.fileUpload_props.fileList.length; index++) {
        const element = _this.fileUpload_props.fileList[index];
        data.fileSrc += data.fileSrc != ""?',' + element.url:element.url
      }
      _this.$myApi.http.post(reqUrl, data).then(res => {
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
.el-upload__tip {
  margin-top: 0;
}
</style>


