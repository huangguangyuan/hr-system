<template>
  <div class="modifyRole">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="角色名：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属项目：" prop="projectCode">
        <el-select v-model="ruleForm.projectCode" placeholder="请选择所属项目">
          <el-option
            v-for="item in ruleForm.projectList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="角色代号：" prop="roleCode">
        <el-input v-model="ruleForm.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <!-- <el-form-item label="分组：" prop="lev">
        <el-input v-model="ruleForm.lev" placeholder='分组900以上默认角色'></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="角色类型：" prop="typeId">
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
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "modifyRole",
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
    this.initializationFun();
    this.getProjectData();
  },
  methods: {
    // 初始化
    initializationFun(){
      this.ruleForm.name = this.curInfo.name;
      this.ruleForm.projectCode = this.curInfo.projectCode;
      this.ruleForm.roleCode = this.curInfo.roleCode;
      this.ruleForm.description = this.curInfo.description;
      this.ruleForm.lev = this.curInfo.lev;
      this.ruleForm.typeId = this.curInfo.typeId.toString();
      this.ruleForm.status = this.curInfo.status.toString();
    },
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.modifyFn();
        } else {
          return false;
        }
      });
    },
    // 修改角色
    modifyFn() {
      var reqUrl = "/server/api/v1/projectRole/update";
      var data = {
        id:this.curInfo.id,
        name: this.ruleForm.name,
        roleCode: this.ruleForm.roleCode,
        description: this.ruleForm.description,
        lev: parseInt(this.ruleForm.lev),
      };
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message('修改成功');
        }
      })
    },
    // 获取项目数据
    getProjectData() {
      var reqUrl = "/server/api/v1/project/getAll";
      var data = { typeId: 1 };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.ruleForm.projectList = res.data.data;
        } else {
          this.$message("res.data.code");
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
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




