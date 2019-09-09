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
      <fileUpload :fileUpload_props="fileUpload_props" @fileUpload_tf="fileUpload_tf"></fileUpload>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="addDomain">新增报销项目</el-button>
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
        totalAmount: "",
        fileSrc: "",
        details: [{ title: "", amount: "", typeId: "", remarks: "" }]
      }, //表单信息
      fileUpload_props:{
        uploadUrl:'',
        uploadFolder:'',
        fileList:[]
      },
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
      var _this = this;
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
          totalAmount:totalAmount,
          details:this.ruleForm.details,
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
.fromBlock{position: relative;}
.deleteBtn{margin-bottom: 20px;display: flex;justify-content: flex-end;}
.deleteBtn i{font-size: 25px;cursor: pointer;}
.el-upload__tip {
  margin-top: 0;
}
</style>


