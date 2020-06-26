<template>
  <div class="editLayer">
    <el-form :model="ruleForm" ref="ruleForm" label-width="110px">
      <div v-for="(domain,index) in ruleForm.details" :key="domain.key" class="fromBlock">
        <div class="deleteBtn">
            <i class="el-icon-error" @click="removeDomain(domain)"></i>
        </div>
        <el-form-item label="报销类型" :prop="'details.'+index+'.typeId'" :rules="{required: true, message: '请选择报销类型', trigger: 'change'}">
          <el-select v-model="domain.typeId" placeholder="请选择报销类型">
            <el-option
              v-for="(item,_index) in claimTypeList"
              :key="_index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报销日期" :prop="'details.'+index+'.claimDate'" :rules="{required: true, message: '报销日期不能为空', trigger: 'blur'}">
         <el-date-picker v-model="domain.claimDate" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="报销内容名称" :prop="'details.'+index+'.title'" :rules="{required: true, message: '报销内容名称不能为空', trigger: 'blur'}">
          <el-input v-model="domain.title"></el-input>
        </el-form-item>
        <el-form-item label="报销金额" :prop="'details.'+index+'.amount'" :rules="{required: true, message: '报销金额不能为空', trigger: 'blur'}">
          <el-input v-model="domain.amount"></el-input>
        </el-form-item>
        <el-form-item label="备注" :prop="'details.'+index+'.remarks'">
          <el-input v-model="domain.remarks"></el-input>
        </el-form-item>
        <el-divider></el-divider>
      </div>
      <fileUpload :fileUpload_props="fileUpload_props" @fileUpload_tf="fileUpload_tf"></fileUpload>
      <el-form-item label="审批人员：" :rules="{required: true, message: '请最少选择一名审批人员', trigger: 'blur'}">
        <el-checkbox-group v-model="approveOfficer">
          <el-checkbox v-for="approve in approveOfficerList" :label="approve.code" :key="approve.code" >{{approve.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="结算人员：" v-show="false">
        <el-checkbox-group v-model="balanceOfficer">
          <el-checkbox v-for="balance in balanceOfficerList" :label="balance.code" :key="balance.code" >{{balance.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="抄送人员：">
        <el-checkbox-group v-model="noticeOfficer">
          <el-checkbox v-for="notice in noticeOfficerList" :label="notice.code" :key="notice.code">{{notice.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="抄送邮件：">
        <el-input v-model="ruleForm.sendEmail"></el-input> 抄送至其他电子邮件，多个地址请用“,”隔开，例：abc@163.com,abc@qq.com；
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="addDomain">新增报销内容</el-button>
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
      approveOfficerList:[],
      approveOfficer:[],
      balanceOfficerList:[],
      balanceOfficer:[],
      noticeOfficerList:[],
      noticeOfficer:[],
      ruleForm: {
        staffCode: "",
        totalAmount: "",
        fileSrc: "",
        sendEmail:"",
        details: [{ title: "", amount: "", typeId: "", remarks: "", claimDate: "" }]
      }, //表单信息
      fileUpload_props:{
        isUploading:false,
        uploadUrl:'',
        uploadFolder:'',
        fileList:[]
      },
      isShow: true, //是否显示
      fileList: [],
      claimTypeList: [],
      userInfo:{}
    };
  },
  mounted() {
    this.initializeFun();
    this.userInfo = this.$toolFn.curUser;
  },
  methods: {
    // 初始化
    initializeFun() {
      this.getBUClaimType(); //获取报销类型
      this.claimProcessRelate(this.curInfo.staffCode); //获取报销流程相关人员
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addFun();
        } else {
          return false;
        }
      });
    },
    // 获取报销流程相关人员
    claimProcessRelate(staffCode) {
      var reqUrl = "/server/api/v1/staff/claim/claimProcessRelate";
      this.$myApi.http.post(reqUrl, {staffCode:staffCode}).then(res => {
        if (res.data.code == 0) {
          this.approveOfficerList = res.data.data.approveOfficerList;
          for (let index = 0; index < this.approveOfficerList.length; index++) {
            const element = this.approveOfficerList[index];
            if (element.selected){
              this.approveOfficer.push(element.code);
            }
          }
          this.balanceOfficerList = res.data.data.balanceOfficerList;
          this.balanceOfficer = this.balanceOfficerList.map(m => m.code);
          this.noticeOfficerList = res.data.data.noticeOfficerList;
          this.noticeOfficer = this.noticeOfficerList.map(m => m.code);
          for (let index = 0; index < this.approveOfficerList.length; index++) {
            const element = this.approveOfficerList[index];
            if (this.noticeOfficer.indexOf(element.code) < 0){
              this.noticeOfficerList.push(element);
              this.noticeOfficer.push(element.code);
            }
          }
          for (let index = 0; index < this.balanceOfficerList.length; index++) {
            const element = this.balanceOfficerList[index];
            if (this.noticeOfficer.indexOf(element.code) < 0){
              this.noticeOfficerList.push(element);
              this.noticeOfficer.push(element.code);
            }
          }
          this.noticeOfficer = [];

        }
      });
    },
    // 获取报销类型
    async getBUClaimType() {
       this.claimTypeList = await this.$myApi.getBUClaimType();
    },
    // 添加报销内容
    addDomain() {
      this.ruleForm.details.push({
        title: "",
        amount: "",
        typeId: "",
        remarks: "",
        claimDate: "",
        key: Date.now()
      });
    },
    // 删除报销内容
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
      if (this.fileUpload_props.isUploading){
        this.$message.error("正在上传文件，请稍后");
        return;
      }
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
          fileSrc:'',
          approveOfficer:this.approveOfficer.join(','),
          balanceOfficer:this.balanceOfficer.join(','),
          noticeOfficer:this.noticeOfficer.join(','),
          sendEmail:this.ruleForm.sendEmail.replace(/，/g,","),
      };
      if(this.approveOfficer.length == 0){
        this.$message.error("请至少选中一个审批人员");
        return;
      }
      // if(this.balanceOfficer.length == 0){
      //   this.$message.error("请至少选中一个结算人员");
      //   return;
      // }
      for (let index = 0; index < this.fileUpload_props.fileList.length; index++) {
        const element = this.fileUpload_props.fileList[index];
        data.fileSrc += data.fileSrc != ""?',' + element.url:element.url
      }
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
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
      this.fileUpload_props.fileList = data.fileList;
      this.fileUpload_props.isUploading = data.isUploading;
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


