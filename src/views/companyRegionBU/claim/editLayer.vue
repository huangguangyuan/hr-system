<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="报销项目名称：" prop="proName" >
        <el-input v-model="ruleForm.proName"></el-input>
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
      rules: {
        proName: [
          { required: true, message: "请选择报销项目名称", trigger: "blur" }
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
          this.ruleForm.description = this.curInfo.description;
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
      var reqUrl = "/server/api/v1/bu/claimAdd";
      var data = {
        BUCode: this.BUInfo.code,
        name: this.ruleForm.proName,
        description: this.ruleForm.description
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
      var reqUrl = "/server/api/v1/bu/claimUpdate";
      var data = {
        code: this.curInfo.code,
        name: this.ruleForm.proName,
        description: this.ruleForm.description
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


