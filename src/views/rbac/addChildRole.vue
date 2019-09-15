<template>
  <div class="addChildRole">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="角色名：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="角色代号：" prop="roleCode">
        <el-input v-model="ruleForm.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="分组：" prop="lev">
        <el-input v-model="ruleForm.lev" placeholder="分组900以上默认角色"></el-input>
      </el-form-item>
      <!-- <el-form-item label="角色类型：" prop="typeId">
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">管理员角色</el-radio>
          <el-radio label="2">HR系统角色角色</el-radio>
          <el-radio label="3">员工</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="角色状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
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
  name: "addChildRole",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        name: "",
        projectCode: "",
        projectList: [],
        roleCode: "",
        description: "",
        lev:"",
        typeId: "",
        status: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        projectCode: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ],
        roleCode: [
          { required: true, message: "请输入角色代号", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "请选择角色类型", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择角色状态", trigger: "change" }
        ],
        lev: [
          { required: false, message: "请输入角色描述", trigger: "blur" }
        ],
      }
    };
  },
  mounted() {
    console.log(this.curInfo);
    this.getProjectData();
    this.initializationFun();
  },
  methods: {
    // 初始化
    initializationFun(){
        var _this = this;
        _this.ruleForm.projectCode = this.curInfo.projectCode
    },
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.addRoleFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增角色
    addRoleFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/projectRole/childrenAdd";
      var data = {
        projectCode: _this.ruleForm.projectCode,
        superCode:_this.curInfo.code,
        name: _this.ruleForm.name,
        roleCode:_this.ruleForm.roleCode,
        description: _this.ruleForm.description,
        status: parseInt(_this.ruleForm.status),
        lev: parseInt(_this.ruleForm.lev)
      };
      
      _this.$http.post(reqUrl,data).then(res => {
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




