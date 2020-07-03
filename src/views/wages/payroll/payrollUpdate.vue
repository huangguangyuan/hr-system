<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px">
      <el-form-item label="更新项目：" prop="updateItems">
          <el-checkbox-group v-model="ruleForm.updateItems">
            <el-checkbox label="salaryCalc" value ="salaryCalc">重算基本工资</el-checkbox>
          <el-checkbox label="taxableItemsCalc" value ="taxableItemsCalc">重算应税项目</el-checkbox>
          <el-checkbox label="notTaxableItemsCalc" value ="notTaxableItemsCalc">重算非应税项目</el-checkbox>
          <el-checkbox label="specialDeductionCalc" value ="specialDeductionCalc">重算专项附加扣除</el-checkbox>
          <el-checkbox label="SICalc" value ="SICalc">重算社保</el-checkbox>
          <el-checkbox label="HCCalc" value ="HCCalc">重算公积金</el-checkbox>
          <el-checkbox label="processCalc" value ="processCalc">只重算计薪流程</el-checkbox>
        </el-checkbox-group>
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
        code:'',
        updateItems:[],
      },
      rules: {
        updateItems: [
          { required: true, message: "请选择更新项目", trigger: "blur" }
        ]
      },
      isShow: true, //是否显示
    };
  },
  mounted() {
    this.ruleForm.code = this.curInfo.code;

  },
  methods: {
    /**
     * @description: 获取详细信息
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = {};
          for (let index = 0; index < this.ruleForm.updateItems.length; index++) {
            const element = this.ruleForm.updateItems[index];
            postData[element] = true;
          }
          console.log(postData);
          this.updateMPF(postData);
        } else {
          return false;
        }
      });
    },
    // 审批
    updateMPF(postData) {
      var reqUrl = "/server/api/v1/payroll/staff/updateStaffPayroll";
      var data = postData;
      data.hrCode = this.curInfo.hrCode;
      data.code = this.ruleForm.code;
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.code === 0) {
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


