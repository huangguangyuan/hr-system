<template>
  <div class="genStaffPayroll">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px">
      <el-form-item label="请选择年份：" prop="year">
        <el-date-picker v-model="ruleForm.year" type="year" placeholder="选择年" value-format="yyyy" format="yyyy"></el-date-picker>
      </el-form-item>
      <el-form-item label="请选择月份：" prop="month">
        <el-date-picker v-model="ruleForm.month" type="month" placeholder="选择月" value-format="MM" format="M"></el-date-picker>
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
  name: "genStaffPayroll",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        year: "",
        month: ""
      }, //表单信息
      isShow: true, //是否显示
      rules: {
        year: [{ required: true, message: "请选择年份", trigger: "change" }],
        month: [{ required: true, message: "请选择月份", trigger: "change" }]
      }
    };
  },
  mounted() {
    var date = new Date();
    this.ruleForm = {
              year: date.getFullYear().toString(),
              month: (date.getMonth()+1).toString()
            };
  },
  methods: {
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
    // 生成工资单
    addFun() {
      var reqUrl = "/server/api/v1/payroll/staff/genStaffPayroll";
      var data = {
          hrCode:this.curInfo.hrCode,
          staffCode:this.curInfo.code,
          year:parseInt(this.ruleForm.year),
          month:parseInt(this.ruleForm.month)
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("生成成功~");
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


