<template>
  <div class="editLayer" v-if="isLoding">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="金额：" prop="totalAmount">
        <el-input v-model="ruleForm.totalAmount" oninput="value=value.replace(/[^\d.]/g,'')" style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="出粮日期：" prop="payDay">
        <el-date-picker
          v-model="ruleForm.payDay"
          type="date"
          placeholder="出粮日期"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
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
      isLoding:true,
      ruleForm: {
        id:"",
        payrollCode: "",
        totalAmount: "",
        payDay: "",
        remarks: ""
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      rules: {
        totalAmount: [
          { required: true, message: "请输入金额", trigger: "blur" }
        ],
        payDay: [
          { required: true, message: "请选择出粮日期", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      this.ruleForm.payrollCode = this.curInfo.payrollCode;
      if (this.curInfo.type == "modify") {
        this.ruleForm.id = this.curInfo.id;
        this.getItemFun();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.curInfo.type) {
            case "add":
              this.addFun();
              break;
            case "modify":
              this.modifyFun();
              break;
          }
        } else {
          return false;
        }
      });
    },
    // 新增
    getItemFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesItem";
      var data = {
        id: this.ruleForm.id
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.ruleForm.totalAmount = res.data.totalAmount;
          this.ruleForm.payDay = res.data.payDay.toString();
          this.ruleForm.remarks = res.data.remarks;
          this.isLoding = false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesAdd";
      var data = {
        payrollCode: this.ruleForm.payrollCode,
        totalAmount: this.ruleForm.totalAmount,
        payDay: this.ruleForm.payDay,
        remarks: this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/payroll/staff/payrollTimesUpdate";
      var data = {
        id:this.curInfo.id,
        totalAmount: this.ruleForm.totalAmount,
        payDay: this.ruleForm.payDay,
        remarks: this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功");
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style scoped lang="scss">
</style>


