
<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px">
      <el-form-item label="出粮日期：" prop="payDay">
        <el-date-picker v-model="ruleForm.payDay" type="date" placeholder="出粮日期" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="工资单状态：" prop="typeId">
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">通过</el-radio>
          <!-- <el-radio label="3">已出粮</el-radio> -->
          <el-radio label="2">退回</el-radio>
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
        id:0,
        typeId:'',
        payDay:'',
        remarks:''
      },
      rules: {
        typeId: [
          { required: true, message: "请选择工资单状态", trigger: "blur" }
        ]
      },
      isShow: true, //是否显示
    };
  },
  mounted() {
    this.ruleForm.id = this.curInfo.id;
    this.getItem();
  },
  methods: {
    /**
     * @description: 获取详细信息
     */
    getItem() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesItem";
      var data = {
        id: this.curInfo.id
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.ruleForm.id = res.data.data.id;
          this.ruleForm.typeId = res.data.data.typeId.toString();
          this.ruleForm.payDay = this.$toolFn.timeFormat(res.data.data.payDay);
          this.ruleForm.remarks = res.data.data.remarks;
        }
      });
    },
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
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesUpdate";
      var data = {
        id:this.ruleForm.id,
        typeId:parseInt(this.ruleForm.typeId),
        payDay:this.ruleForm.payDay,
        remarks:this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          if (res.data.msg != ""){
            this.$message.error(res.data.msg);
          }else{
            this.$message.success("操作成功" + res.data.msg);
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


