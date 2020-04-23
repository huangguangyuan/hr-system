<template>
  <div class="buPayrollConfirm">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="320px">
      <el-form-item label="请选择年份：" prop="year">
        <el-date-picker
          v-model="ruleForm.year"
          type="year"
          placeholder="选择年"
          value-format="yyyy"
          format="yyyy"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="请选择月：" prop="month">
        <el-select
          style="width:220px;"
          v-model="ruleForm.month"
          placeholder="请选择月份"
        >
        <el-option v-for="(item,key) in monthList" :key="key" :label="item.txt" :value="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择出粮日期：" prop="payDay">
        <el-date-picker
          v-model="ruleForm.payDay"
          type="date"
          placeholder="选择年"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {monthList} from "@/lib/staticData.js";
export default {
  name: "buPayrollConfirm",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isShow: true, //是否显示
      ruleForm: {
        year: this.curInfo.year,
        month: this.curInfo.month,
        payDay: ""
      }, //表单信息
      monthList:[],
      rules: {
        year: [{ required: true, message: "请选择年份", trigger: "change" }],
        month: [{ required: true, message: "请选择月份", trigger: "change" }],
        payDay: [
          { required: true, message: "请选择出粮日期", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.monthList = monthList();
    this.payrollPeriod(this.curInfo.BUCode);
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addFun();
        } else {
          return false;
        }
      });
    },
    // 获取单位出粮期
    payrollPeriod(BUCode) {
      var reqUrl = "/server/api/v1/payroll/payrollPeriodByBUCode";
      this.$myApi.http.post(reqUrl, {BUCode: BUCode}).then(res => {
        if (res.data.code == 0) {
          this.ruleForm.payDay = new Date( this.ruleForm.year.toString() + "-" + this.ruleForm.month.toString() + "-" + res.data.data.payDay.toString());
        }
      });
    },
    // 生成工资单
    addFun() {
      var reqUrl = "/server/api/v1/payroll/staff/buPayrollConfirm";
      var data = {
        hrCode: this.curInfo.hrCode,
        BUCode: this.curInfo.BUCode,
        year: parseInt(this.ruleForm.year),
        month: parseInt(this.ruleForm.month),
        payDay:this.$toolFn.timeFormat(this.ruleForm.payDay,"yyyy-MM-dd")
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("更新成功");
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


