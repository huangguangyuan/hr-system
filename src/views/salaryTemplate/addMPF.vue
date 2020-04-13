<template>
  <div class="addMPF">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="基数上限：" prop="baseUpper">
        <el-input v-model="ruleForm.baseUpper"></el-input>
      </el-form-item>
      <el-form-item label="基数下限" prop="baseLower">
        <el-input v-model="ruleForm.baseLower"></el-input>
      </el-form-item>
      <el-form-item label="缴纳比例" prop="paymentRatio">
        <el-input v-model="ruleForm.paymentRatio"></el-input>
      </el-form-item>
      <el-form-item label="缴纳对象：" prop="paymentId" v-if="isShow">
        <el-radio-group v-model="ruleForm.paymentId">
          <el-radio label="1">公司</el-radio>
          <el-radio label="2">个人</el-radio>
        </el-radio-group>
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
  name: "addMPF",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        cityCode: "c4900a00-a7a4-11e9-bb56-837dd7ac904b",
        baseUpper: "",
        baseLower: "",
        paymentRatio: "",
        paymentId: ""
      }, //表单信息
      isShow: true,
      rules: {
        baseUpper: [
          { required: true, message: "请输入基数上限", trigger: "blur" }
        ],
        baseLower: [
          { required: true, message: "请输入基数下限", trigger: "blur" }
        ],
        paymentRatio: [
          { required: true, message: "请输入缴纳比例", trigger: "blur" }
        ],
        paymentId: [
          { required: true, message: "请选择纳税对象", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.ruleForm.paymentId = this.ruleForm.paymentId.toString();
      this.isShow = false;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.curInfo.type == "add") {
            this.addFun();
          } else {
            this.modifyFun();
          }
        } else {
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/cityMPF/add";
      var data = {
        cityCode: this.ruleForm.cityCode,
        baseUpper: parseFloat(this.ruleForm.baseUpper),
        baseLower: parseFloat(this.ruleForm.baseLower),
        paymentRatio: parseFloat(this.ruleForm.paymentRatio),
        paymentId: parseInt(this.ruleForm.paymentId)
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.data.code);
        }
      });
    },
    // 修改城市信息
    modifyFun() {
      var reqUrl = "/server/api/v1/cityMPF/update";
      var data = {
        id: this.curInfo.id,
        cityCode: this.curInfo.cityCode,
        baseUpper: parseFloat(this.ruleForm.baseUpper),
        baseLower: parseFloat(this.ruleForm.baseLower),
        paymentRatio: parseFloat(this.ruleForm.paymentRatio)
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.data.msg);
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


