<template>
  <div class="addHCtemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="城市：" prop="name">
        <el-select v-model="ruleForm.cityCode" placeholder="请选择城市">
          <el-option
            v-for="item in cityList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="基数上限：" prop="baseUpper">
        <el-input v-model="ruleForm.baseUpper"></el-input>
      </el-form-item>
      <el-form-item label="基数下限：" prop="baseLower">
        <el-input v-model="ruleForm.baseLower"></el-input>
      </el-form-item>
      <el-form-item label="缴纳比例：" prop="paymentRatio">
        <el-input v-model="ruleForm.paymentRatio"></el-input>
      </el-form-item>
      <el-form-item label="缴纳对象" prop='paymentId'  v-if='curInfo.type == "add"'>
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
  name: "addHCtemplate",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      cityList: [], //城市列表
      ruleForm: {
        cityCode: "",
        baseUpper: "",
        baseLower: "",
        paymentRatio: "",
        paymentId: ""
      }, //表单信息
      rules: {
        cityCode: [
          { required: true, message: "请选择公司", trigger: "change" }
        ],
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
          { required: true, message: "请选择缴纳对象", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    var _this = this;
    console.log(this.curInfo);
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.ruleForm.paymentId = this.ruleForm.paymentId.toString();
    }
    _this.getCityList();
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          if (_this.curInfo.type == "add") {
            _this.addFun();
          } else {
            _this.modifyFun();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取城市列表
    getCityList() {
      var _this = this;
      var reqUrl = "/server/api/v1/city/getAll";
      var data = {};
      _this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.cityList = res.data.data;
        }
      });
    },
    // 添加
    addFun(){
        var _this = this;
        var reqUrl = '/server/api/v1/cityHC/add';
        var data = {
            cityCode:_this.ruleForm.cityCode,
            baseUpper:Number(_this.ruleForm.baseUpper),
            baseLower:Number(_this.ruleForm.baseLower),
            paymentRatio:Number(_this.ruleForm.paymentRatio),
            paymentId:Number(_this.ruleForm.paymentId)
        };
        _this.$myApi.http.post(reqUrl,data).then(res => {
            if(res.data.code == 0){
                _this.reload();
                _this.$message('添加成功~');
            }else{
                _this.$alert(res.data.msg,'提 示');
            }
        })
    },
    // 修改
    modifyFun(){
        var _this = this;
        var reqUrl = '/server/api/v1/cityHC/update';
        var data = {
            id:_this.ruleForm.id,
            cityCode:_this.ruleForm.cityCode,
            baseUpper:Number(_this.ruleForm.baseUpper),
            baseLower:Number(_this.ruleForm.baseLower),
            paymentRatio:Number(_this.ruleForm.paymentRatio),
            paymentId:Number(_this.ruleForm.paymentId)
        };
        _this.$myApi.http.post(reqUrl,data).then(res => {
            if(res.data.code == 0){
                _this.reload();
                _this.$message('修改成功~');
            }else{
                _this.$alert(res.data.msg,'提 示');
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


