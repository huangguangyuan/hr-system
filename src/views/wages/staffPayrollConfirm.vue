<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px">
      <el-form-item label="工资单状态：" prop="typeId">
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">通过</el-radio>
          <el-radio label="2">退回（有疑问，需重新计算）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        typeId:'',
        remarks:'',
        codeArr:[]
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      rules: {
        typeId: [
          { required: true, message: "请选择是否通过", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.ruleForm.typeId = this.curInfo.typeId.toString();
    this.ruleForm.remarks = this.curInfo.remarks;
    this.ruleForm.codeArr = this.curInfo.codeArr || [];
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.typeId == 2 && (!this.ruleForm.remarks || this.ruleForm.remarks == '')){
             this.$message.error("请填写退回备注");
             return;
          }
          this.approveFun();
        } else {
          return false;
        }
      });
    },
    // 审批
    approveFun() {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollConfirm";
      var data = {
        hrCode:this.curInfo.hrCode,
        code:this.curInfo.code,
        typeId:parseInt(this.ruleForm.typeId),
        remarks:this.ruleForm.remarks
      };
      if (this.ruleForm.codeArr.length > 0){
        reqUrl = "/server/api/v1/payroll/staff/staffPayrollConfirmMult";
        data.codeArr = this.ruleForm.codeArr;
      }
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          if (res.data.msg != ""){
            this.$message.error(res.data.msg);
          }else{
            this.$message.success("操作成功~" + res.data.msg);
          }
          
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
    }
  }
};
</script>


