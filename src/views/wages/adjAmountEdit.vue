<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px">
      <el-form-item label="调整金额：" prop="adjAmount">
        <el-input v-model="ruleForm.adjAmount"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="adjAmountRemarks">
        <el-input type="textarea" v-model="ruleForm.adjAmountRemarks"></el-input>
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
        hrCode:'',
        adjAmount:'',
        adjAmountRemarks:'',
      }, //表单信息
      isShow: true, //是否显示
      rules: {
        adjAmount: [
          { required: true, message: "请输入调整金额", trigger: "blur" }
        ],
        adjAmountRemarks: [
          { required: true, message: "请输入调整备注", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.ruleForm.adjAmount = this.curInfo.adjAmount;
    this.ruleForm.adjAmountRemarks = this.curInfo.adjAmountRemarks;
  },
  methods: {
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editFun();
        } else {
          
          return false;
        }
      });
    },
    // 新增
    editFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollAdjAmountEdit";
      var data = {
        hrCode:this.curInfo.hrCode,
        code:this.curInfo.code,
        adjAmount:parseFloat(this.ruleForm.adjAmount),
        adjAmountRemarks:this.ruleForm.adjAmountRemarks
      };

      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("操作成功~");
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


