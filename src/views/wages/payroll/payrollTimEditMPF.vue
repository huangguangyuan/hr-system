
<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px">
      <el-form-item label="MPF缴纳方式：" prop="MPFType">
        <el-radio v-model="ruleForm.MPFType" label="1">系统计算</el-radio>
        <el-radio v-model="ruleForm.MPFType" label="2">手动输入</el-radio>
      </el-form-item>
        <el-form-item label="明细：" v-if="ruleForm.MPFType==='1' && this.curInfo.MPFType.toString() === '1'">
          <el-table v-if="curInfo.MPFList && curInfo.MPFList.length > 0" :data="curInfo.MPFList" stripe border show-summary>
            <el-table-column prop="paymentTxt" label="类 型"></el-table-column>
            <el-table-column prop="payment" label="金额(元)"></el-table-column>
          </el-table>
        </el-form-item>

      <el-form-item label="强制部分：" prop="MPFAmountForce" v-if="ruleForm.MPFType==='2'">
        <el-input v-model="ruleForm.MPFAmountForce" type="number"></el-input>
      </el-form-item>
      <el-form-item label="个人自愿：" prop="MPFAmountFree" v-if="ruleForm.MPFType==='2'">
        <el-input v-model="ruleForm.MPFAmountFree" type="number"></el-input>
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
        MPFType:'1',
        MPFAmountForce:'0',
        MPFAmountFree:'0'
      },
      rules: {
        MPFType: [
          { required: true, message: "请选择MPF缴纳方式", trigger: "blur" }
        ]
      },
      isShow: true, //是否显示
    };
  },
  mounted() {
    this.ruleForm.code = this.curInfo.code;
    this.ruleForm.MPFType = this.curInfo.MPFType.toString();
    if (this.ruleForm.MPFType ==='2'){
      for (let index = 0; index < this.curInfo.MPFList.length; index++) {
        const element = this.curInfo.MPFList[index];
        if (element.paymentTxt === "个人"){
          this.ruleForm.MPFAmountForce = element.payment.toString()
        }else if (element.paymentTxt === "个人自愿"){
          this.ruleForm.MPFAmountFree = element.payment.toString()
        }
      }
    }

  },
  methods: {
    /**
     * @description: 获取详细信息
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.MPFType === '2'){
            if (this.ruleForm.MPFAmountForce === ''){
              this.$message.error("请输入强制缴纳费用");
              return;
            }
            if (this.ruleForm.MPFAmountFree === ''){
              this.$message.error("请输入自愿缴纳费用");
              return;
            }
          }
          this.updateMPF();
        } else {
          return false;
        }
      });
    },
    // 审批
    updateMPF() {
      var reqUrl = "/server/api/v1/payroll/staff/updateStaffPayroll";
      var data = {
        MPFCalc:true,
        hrCode:this.curInfo.hrCode,
        staffCode:this.curInfo.staffCode,
        code:this.ruleForm.code,
        MPFType:parseInt(this.ruleForm.MPFType),
        MPFAmountForce:this.ruleForm.MPFAmountForce,
        MPFAmountFree:this.ruleForm.MPFAmountFree
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


