<template>
  <div class="schemeHCAdd">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="基数上限" prop="baseUpper">
        <el-input v-model="ruleForm.baseUpper"></el-input>
      </el-form-item>
      <el-form-item label="基数下限" prop="baseLower">
        <el-input v-model="ruleForm.baseLower"></el-input>
      </el-form-item>
      <el-form-item label="缴纳比例" prop="paymentRatio">
        <el-input v-model="ruleForm.paymentRatio"></el-input>
      </el-form-item>
      <el-form-item label="缴纳对象" prop="paymentId" v-if="isShow">
        <el-radio-group v-model="ruleForm.paymentId">
          <el-radio label="1">公司</el-radio>
          <el-radio label="2">个人</el-radio>
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
  name: "schemeHCAdd",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        baseUpper: "",
        baseLower: "",
        paymentRatio: "",
        paymentId: ""
      }, //表单信息
      isShow: true, //是否显示
      cityList: [], //城市模板列表
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
          { required: true, message: "请选择纳税对象", trigger: "change" }
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
        this.ruleForm.baseUpper = this.curInfo.baseUpper;
        this.ruleForm.baseLower = this.curInfo.baseLower;
        this.ruleForm.paymentRatio = this.curInfo.paymentRatio;
        this.isShow = false;
      }
    },
    // 提交表单
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
      var reqUrl = "/server/api/v1/bu/insuredScheme/hc/add";
      var data = {
        schemeCode: this.curInfo.schemeCode,
        baseUpper: parseFloat(this.ruleForm.baseUpper),
        baseLower: parseFloat(this.ruleForm.baseLower),
        paymentRatio: parseFloat(this.ruleForm.paymentRatio),
        paymentId: parseInt(this.ruleForm.paymentId)
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$emit("listenIsShowMask", false);
          this.$message.success("新增成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/bu/insuredScheme/hc/update";
      var data = {
        id: this.curInfo.id,
        cityCode: this.curInfo.cityCode,
        baseUpper: parseFloat(this.ruleForm.baseUpper),
        baseLower: parseFloat(this.ruleForm.baseLower),
        paymentRatio:parseFloat(this.ruleForm.paymentRatio)
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$emit("listenIsShowMask", false);
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
    
  }
};
</script>
<style scoped lang="scss">
.el-upload__tip {
  margin-top: 0;
}
</style>


