<template>
  <div class="insured">
    <el-page-header @back="goBack" content="缴纳社保/公积金信息"></el-page-header>
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
        <!-- <li>
          <span>ID：</span>
          <span>{{tableData.id}}</span>
        </li> -->
        <li>
          <span>社保账号：</span>
          <span>{{tableData.SIAccount}}</span>
        </li>
        <li>
          <span>社保城市：</span>
          <span>{{tableData.SICity}}</span>
        </li>
        <li>
          <span>该地社保首次购买社保：</span>
          <span>{{tableData.SICityFirst==1?'是':'否'}}</span>
        </li>
        <li>
          <span>社保基数：</span>
          <span>{{tableData.SIBase}}</span>
        </li>
        <li>
          <span>公积金账号：</span>
          <span>{{tableData.HCAccount}}</span>
        </li>
        <li>
          <span>公积金城市：</span>
          <span>{{tableData.HCCity}}</span>
        </li>
        <li>
          <span>该地首次购买公积金：</span>
          <span>{{tableData.HCCityFirst==1?'是':'否'}}</span>
        </li>
        <li>
          <span>公积金基数：</span>
          <span>{{tableData.HCRealityAoumt}}</span>
        </li>
        <li>
          <span>医疗保险卡号：</span>
          <span>{{tableData.medicalSchemeAccount}}</span>
        </li>
        <li>
          <span>户籍类型：</span>
          <span>{{tableData.householdIdTxt}}</span>
        </li>
        <li>
          <span>是否生效：</span>
          <span>{{tableData.status==1?'是':'否'}}</span>
        </li>
        <li>
          <span>备注：</span>
          <span>{{tableData.remarks}}</span>
        </li>
      </ul>
      <el-divider v-if="tableData.SISchemeDetail">{{tableData.SISchemeDetail.name}}</el-divider>
      <el-table :data="schemeSIList" stripe v-if="tableData.SISchemeDetail">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
        <el-table-column prop="baseLower" label="基数下线"></el-table-column>
        <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
        <el-table-column prop="typeIdTxt" label="类 型"></el-table-column>
        <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
      </el-table>
      <el-divider v-if="tableData.HCSchemeDetail">{{tableData.HCSchemeDetail.name}}</el-divider>
      <el-table v-if="tableData.HCSchemeDetail" :data="schemeHCList" stripe>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
        <el-table-column prop="baseLower" label="基数下线"></el-table-column>
        <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
        <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
      </el-table>
    </div>
    <!-- 无内容 -->
    <div class="noContent" v-else>
      <el-button type="primary" @click="addFun" v-if="userRight.indexOf(2) >= 0">添加社保/公积金方案</el-button>
      <p>暂无内容~</p>
    </div>
    <!-- 新增 -->
    <el-dialog
      title="添加社保/公积金方案"
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
import {SITxt,paymentIdTxt,householdIdTxt} from "@/lib/staticData.js";
import editLayer from "./editLayer.vue";
export default {
  name: "insured",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      userRight:[],
      tableData: {},
      schemeSIList: [], //社保方案列表
      schemeHCList: [], //公积金方案列表
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
      var reqUrl = "/server/api/v1/payroll/staff/insured/item";
      var myData = { staffCode: this.payrollInfo.code };
      this.$myApi.http.post(reqUrl, myData).then(res => {
          if (res.data.code == 0) {
            this.isContent = true;
            this.tableData = res.data.data;
            this.tableData.householdIdTxt = householdIdTxt(this.tableData.householdId);
            if (!res.data.data){
              this.isContent = false;
              return;
            }
            this.schemeSIList = res.data.data.SISchemeDetail.schemeSIList.filter(f=>f.paymentId == 2).map(
              item => {
                item.typeIdTxt = SITxt(item.typeId);
                item.paymentIdTxt = paymentIdTxt(item.paymentId);
                return item;
              }
            );
            this.schemeHCList = res.data.data.HCSchemeDetail.schemeHCList.filter(f=>f.paymentId == 2).map(
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
          this.$myApi.http.post("/server/api/v1/payroll/staff/insured/update", {
              staffCode: this.payrollInfo.code,
              status: status
            }).then(res => {
              this.reload();
              this.$message.success("修改成功~");
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
          this.$myApi.http.post("/server/api/v1/payroll/staff/insured/delete", {
              staffCode: this.payrollInfo.code
            }).then(res => {
              if(res.data.code == 0){
                this.reload();
                this.$message.success("删除成功~");
              }else{
                this.$message.error(res.data.msg);
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
    },
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






