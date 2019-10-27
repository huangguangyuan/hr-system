<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <el-form-item label="应税项目：" prop="salaryItemCode" v-if="ruleForm.taxable == 1">
        <el-select v-model="ruleForm.salaryItemCode" placeholder="请选择应税项目">
          <el-option
            v-for="item in salaryCodeList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="非应税项目：" prop="salaryItemCode"  v-if="ruleForm.taxable == 0">
        <el-select v-model="ruleForm.salaryItemCode" placeholder="请选择非应税项目">
          <el-option
            v-for="item in salaryCodeList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额：" prop="amount">
        <el-input v-model="ruleForm.amount" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="是否生效：" prop="status">
        <el-radio-group v-model="ruleForm.status">
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
        salaryItemCode: "",
        amount: "",
        status: "",
        remarks: "",
        taxable:-1
      }, //表单信息
      isShow: true, //是否显示
      salaryCodeList: [],//应税项目列表
      rules: {
        amount: [
          { required: true, message: "请输入应税金额", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择是否生效", trigger: "change" }
        ],
        salaryItemCode: [
          { required: true, message: "请选择额外应税项目", trigger: "change" }
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
      this.getSalaryItemCode();
      this.ruleForm.taxable = this.curInfo.taxable;
      if (this.curInfo.type == "modify") {
        this.ruleForm.salaryItemCode = this.curInfo.salaryItemCode;
        this.ruleForm.amount = this.curInfo.amount;
        this.ruleForm.status = this.curInfo.status.toString();
        this.ruleForm.remarks = this.curInfo.remarks;
        this.isShow = false;
      }
    },
    // 获取应税项目列表
    getSalaryItemCode(){
      var reqUrl = '/server/api/v1/bu/salaryItems';
      var data = {BUCode: this.curInfo.BUCode}
      this.$http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.salaryCodeList = res.data.data.filter(item => {
                 if (item.taxable == this.ruleForm.taxable){
                   return item;
                 }
               });
        }else{
          this.$message.error(res.data.msg);
        }
      })
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
      var reqUrl = "/server/api/v1/staff/salaryItem/add";
      var data = {
        staffCode: this.curInfo.staffCode,
        salaryItemCode:this.ruleForm.salaryItemCode,
        amount: parseFloat(this.ruleForm.amount),
        status: parseInt(this.ruleForm.status),
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
      var reqUrl = "/server/api/v1/staff/salaryItem/update";
      var data = {
        id: this.curInfo.id,
        salaryItemCode:this.ruleForm.salaryItemCode,
        amount: parseFloat(this.ruleForm.amount),
        status: parseInt(this.ruleForm.status),
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


