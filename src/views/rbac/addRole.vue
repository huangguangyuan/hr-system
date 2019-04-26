<template>
  <div class="addRole">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="角色名：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="所属项目：" prop="projectCode">
        <el-select v-model="ruleForm.projectCode" placeholder="请选择所属项目">
          <el-option v-for='item in ruleForm.projectList' :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色代号：" prop="roleCode">
        <el-input v-model="ruleForm.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="角色类型：" prop="typeId">
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">管理员角色</el-radio>
          <el-radio label="2">HR系统角色角色</el-radio>
          <el-radio label="3">员工</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "addRole",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        name: "",
        projectCode:"",
        projectList:[],
        roleCode:"",
        description:"",
        typeId:"",
        status:"",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        projectCode: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ],
        roleCode: [
          { required: true, message: "请输入角色代号", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
        typeId: [
          { required: true, message: "请选择角色类型", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择角色状态", trigger: "change" }
        ]
      }
    };
  },
  mounted(){
      this.getProjectData();
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取项目数据
    getProjectData(){
        var _this = this;
        var reqUrl = '/server/api/v1/project/getAll';
        var data = {"typeId":1};
        _this.$http.post(reqUrl,data).then(res => {
            console.log(res);
            if(res.data.code == 0){
                _this.ruleForm.projectList = res.data.data;
            }else{
                _this.$message('res.data.code');
            }
        })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
};
</script>
<style scoped lang="scss">
</style>




