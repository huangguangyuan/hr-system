<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="津贴名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="津贴金额：" prop="amount">
        <el-input v-model="ruleForm.amount" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="是否包含在薪酬里：" prop="includeInpayroll">
        <el-radio-group v-model="ruleForm.includeInpayroll">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
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
      ruleForm: {
        staffCode: "",
        name:"",
        amount: "",
        includeInpayroll: "",
        remarks: ""
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      rules: {
        name: [
          { required: true, message: "请输入津贴名称", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入津贴金额", trigger: "blur" }
        ],
        includeInpayroll: [
          { required: true, message: "请选择是否包含在薪酬里", trigger: "change" }
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
      if (this.curInfo.type == "modify") {
        this.ruleForm.name = this.curInfo.name;
        this.ruleForm.amount = this.curInfo.amount;
        this.ruleForm.includeInpayroll = this.curInfo.includeInPayroll.toString();
        this.ruleForm.remarks = this.curInfo.remarks;
        this.isShow = false;
      }
    },
    // 提交表单
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/staff/allowance/add";
      var data = {
        staffCode: this.curInfo.staffCode,
        name: this.ruleForm.name,
        amount: parseFloat(this.ruleForm.amount),
        includeInpayroll: parseInt(this.ruleForm.includeInpayroll),
        remarks: this.ruleForm.remarks
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/staff/allowance/update";
      var data = {
        id:this.curInfo.id,
        staffCode: this.curInfo.staffCode,
        name: this.ruleForm.name,
        amount: parseFloat(this.ruleForm.amount),
        includeInpayroll: parseInt(this.ruleForm.includeInpayroll),
        remarks: this.ruleForm.remarks
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功~");
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


