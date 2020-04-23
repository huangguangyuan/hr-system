<template>
  <div class="staffWagesConfig">
    <el-page-header @back="goBack" content="薪资配置"></el-page-header>
    <div class="header-info">
      <el-avatar :size="130" :src="circleUrl"></el-avatar>
      <div class="message">
        <h5>{{staffInfo.nameChinese}}</h5>
        <el-divider></el-divider>
      </div>
    </div>
    <div class="container" v-if='isContent'>
      <el-button type="primary" @click="editFun" v-if="isShowEditBtn">修改配置</el-button>
      <el-divider></el-divider>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">基本工资：{{configureMsg.salary}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">是否正常缴纳社保：{{configureMsg.needSI}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">是否正常缴纳公积金：{{configureMsg.needHC}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">是否正常使用专项附加扣除：{{configureMsg.needSD}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">是否正常扣税：{{configureMsg.needTaxRate}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">状态：{{configureMsg.typeId}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">强制缴纳类型：{{configureMsg.insuredTypeId}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">出粮方式：{{configureMsg.payrollTimesType}}</el-card>
        </el-col>
      </el-row>
    </div>
    <div class="noContent" v-else>
      <el-button type="primary" @click="addFun" v-if="isShowAddBtn">添加配置</el-button>
      <p>暂无内容~</p>
    </div>

    <!-- 设置员工配置 -->
    <el-dialog title="设置员工配置" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
  </div>
</template>
<script>
import {payrollTimesTypes,insuredTypes} from "@/lib/staticData.js";
import editLayer from "./editLayer.vue";
export default {
  name: "staffWagesConfig",
  inject: ["reload"],
  data() {
    return {
      payrollTimesTypes:[],
      insuredTypes:[],
      circleUrl: "",
      activeName: "education",
      configureMsg:{},
      curInfo: {},
      isContent:false,
      isShowEditBtn:false,
      isShowAddBtn:false,
      isShowAddAccess: false, //是否显示新增权限页面
      isShowLoading: false //是否显示loading页
    };
  },
  mounted() {
    this.payrollTimesTypes = payrollTimesTypes();
    this.insuredTypes = insuredTypes();
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.access.payrollMain.indexOf(2) >= 0){
      this.isShowEditBtn = true;
    }
    if (this.userInfo.access.payrollMain.indexOf(4) >= 0){
      this.isShowAddBtn = true;
    }
    this.circleUrl = this.staffInfo.photo
      ? this.staffInfo.photo
      : require("@/assets/images/avatar.png");;
    this.activeName = this.$toolFn.sessionGet("staffNavActive")
      ? this.$toolFn.sessionGet("staffNavActive")
      : "education";
    this.getData();
  },
  methods: {
    // 返回
    goBack() {
      this.$store.commit({
        type: "getWagesInfo",
        wagesKey: "wagesStaffList"
      });
    },
    // 获取数据
    getData() {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollConfig";
      var data = { staffCode: this.staffInfo.code };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          let resData = res.data.data;
          this.configureMsg = {
            id:resData.id,
            salary:resData.salary,
            needSI:resData.needSI == 1?'是':'否',
            needHC:resData.needHC == 1?'是':'否',
            needSD:resData.needSD == 1?'是':'否',
            needTaxRate:resData.needTaxRate == 1?'是':'否',
            typeId:resData.typeId == 1?'正常':'停用',
            insuredTypeId:this.payrollTimesTypes.filter(f=>{return f.val == resData.insuredTypeId})[0].txt,
            payrollTimesType:this.insuredTypes.filter(f=>{return f.val == resData.payrollTimesType})[0].txt,
            // payrollTimesType:res.data.data.payrollTimesType == 1?'否':'是',
          }

          this.isContent = true;
          this.curInfo = res.data.data;
          this.curInfo.type = 'modify';
        }
      });
    },
    // 添加配置
    addFun() {
      this.isShowAddAccess = true;
      this.curInfo = {
        editType: "add",
        staffCode: this.staffInfo.code
      };
    },
    // 修改配置
    editFun(){
      this.isShowAddAccess = true;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
    }
  },
  computed: {
    staffInfo() {
      return this.$store.state.wagesModule.wagesInfo;
    }
  },
  components: {
    editLayer
  }
};
</script>
<style scoped lang="scss">
.staffWagesConfig {
  .header-info {
    margin: 20px auto 0;
    box-sizing: border-box;
    padding: 30px 50px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    color: #ffffff;
    background-color: #439145;
    .message {
      flex: 1;
      box-sizing: border-box;
      padding: 0 0 0 30px;
      h5 {
        font-size: 22px;
      }
      p {
        font-size: 14px;
        margin: 8px auto 0;
        span {
          margin-left: 10px;
        }
        i {
          font-weight: 500;
          font-size: 15px;
        }
      }
    }
  }
  .el-tabs {
    padding: 0 50px;
    margin: 20px auto 0;
  }
  .container {
    margin: 20px auto 0;
    .el-card{
      margin-top: 12px;height: 60px;overflow: hidden;
      }
  }
  .noContent {
    margin: 20px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 200px;
    p {
      margin: 10px auto 0;
      font-size: 14px;
      color: #cccccc;
    }
  }
}
</style>






