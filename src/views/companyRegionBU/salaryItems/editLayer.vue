<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="薪资应税项目名称：" prop="proName" v-if='isShow'>
        <el-input v-model="ruleForm.proName"></el-input>
      </el-form-item>
      <el-form-item label="是否应税项目：" prop="taxable">
        <el-radio-group v-model="ruleForm.taxable">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.description"></el-input>
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
        proName: "",
        taxable: "",
        description: ""
      }, //表单信息
      isShow: true, //是否显示
      rules: {
        proName: [
          { required: true, message: "请选择薪资应税项目名称", trigger: "blur" }
        ],
        taxable: [
          { required: true, message: "请选择是否应税应税项目", trigger: "blur" }
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
          this.ruleForm.proName = this.curInfo.name;
          this.ruleForm.taxable = this.curInfo.taxable.toString();
          this.ruleForm.description = this.curInfo.description;
          this.isShow = false;
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
    addFun() {
      var reqUrl = "/server/api/v1/bu/salaryItemAdd";
      var data = {
        BUCode: this.BUInfo.code,
        name: this.ruleForm.proName,
        taxable: this.ruleForm.taxable,
        description: this.ruleForm.description
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
      var reqUrl = "/server/api/v1/bu/salaryItemUpdate";
      var data = {
        code: this.curInfo.code,
        taxable: parseInt(this.ruleForm.taxable),
        description: this.ruleForm.description
      };
      console.log(data);
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
  },
  computed: {
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  }
};
</script>
<style scoped lang="scss">
.el-upload__tip {
  margin-top: 0;
}
</style>


