<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="扣除金额：" prop="amount">
        <el-input v-model="ruleForm.amount" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="是否生效：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型：" prop="typeId" v-if='isShow'>
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">赡养老人</el-radio>
          <el-radio label="2">子女教育</el-radio>
          <el-radio label="3">房贷利息</el-radio>
          <el-radio label="4">住房租金</el-radio>
          <el-radio label="5">继续教育</el-radio>
          <el-radio label="6">大病医疗</el-radio>
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
        amount: "",
        status: "",
        typeId: "",
        remarks: ""
      }, //表单信息
      isShow: true, //是否显示
      fileList: [],
      rules: {
        amount: [
          { required: true, message: "请输入津贴金额", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择是否生效", trigger: "change" }
        ],
        typeId: [
          { required: true, message: "请选择津贴类型", trigger: "change" }
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
        this.ruleForm.amount = this.curInfo.amount;
        this.ruleForm.status = this.curInfo.status.toString();
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
      var reqUrl = "/server/api/v1/staff/deduction/add";
      var data = {
        staffCode: this.curInfo.staffCode,
        amount: parseFloat(this.ruleForm.amount),
        status: parseInt(this.ruleForm.status),
        typeId: parseInt(this.ruleForm.typeId),
        remarks: this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
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
      var reqUrl = "/server/api/v1/staff/deduction/update";
      var data = {
        id:this.curInfo.id,
        staffCode: this.curInfo.staffCode,
        amount: parseFloat(this.ruleForm.amount),
        status: parseInt(this.ruleForm.status),
        remarks: this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
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


