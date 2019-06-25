<template>
  <div class="editEducation">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="所属单位" prop="BUcode" v-if='isShow'>
        <el-select v-model="ruleForm.BUcode" placeholder="请选择所属单位" @change="getBUcode">
          <el-option
            v-for="item in regionBUList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报销主管" prop="claimingSupervisorCode" v-if='!curInfo.superCode'>
        <el-select v-model="ruleForm.claimingSupervisorCode" placeholder="请选择报销主管">
          <el-option
            v-for="item in HRadminList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="假期主管" prop="holidaySupervisorCode" v-if='!curInfo.superCode'>
        <el-select v-model="ruleForm.holidaySupervisorCode" placeholder="请选择假期主管">
          <el-option
            v-for="item in HRadminList2"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editEducation",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        BUcode: "",
        claimingSupervisorCode:"",
        holidaySupervisorCode:"",
        name: "",
        description: "",
        status: ""
      }, //表单信息
      regionBUList: [], //单位列表
      HRadminList:[],//HR报销管理员列表
      HRadminList2:[],//HR假期管理员列表
      isShow: true, //是否显示
      rules: {
        BUcode: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        claimingSupervisorCode: [
          { required: true, message: "请选择报销主管", trigger: "change" }
        ],
        holidaySupervisorCode: [
          { required: true, message: "请选择假期主管", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择转态", trigger: "change" }]
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
        this.getHRadminList(this.curInfo.BUCode);
        this.ruleForm = this.curInfo;
        this.ruleForm.status = this.curInfo.status.toString();
        this.ruleForm.claimingSupervisorCode = this.curInfo.claimingSupervisorCode;
        this.ruleForm.holidaySupervisorCode = this.curInfo.holidaySupervisorCode;
        this.isShow = false;
      }
    },
    // 获取单位code
    getBUcode(code){
      this.getHRadminList(code);
    },
    // 获取HR管理员列表
    getHRadminList(BUCode){
      // 报销管理员
      this.$http.post("/server/api/v1/admin/hrSys/getByLev",{BUCode: BUCode,lev:[301,501,521]}).then(res => {
        if(res.data.data){
          this.HRadminList = res.data.data;
        }
      });
      // 假期管理员
      this.$http.post("/server/api/v1/admin/hrSys/getByLev",{BUCode: BUCode,lev:[301,501,511]}).then(res => {
        if(res.data.data){
          this.HRadminList2 = res.data.data;
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
    // 新增单位
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/buDepartment/add";
      var data = {
          name:_this.ruleForm.name,
          description:_this.ruleForm.description,
          status:parseInt(_this.ruleForm.status),
          BUCode:_this.ruleForm.BUcode,
          claimingSupervisorCode:_this.ruleForm.claimingSupervisorCode,
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
        claimingSupervisorCode:_this.ruleForm.claimingSupervisorCode,
        holidaySupervisorCode:_this.ruleForm.holidaySupervisorCode
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


