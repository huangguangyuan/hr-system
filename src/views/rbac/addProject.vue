<template>
  <div class="addProject">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- 项目名称 -->
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <!-- 项目状态 -->
      <el-form-item label="是否禁用" required prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">禁用</el-radio>
          <el-radio label="0">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 项目类型 -->
      <el-form-item label="项目类型" prop="typeId" required v-if='isType != "modify"'>
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">后台管理员</el-radio>
          <el-radio label="2">HR管理员</el-radio>
          <el-radio label="3">员工</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 项目描述 -->
      <el-form-item label="项目描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="submitForm('ruleForm')">确认</el-button>
        <el-button type="danger" @click='cancelFn'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "addProject",
  inject:['reload'],
  props:['isType'],
  data() {
    return {
      ruleForm: {
        name: "", //项目名称
        status: "", //项目状态
        typeId: "", //项目类型
        description: "" //项目描述
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur"
          }
        ],
        status: [
          { required: true, message: "请选项目状态", trigger: "change" }
        ],
        typeId: [
          { required: true, message: "请选项目类型", trigger: "change" }
        ],
        description: [{ required: true, message: "请填项目描述", trigger: "blur" }]
      }
    };
  },
  mounted(){
    if(this.isType == 'modify'){
      this.ruleForm = this.editInfo;
      this.ruleForm.status = this.ruleForm.status.toString();
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.isType == 'modify'){
            this.modifyFn();
          }else{
            this.addFn();
          }
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 取消
    cancelFn(){
      this.$emit('listenIsShowProject',false);
    },
    // 新增
    addFn(){
      var reqUrl = '/server/api/v1/project/add';
      this.$myApi.http.post(reqUrl, this.ruleForm).then(res => {
        if (res.data.code == 0) {
          this.reload();
        }
      })
    },
    // 修改
    modifyFn(){
      var reqUrl = '/server/api/v1/project/update'
      var data = {
        "id":this.ruleForm.id,
        "name":this.ruleForm.name,
        "description":this.ruleForm.description,
        "status":this.ruleForm.status
      }
      this.$myApi.http.post(reqUrl,data).then(res => {
        if (res.data.code == 0) {
          this.reload();
        }
      })
    }
  },
  computed:{
    editInfo() {
      return this.$store.state.projectModul.editInfo;
    }
  }
};
</script>




