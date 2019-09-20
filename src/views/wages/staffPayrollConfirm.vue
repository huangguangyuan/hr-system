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
import { setTimeout } from "timers";
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        typeId:'',
        remarks:'',
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      holidaysApplyTypeList: [], //请假类型
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
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.typeId == 2 && this.ruleForm.remarks == ''){
             this.$message.error("请填写退回备注");
             return false;
          }
          this.addFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollConfirm";
      var data = {
        hrCode:this.curInfo.hrCode,
        code:this.curInfo.code,
        typeId:parseInt(this.ruleForm.typeId),
        remarks:this.ruleForm.remarks
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("确认成功~");
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


