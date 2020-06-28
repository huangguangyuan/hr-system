<template>
  <div class="MPFinfo">
    <el-page-header @back="goBack" content="MPF信息"></el-page-header>
    <el-divider></el-divider>
    <!-- 内容 -->
    <div class="container" v-if="isContent">
      <!-- 头部内容 -->
      <div class="my-top">
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="modifyFun(tableData)" v-if="userRight.indexOf(2) >= 0">修 改</el-button>
          <!-- <el-button type="primary" icon="el-icon-setting" @click="setStatus(tableData.status)">状 态</el-button> -->
          <el-button type="primary" icon="el-icon-delete" @click="handleDelete" v-if="userRight.indexOf(2) >= 0">删 除</el-button>
        </el-button-group>
      </div>
      <el-divider>基础信息</el-divider>
      <ul class="infoList">
        <li>
          <span>MPF帐号：</span>
          <span>{{tableData.account}}</span>
        </li>
        <li>
          <span>MPF城市：</span>
          <span>{{tableData.mpfCity}}</span>
        </li>
        <li>
          <span>服务商名称：</span>
          <span>{{tableData.serviceProviderName}}</span>
        </li>
        <li>
          <span>自愿缴纳：</span>
          <span>{{tableData.mpfVoluntarily > 1?tableData.mpfVoluntarily + " 港元":tableData.mpfVoluntarily * 100 + " %"}}</span>
        </li>
        <li>
          <span>缴纳日期：</span>
          <span>{{tableData.contributionDate}}</span>
        </li>
        <li>
          <span>是否生效：</span>
          <span>{{tableData.status}}</span>
        </li>
        <li>
          <span>备注：</span>
          <span>{{tableData.remarks}}</span>
        </li>
      </ul>
      <el-divider>{{tableData.MPFSchemeDetail.name}}</el-divider>
      <el-table :data="schemeMPFList" stripe>
        <!-- <el-table-column prop="id" label="id"></el-table-column> -->
        <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
        <el-table-column prop="baseLower" label="基数下限"></el-table-column>
        <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
        <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
      </el-table>
    </div>
    <!-- 无内容 -->
    <div class="noContent" v-else>
      <el-button type="primary" @click="addFun" v-if="userRight.indexOf(2) >= 0">添加MPF信息</el-button>
      <p>暂无内容~</p>
    </div>
    <!-- 新增 -->
    <el-dialog
      title="添加MPF信息"
      :visible.sync="isShowEditLayer"
      :close-on-click-modal="false"
      width="60%"
    >
      <edit-layer
        v-on:listenIsShowMask="listenIsShowMask"
        :curInfo="curInfo"
        v-if="isShowEditLayer"
      ></edit-layer>
    </el-dialog>
  </div>
</template>
<script>
import {paymentIdTxt} from "@/lib/staticData.js";
import editLayer from "./editLayer.vue";
export default {
  name: "MPFinfo",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      userRight:[],
      tableData: {},
      schemeMPFList: [], //MPF方案列表
      curInfo: {}, //当前内容
      isShowEditLayer: false, //是否显示新增页面
      isContent: false //是否有内容
    };
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.getData();
  },
  methods: {
    //获取项目数据列表
    getData() {
      var reqUrl = "/server/api/v1/payroll/staff/insured/mpf/item";
      var myData = { staffCode: this.payrollInfo.code };
      this.$myApi.http.post(reqUrl, myData).then(res => {
          if (res.data.code == 0) {
            this.isContent = true;
            this.tableData = res.data.data;
            this.tableData.contributionDate = this.$toolFn.timeFormat(this.tableData.contributionDate).substring(0,10);
            this.schemeMPFList = res.data.data.MPFSchemeDetail.schemeMPFList.map(
              item => {
                item.paymentIdTxt = paymentIdTxt(item.paymentId);
                return item;
              }
            );
          }
        })
    },
    // 新增
    addFun() {
      this.isShowEditLayer = true;
      this.curInfo = {
        staffCode: this.payrollInfo.code,
        BUCode: this.payrollInfo.BUCode,
        type: "add"
      };
    },
    // 编辑
    modifyFun(res) {
      this.isShowEditLayer = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.curInfo.BUCode = this.payrollInfo.BUCode;
      this.curInfo.staffCode = this.payrollInfo.code;
    },
    // 设置状态
    setStatus(res) {
      var txt = "",
        status;
      if (res == 1) {
        txt = "此操作将会让数据失效, 是否继续?";
        status = 0;
      } else {
        txt = "此操作将会让数据生效, 是否继续?";
        status = 1;
      }
      this.$confirm(txt, "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$myApi.http.post("/server/api/v1/payroll/staff/insured/mpf/update", {
              staffCode: this.payrollInfo.code,
              status: status
            }).then(res => {
              this.reload();
              this.$message.success("修改成功");
            });
        })
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$myApi.http.post("/server/api/v1/payroll/staff/insured/mpf/delete", {
              staffCode: this.payrollInfo.code
            }).then(res => {
              if(res.data.code == 0){
                this.reload();
                this.$message.success("删除成功");
              }else{
                this.$message.error(res.data.code);
              }
            });
        })
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
    },
    // 返回
    goBack() {
      this.$store.commit({
        type: "getPayrollInfo",
        payrollKey: "payrollList"
      });
    }
  },
  computed: {
    payrollInfo() {
      return this.$store.state.payrollModule.payrollInfo;
    }
  },
  components: {
    editLayer
  }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.infoList {
  display: flex;
  flex-wrap: wrap;
  li {
    list-style-type: none;
    width: calc(25% - 10px);
    padding: 12px 0;
    border: 1px solid #6ec4db;
    margin: 0 10px 10px 0;
    border-radius: 8px;
    text-align: center;
    color: #6ec4db;
    font-size: 14px;
    box-sizing: border-box;
  }
}
.noContent {
  padding: 100px 0;
  text-align: center;
  p {
    font-size: 14px;
    margin-top: 15px;
    color: #cccccc;
  }
}
</style>






