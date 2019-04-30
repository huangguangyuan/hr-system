<template>
  <div class="addAccess">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="所属项目：" prop="projectCode">
        <el-select v-model="ruleForm.projectCode" placeholder="请选择所属项目">
          <el-option
            v-for="item in ruleForm.projectList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="权限代号：" prop="rightCode">
        <el-input v-model="ruleForm.rightCode"></el-input>
      </el-form-item>
      <el-form-item label="权限描述：" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="权限类型：" prop="typeId">
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">管理员角色</el-radio>
          <el-radio label="2">HR系统角色角色</el-radio>
          <el-radio label="3">员工</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "addAccess",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        name: "",
        projectCode: "",
        projectList: [],
        rightCode: "",
        description: "",
        typeId: "",
        status: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        projectCode: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ],
        rightCode: [
          { required: true, message: "请输入权限代号", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入权限描述", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "请选择权限类型", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择权限状态", trigger: "change" }
        ],
      }
    };
  },
  mounted() {
    this.getProjectData();
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
      var reqUrl = "/server/api/v1/projectAccess/add";
      var data = {
        projectCode: _this.ruleForm.projectCode,
        name: _this.ruleForm.name,
        rightCode: _this.ruleForm.rightCode,
        description: _this.ruleForm.description,
        status: parseInt(_this.ruleForm.status),
        typeId: parseInt(_this.ruleForm.typeId)
      };
      _this.$http.post(reqUrl,data).then(res => {
          console.log(res);
        if(res.data.code == 0){
          _this.reload();
        }
      })
    },
    // 获取项目数据
    getProjectData() {
      var _this = this;
      var reqUrl = "/server/api/v1/project/getAll";
      var data = { typeId: 1 };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.ruleForm.projectList = res.data.data;
        } else {
          _this.$message("res.data.code");
        }
      });
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




