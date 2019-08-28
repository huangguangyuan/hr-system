<template>
  <div class="editLayer">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="160px"
      v-if="ruleForm.userRight"
    >
      <el-form-item label="消息类型：" prop="typeId">
        <el-select v-model="ruleForm.typeId" placeholder="请选择消息类型">
          <el-option label="公开信息" value="1"></el-option>
          <el-option label="指定信息" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司" v-if="ruleForm.typeId == '2'">
        <el-select v-model="ruleForm.companyCode" placeholder="请选择所属公司" @change="selectCompany">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属地区" v-if="ruleForm.typeId == '2'">
        <el-select v-model="ruleForm.regionCode" placeholder="请选择地区" @change="selectRegion">
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属单位" v-if="ruleForm.typeId == '2'">
        <el-select v-model="ruleForm.BUCode" placeholder="请选择地区">
          <el-option
            v-for="item in BUList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息标题：" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="消息内容：" prop="content">
        <el-input type="textarea" v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.userRight">
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="160px"
      v-if="!ruleForm.userRight"
    >
      <h1 style="text-align:center">{{ruleForm.title}}</h1>

      <p style="padding:15px;">{{ruleForm.content}}</p>
      <el-divider></el-divider>
      <el-form-item>
        <el-button @click="cancelFn" style="float:right">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
let id = 0;
import { setTimeout } from "timers";
import axios from "axios";
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    const _that = this;
    return {
      ruleForm: {
        userRight: false,
        typeId: "",
        title: "",
        content: "",
        companyCode: "",
        regionCode: "",
        BUCode: ""
      }, //表单信息
      companyList: [],
      regionList: [],
      BUList: [],
      rules: {
        typeId: [
          { required: true, message: "请选择消息类型", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 获取公司列表
    getCompanys() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/companys";
      return new Promise(resolve => {
        _this.$http.post(reqUrl, {}).then(res => {
          this.companyList = res.data.data.map(item => {
            return {
              id: item.id,
              code: item.code,
              name: item.name
            };
          });
          resolve(this.companyList);
        });
      });
    },
    // 获取地区
    getRegion(num) {
      var _this = this;
      var reqUrl = "/server/api/v1/company/company";
      return new Promise(resolve => {
        _this.$http.post(reqUrl, { id: parseInt(num) }).then(res => {
          this.regionList = res.data.data.companyRegionList.map(item => {
            return {
              id: item.id,
              code: item.code,
              name: item.name
            };
          });
          resolve(this.regionList);
        });
      });
    },
    // 获取单位
    getUnit(num) {
      var _this = this;
      var reqUrl = "/server/api/v1/company/region";
      return new Promise(resolve => {
        _this.$http.post(reqUrl, { id: parseInt(num) }).then(res => {
          this.BUList = res.data.data.BUList.map(item => {
            return {
              id: item.id,
              code: item.code,
              name: item.name
            };
          });
          resolve(this.BUList);
        });
      });
    },
    // 选择公司
    selectCompany(val){
      var code = this.companyList.filter(item => {
        return item.code == val;
      })
      this.getRegion(code[0].id).then(res => {
        this.selectRegion(this.curInfo.regionCode);
      });
    },
    // 选择地区
    selectRegion(val){
      var code = this.regionList.filter(item => {
        return item.code == val;
      });
      this.getUnit(code[0].id);
    },
    // 初始化
    initializeFun() {
      this.getCompanys().then(res => {
        this.selectCompany(this.curInfo.companyCode);
      })
      if (this.curInfo.type == "modify") {
        this.ruleForm.userRight = this.curInfo.userRight;
        this.ruleForm.typeId = this.curInfo.typeId.toString();
        this.ruleForm.title = this.curInfo.title.toString();
        this.ruleForm.content = this.curInfo.content;
        this.ruleForm.companyCode = this.curInfo.companyCode;
        this.ruleForm.regionCode = this.curInfo.regionCode;
        this.ruleForm.BUCode = this.curInfo.BUCode;
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/info/buInfoAdd";
      var data = {
        typeId: parseInt(this.ruleForm.typeId),
        title: this.ruleForm.title,
        content: this.ruleForm.content,
        companyCode: this.ruleForm.companyCode || "",
        regionCode: this.ruleForm.regionCode || "",
        BUCode: this.ruleForm.BUCode || ""
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
      var reqUrl = "/server/api/v1/info/buInfoUpdate";
      var data = {
        id: this.curInfo.id,
        typeId: parseInt(this.ruleForm.typeId),
        title: this.ruleForm.title,
        content: this.ruleForm.content,
        companyCode: this.ruleForm.codeList[0] || "",
        regionCode: this.ruleForm.codeList[1] || "",
        BUCode: this.ruleForm.codeList[2] || ""
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
      this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style lang="scss">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
.el-cascader-menu__list {
  padding-right: 10px;
}
</style>


