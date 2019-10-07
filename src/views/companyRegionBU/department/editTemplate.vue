<template>
  <div class="editTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="所属单位" prop="BUCode" v-if='isShow'>
        <el-select v-model="ruleForm.BUCode" placeholder="请选择所属单位" @change="getBUCode">
          <el-option
            v-for="item in regionBUList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="主管：" prop="supervisorCodeArr" v-if='!curInfo.superCode'>
        <el-select v-model="ruleForm.supervisorCodeArr" placeholder="请选择主管" multiple>
          <el-option
            v-for="item in HRadminList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="假期主管" prop="holidaySupervisorCode" v-if='!curInfo.superCode'>
        <el-select v-model="ruleForm.holidaySupervisorCode" placeholder="请选择假期主管">
          <el-option
            v-for="item in HRadminList2"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="ruleForm.description"></el-input>
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
  name: "editTemplate",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        BUCode: "",
        supervisorCode:"",
        supervisorCodeArr:[],
        holidaySupervisorCode:"",
        name: "",
        description: "",
        status: ""
      }, //表单信息
      regionBUList: [], //单位列表
      HRadminList:[],//HR部门管理员列表
      HRadminList2:[],//HR假期管理员列表
      isShow: true, //是否显示
      rules: {
        BUCode: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        supervisorCodeArr: [
          { required: true, message: "请选择主管", trigger: "change" }
        ],
        holidaySupervisorCode: [
          { required: true, message: "请选择假期主管", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      var _this = this;
      _this.getRegionBUList();
      if (this.curInfo.type == "modify") {
        this.isShow = false;
        //this.ruleForm.status = this.curInfo;
        this.ruleForm.id = this.curInfo.id;
        this.ruleForm.BUCode = this.curInfo.BUCode;
        this.ruleForm.code = this.curInfo.code;
        this.ruleForm.name = this.curInfo.name;
        this.ruleForm.supervisorCode = this.curInfo.supervisorCode;
        this.ruleForm.description = this.curInfo.description;
        this.ruleForm.status = this.curInfo.status.toString();
        this.getHRadminList(this.curInfo.BUCode);
        //this.ruleForm.holidaySupervisorCode = this.curInfo.holidaySupervisorCode;
        
      }
    },
    // 获取单位code
    getBUCode(code){
      this.getHRadminList(code);
    },
    // 获取HR管理员列表
    getHRadminList(BUCode){
      // 部门管理员
      var _this = this;
      this.$http.post("/server/api/v1/admin/hrSys/getByLev",{BUCode: BUCode,lev:[521]}).then(res => {
        if(res.data.data){
          _this.HRadminList = res.data.data;
          var supervisorCodeArr = [];
          console.log(_this.ruleForm);
          if (_this.ruleForm.supervisorCode){
            supervisorCodeArr = _this.ruleForm.supervisorCode.split(',')
          }
          _this.ruleForm.supervisorCodeArr = supervisorCodeArr;
        }
      });
      // // 假期管理员
      // this.$http.post("/server/api/v1/admin/hrSys/getByLev",{BUCode: BUCode,lev:[511]}).then(res => {
      //   if(res.data.data){
      //     this.HRadminList2 = res.data.data;
      //   }
      // });
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
    // 新增单位
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/buDepartment/add";
      var data = {
          name:_this.ruleForm.name,
          description:_this.ruleForm.description,
          status:parseInt(_this.ruleForm.status),
          BUCode:_this.ruleForm.BUCode,
          supervisorCode:_this.ruleForm.supervisorCodeArr.join(','),
          holidaySupervisorCode:_this.ruleForm.holidaySupervisorCode
      }
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message.success("新增成功~");
        } else {
          _this.$message.error(res.data.msg);
        }
      });
    },
    // 修改信息
    modifyFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/buDepartment/update";
      var data = {
        id:_this.curInfo.id,
        name:_this.ruleForm.name,
        description:_this.ruleForm.description,
        status:parseInt(_this.ruleForm.status),
        supervisorCode:_this.ruleForm.supervisorCodeArr.join(','),
        //holidaySupervisorCode:_this.ruleForm.holidaySupervisorCode
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message.success("修改成功~");
        } else {
          _this.$message(res.data.msg);
        }
      });
    },
    // 获取单位列表
    getRegionBUList() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUs";
      _this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          _this.regionBUList = res.data.data;
        } else {
          _this.$message({ type: "info", message: `报错：${res.data.code}` });
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


