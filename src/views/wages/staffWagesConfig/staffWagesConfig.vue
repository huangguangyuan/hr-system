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
import editLayer from "./editLayer.vue";
export default {
  name: "staffWagesConfig",
  inject: ["reload"],
  data() {
    return {
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
    this.userInfo = this.$toolFn.localGet("userInfo");
    if (this.userInfo.access.payrollMain.indexOf(2) >= 0){
      this.isShowEditBtn = true;
    }
    if (this.userInfo.access.payrollMain.indexOf(4) >= 0){
      this.isShowAddBtn = true;
    }
    this.circleUrl = this.staffInfo.photo
      ? this.staffInfo.photo
      : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
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
          this.configureMsg = {
            id:res.data.data.id,
            salary:res.data.data.salary,
            needSI:res.data.data.needSI == 1?'是':'否',
            needHC:res.data.data.needHC == 1?'是':'否',
            needSD:res.data.data.needSD == 1?'是':'否',
            needTaxRate:res.data.data.needTaxRate == 1?'是':'否',
            typeId:res.data.data.typeId == 1?'正常':'停用',
            insuredTypeId:res.data.data.insuredTypeId == 1?'中国（社保，医保，公积金）':'香港（MPF）',
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
    .el-card{margin-top: 12px;}
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






