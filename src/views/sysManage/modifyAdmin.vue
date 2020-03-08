<template>
  <div class="modifyAdmin">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email" v-if='modifyInfo.adminType!="customerAdmin"'>
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="mobile"  v-if='modifyInfo.adminType!="customerAdmin"'>
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="角色扩展：" prop="levExtend" v-if='userRight && modifyInfo.adminType=="HRadmin" && ruleForm.lev != 301'>
        <el-select v-model="ruleForm.levExtend" placeholder="请选择管理员类型" multiple>
          <el-option
          v-for="item in hrAdminRoles"
          :key="item.hrSysLev"
          :label="item.title"
          :value="item.hrSysLev.toString()"
          :disabled="(item.hrSysLev==ruleForm.lev || item.hrSysLev == 301)?true:false">
          <span style="float: left">{{ item.title }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.rightTxt }}</span>
        </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="假期权限：" prop="leavesAccess" v-if='userRight && modifyInfo.adminType=="HRadmin" && ruleForm.lev != 301'>
        <el-checkbox-group v-model="ruleForm.leavesAccess">
          <el-checkbox label="1">查看</el-checkbox>
          <el-checkbox label="2">审批</el-checkbox>
          <el-checkbox label="3">结算</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="报销权限：" prop="claimAccess" v-if='userRight && modifyInfo.adminType=="HRadmin" && ruleForm.lev != 301'>
        <el-checkbox-group v-model="ruleForm.claimAccess">
          <el-checkbox label="1">查看</el-checkbox>
          <el-checkbox label="2">审批</el-checkbox>
          <el-checkbox label="3">结算</el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item  label="服务归属：" prop="serveId" v-if="[3,4].indexOf(userInfo.roleTypeId) >= 0 ">
        <el-radio-group v-model="ruleForm.serveId">
          <el-radio :label="1">单位</el-radio>
          <el-radio :label="2" v-if="[201,211].indexOf(userInfo.lev)>= 0">区域</el-radio>
          <el-radio :label="3" v-if="[201].indexOf(userInfo.lev)>= 0">公司</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  name: "modifyAdmin",
  inject: ["reload"],
  props: ["modifyInfo","userRight","userInfo_prop"],
  data() {
    return {
      ruleForm: {
        id: 0,
        name: "",
        email: "",
        mobile: "",
        lev:"",
        serveId:"",
        levExtend:[],
        leavesAccess:[],
        claimAccess:[],
        userInfo:{},
        userRight:true,

      },
      hrAdminRoles:[],
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: false, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "请输入正确的手机号码",
            trigger: ["blur"]
          }
        ],
        email: [
          { required: false, message: "请输入电子邮箱", trigger: "blur" },
          {
            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            message: "请输入正确的邮箱",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  beforeMount(){
    this.userInfo = this.userInfo_prop;
  },
  mounted() {
    this.initFn();
    this.getHrAdminRoleInfo();
    this.userRight = this.userRight;
  },
  methods: {
    //初始化
    initFn() {
      
      this.ruleForm.id = this.modifyInfo.id;
      this.ruleForm.name = this.modifyInfo.name;
      this.ruleForm.email = this.modifyInfo.email;
      this.ruleForm.mobile = this.modifyInfo.mobile;
      this.ruleForm.lev = this.modifyInfo.lev;
      this.ruleForm.serveId = this.modifyInfo.serveId;
      if (this.modifyInfo.levExtend){
        this.ruleForm.levExtend = this.modifyInfo.levExtend.split(",");
      }
      if (this.modifyInfo.leavesAccess){
        this.ruleForm.leavesAccess = this.modifyInfo.leavesAccess.split(",");
      }
      if (this.modifyInfo.claimAccess){
        this.ruleForm.claimAccess = this.modifyInfo.claimAccess.split(",");
      }      
    },
    // 所有HR管理员角色属性
    getHrAdminRoleInfo() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/hrSys/getHrAdminRoleInfo";
      var data = {
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
            this.hrAdminRoles = res.data.data;
        } else {
          _this.$message(res.data.msg);
          return false;
        }
      })
      .catch(err => {
        console.log(err);
      });
    },    
    //提交表单
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch(this.modifyInfo.adminType)
          {
            case 'admin':
              _this.modifyAmdinFn();
              break;
            case 'HRadmin':
              _this.modifyHRadminFn();
              break;
            case 'customerAdmin':
              _this.modifyAmdinFn();
              break;
          }
        } else {
          return false;
        }
      });
    },
    // 修改管理员信息
    modifyAmdinFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/update";
      var data = {
        id: _this.ruleForm.id,
        email: _this.ruleForm.email,
        mobile: _this.ruleForm.mobile,
        name: _this.ruleForm.name,
        serveId : _this.ruleForm.serveId
      };
      _this.$http.post(reqUrl, data).then(res => {
          if (res.data.code == 0) {
            _this.reload();
            this.$message("修改成功");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改HR管理员
    modifyHRadminFn() {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/hrSys/update";
      var data = {
        id:_this.ruleForm.id,
        email: _this.ruleForm.email,
        mobile: _this.ruleForm.mobile,
        name: _this.ruleForm.name,
        serveId:_this.ruleForm.serveId,
        leavesAccess:'',
        claimAccess:'',
        levExtend:'',
      };
      if (_this.ruleForm.leavesAccess.length > 0){
        data.leavesAccess = _this.ruleForm.leavesAccess.join(",");
      }
      if (_this.ruleForm.claimAccess.length > 0){
        data.claimAccess = _this.ruleForm.claimAccess.join(",");
      }
      if (_this.ruleForm.levExtend.length > 0){
        data.levExtend = _this.ruleForm.levExtend.join(",");
      }
      _this.$http
        .post(reqUrl, data)
        .then(res => {
          _this.reload();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowAddAdmin", false);
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




