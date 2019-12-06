<template>
  <div class="schemeEdit">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="方案名称：" prop="name" v-if="isShow">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="选择城市模板" prop="cityCode" v-if='curInfo.type == "add"'>
        <el-select v-model="ruleForm.cityCode" placeholder="请选择活动区域">
          <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型：" prop="typeId"  v-if='curInfo.type == "add"'>
        <el-radio-group v-model="ruleForm.typeId">
          <el-radio label="1">社保</el-radio>
          <el-radio label="2">公积金</el-radio>
          <el-radio label="3">香港MPF</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否复制城市模板：" prop="copyTemp" v-if='curInfo.type == "add"'>
        <el-radio-group v-model="ruleForm.copyTemp">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
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
import { setTimeout } from "timers";
export default {
  name: "schemeEdit",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        id:0,
        cityCode: "",
        typeId: "",
        name: "",
        copyTemp: ""
      }, //表单信息
      isShow: true, //是否显示
      cityList: [], //城市模板列表
      rules: {
        name: [{ required: true, message: "输入方案名称", trigger: "blur" }],
        typeId: [{ required: true, message: "请选择类型", trigger: "change" }],
        cityCode:[
          {
            required: true,
            message: "请选择城市模板",
            trigger: "change"
          }
        ],
        copyTemp: [
          {
            required: true,
            message: "请选择是否复制城市模板",
            trigger: "change"
          }
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
      this.getCityCode();
      if (this.curInfo.type == "modify") {
        this.ruleForm.code = this.curInfo.code;
        this.ruleForm.id = this.curInfo.id;
        this.ruleForm.cityCode = this.curInfo.cityCode;
        this.ruleForm.typeId = this.curInfo.typeId;
        this.ruleForm.name = this.curInfo.name;
      }
    },
    // 获取城市模板
    getCityCode() {
      var reqUrl = "/server/api/v1/city/getAll";
      this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
        this.cityList = res.data.data;
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          switch (_this.curInfo.type) {
            case "add":
              _this.addFun();
              break;
            case "modify":
              _this.modifyFun();
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/insuredScheme/add";
      var data = {
        BUCode: this.BUInfo.code,
        cityCode: this.ruleForm.cityCode,
        typeId: parseInt(this.ruleForm.typeId),
        name: this.ruleForm.name,
        copyTemp: parseInt(this.ruleForm.copyTemp)
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/insuredScheme/update";
      var data = {
        id: this.ruleForm.id,
        name: this.ruleForm.name
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功~");
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
    }
  },
  computed: {
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  }
};
</script>
<style scoped lang="scss">
.el-upload__tip {
  margin-top: 0;
}
</style>


