<template>
  <div class="addCity">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定提交</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "addCity",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        id:"",
        name: "",
        remarks:""
      },//表单信息
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请输入备注", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    console.log(this.curInfo);
    if(this.curInfo.type == 'modify'){
        this.ruleForm = this.curInfo;
    }
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          if(_this.curInfo.type == 'add'){
              _this.addFun();
          }else{
              _this.modifyFun();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增城市
    addFun(){
        var _this = this;
        var reqUrl = '/server/api/v1/city/add';
        var data = {
            name:_this.ruleForm.name,
            remarks:_this.ruleForm.remarks
        }
        _this.$myApi.http.post(reqUrl,data).then(res => {
            if(res.data.code == 0){
                _this.reload();
                _this.$message.success('添加成功~');
            }
        })
    },
    // 修改城市信息
    modifyFun(){
        var _this = this;
        var reqUrl = '/server/api/v1/city/update';
        var data = {
            id:_this.ruleForm.id,
            name:_this.ruleForm.name,
            remarks:_this.ruleForm.remarks
        }
        _this.$myApi.http.post(reqUrl,data).then(res => {
            if(res.data.code == 0){
                _this.reload();
                _this.$message.success('修改成功~');
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


