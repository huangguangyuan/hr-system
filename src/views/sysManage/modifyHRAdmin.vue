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
      <el-form-item label="管理员角色：" prop="lev" v-if="userInfo.roleTypeId == 2" >
        <el-select v-model="ruleForm.lev" placeholder="请选择管理员类型" :disabled="userInfo.lev != 301?true:false">
          <el-option
          v-for="item in hrAdminRoles"
          :key="item.hrSysLev"
          :label="item.title"
          :value="item.hrSysLev">
          <span style="float: left">{{ item.title }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.rightTxt }}</span>
        </el-option>
        </el-select>
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
      <el-form-item  label="服务归属：" prop="serveId" v-if="[4].indexOf(userInfo.roleTypeId) >= 0?true:false ">
        <el-radio-group v-model="ruleForm.serveId">
          <el-radio :label="1" :disabled="[221,201,211].indexOf(userInfo.lev)>= 0?false:true ">单位</el-radio>
          <el-radio :label="2" :disabled="[201,211].indexOf(userInfo.lev)>= 0?false:true ">区域</el-radio>
          <el-radio :label="3" :disabled="[201].indexOf(userInfo.lev)>= 0?false:true ">公司</el-radio>
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
    console.log(this.userInfo);
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
      
      var reqUrl = "/server/api/v1/admin/hrSys/getHrAdminRoleInfo";
      var data = {
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
            this.hrAdminRoles = res.data.data;
        } else {
          this.$message(res.data.msg);
          return false;
        }
      })
      .catch(err => {
        console.log(err);
      });
    },    
    //提交表单
    submitForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch(this.modifyInfo.adminType)
          {
            case 'admin':
              this.modifyAmdinFn();
              break;
            case 'HRadmin':
              this.modifyHRadminFn();
              break;
            case 'customerAdmin':
              this.modifyAmdinFn();
              break;
          }
        } else {
          return false;
        }
      });
    },
    // 修改管理员信息
    modifyAmdinFn() {
      
      var reqUrl = "/server/api/v1/admin/update";
      var data = {
        id: this.ruleForm.id,
        email: this.ruleForm.email,
        mobile: this.ruleForm.mobile,
        name: this.ruleForm.name,
        serveId : this.ruleForm.serveId
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
          if (res.data.code == 0) {
            this.reload();
            this.$message("修改成功");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改HR管理员
    modifyHRadminFn() {
      
      var reqUrl = "/server/api/v1/admin/hrSys/update";
      var data = {
        id:this.ruleForm.id,
        email: this.ruleForm.email,
        mobile: this.ruleForm.mobile,
        name: this.ruleForm.name,
        serveId:this.ruleForm.serveId,
        lev:this.ruleForm.lev,
        leavesAccess:'',
        claimAccess:'',
        levExtend:'',
      };
      if (this.ruleForm.leavesAccess.length > 0){
        data.leavesAccess = this.ruleForm.leavesAccess.join(",");
      }
      if (this.ruleForm.claimAccess.length > 0){
        data.claimAccess = this.ruleForm.claimAccess.join(",");
      }
      if (this.ruleForm.levExtend.length > 0){
        data.levExtend = this.ruleForm.levExtend.join(",");
      }
      this.$myApi.http.post(reqUrl, data).then(() => {
          this.reload();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消
    cancelFn() {
      
      this.$emit("listenIsShowAddAdmin", false);
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




