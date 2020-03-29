<template>
  <div class="addChildAccess">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="权限名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="权限代号：" prop="rightCode">
        <el-input v-model="ruleForm.rightCode"></el-input>
      </el-form-item>
      <el-form-item label="权限描述：" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="是否菜单：" prop="isMenu">
        <el-radio-group v-model="ruleForm.isMenu">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限路径：" v-if='ruleForm.isMenu == "1"?true:false'>
        <el-input v-model="ruleForm.menuUrl"></el-input>
      </el-form-item>
      <el-form-item label="权限状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序号：">
        <el-input v-model="ruleForm.orderNo"></el-input>
      </el-form-item>
      <el-form-item label="自定义数据：" prop="addField1">
        <el-input v-model="ruleForm.addField1"></el-input>
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
  name: "addChildAccess",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        name: "",
        rightCode: "",
        description: "",
        menuUrl:"",
        status: "",
        isMenu:"",
        addField1:"",
        orderNo:0
      },
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        rightCode: [
          { required: true, message: "请输入权限代号", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: false, message: "请输入权限描述", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择权限状态", trigger: "change" }
        ],
        isMenu: [
          { required: true, message: "请选择是否菜单", trigger: "change" }
        ],
      }
    };
  },
  mounted() {

  },
  methods: {
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.addFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增权限
    addFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/projectAccess/childrenAdd";
      var data = {
        superCode:_this.curInfo.code,
        name: _this.ruleForm.name,
        description: _this.ruleForm.description,
        menuUrl:_this.ruleForm.menuUrl,
        status: parseInt(_this.ruleForm.status),
        rightCode: _this.ruleForm.rightCode,
        addField1: _this.ruleForm.addField1,
        isMenu:parseInt(_this.ruleForm.isMenu),
        orderNo:parseInt(_this.ruleForm.orderNo),
      };
      _this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          _this.reload();
        }
      })
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped lang="scss">
</style>




