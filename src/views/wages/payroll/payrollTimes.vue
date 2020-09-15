<template>
  <div class="deductionList">
    <el-page-header @back="goBack" :content="payrollMainInfo.nameChinese+'-多次出粮列表'"></el-page-header>
    <el-divider></el-divider>
    <!-- 头部内容 -->
    <div class="my-top">
      <el-button type="primary" @click="addFun">添 加</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe show-summary>
      <el-table-column prop="tbId" label="序号" width="60px"></el-table-column>
      <el-table-column prop="totalAmount" label="应税金额"></el-table-column>
      <el-table-column prop="adjAmount" label="调整金额"></el-table-column>
      <el-table-column prop="MPFAmount" label="MPF强制缴纳"></el-table-column>
      <el-table-column prop="MPFAmountSelf" label="MPF自愿缴纳"></el-table-column>
      <el-table-column prop="reallyAmount" label="总金额"></el-table-column>
      <el-table-column prop="notTaxableAmount" label="非应税金额"></el-table-column>
      <el-table-column prop="payDay" label="出粮日期"></el-table-column>
      <el-table-column prop="typeTxt" label="状态"></el-table-column>
      <el-table-column label="操作" width="450px">
        <template slot-scope="scope">
          <el-button v-if="[1,3].indexOf(scope.row.typeId) >= 0" size="mini" icon="el-icon-view" @click="openDetailFun(scope.$index, scope.row)">查看详细</el-button>
          <!-- <el-button v-show="[0].indexOf(scope.row.typeId) >= 0" size="mini" icon="el-icon-document-add" @click="editFun(scope.$index, scope.row)">编辑粮单</el-button> -->
          <el-button v-show="[1,3].indexOf(scope.row.typeId) < 0" size="mini" icon="el-icon-edit" @click="confirmFun(scope.$index, scope.row)">粮单确认</el-button>
          <el-button v-show="[1,3].indexOf(scope.row.typeId) >= 0" size="mini" icon="el-icon-document-add" @click="adjAmountFun(scope.$index, scope.row)">调整金额</el-button>
          <el-button v-show="[1,3].indexOf(scope.row.typeId) <= 0" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <el-dialog title="工资单明细" :visible.sync="isShowDetail" :close-on-click-modal="false" width="70%">
      <payroll-times-detail v-if="isShowDetail" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></payroll-times-detail>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog title="出粮项目" :visible.sync="isShowEditLayer" :close-on-click-modal="false" width="55%">
      <edit-layer v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo" v-if="isShowEditLayer"></edit-layer>
    </el-dialog>
    <!-- 确认工资单 -->
    <el-dialog title="确认工资单" :visible.sync="isShowConfirm" :close-on-click-modal="false">
      <payroll-time-confirm v-if="isShowConfirm" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></payroll-time-confirm>
    </el-dialog>
    <!-- 调整金额 -->
    <el-dialog title="调整金额" :visible.sync="isShowAdjAmount" :close-on-click-modal="false">
      <payroll-time-adj-amount-edit v-if="isShowAdjAmount" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></payroll-time-adj-amount-edit>
    </el-dialog>
  </div>
</template>
<script>
import payrollTimesDetail from "./payrollTimesDetail.vue";
import payrollTimeConfirm from "./payrollTimeConfirm.vue";
import payrollTimeAdjAmountEdit from "./payrollTimeAdjAmountEdit.vue";
import editLayer from "./payrollTimesEditLayer.vue";
import pageInfo from "@/components/pageInfo.vue";
import {payrollListTypeTxt} from "@/lib/staticData.js";
export default {
  components: {
    editLayer,pageInfo,payrollTimesDetail,payrollTimeConfirm,payrollTimeAdjAmountEdit
  },
  name: "deductionList",
  inject: ["reload"],
  data() {
    return {
      isShowDetail:false,
      isShowEditLayer:false,
      isShowConfirm:false,
      isShowAdjAmount:false,
      pageList: [],
      staffPayrollInfo:{},
      curInfo: {}, //当前内容
      isShowLoading: false, //是否显示loading页
    };
  },
  computed: {
    pageInfo(){
      return {
        pageSize:1000,
        reqParams:{
            url:"/server/api/v1/payroll/staff/payrollTimesList",
            data:{payrollCode: this.payrollMainInfo.code}
          }
        }
    },
    tableData(){
      let tbId = 1;
      return this.pageList.map(item => {
        item.tbId = tbId;
        item.reallyAmount = parseFloat(item.totalAmount) + parseFloat(item.adjAmount) + parseFloat(item.MPFAmount) + parseFloat(item.MPFAmountSelf);
        item.isInsuredTxt = item.isInsured == 1?'是':'否';
        item.payDay = this.$toolFn.timeFormat(item.payDay,"yyyy-MM-dd");
        item.typeTxt = payrollListTypeTxt(item.typeId);
        item.payrollTimesAmt = 0;
        tbId++;
        return item;
      });
    },
    payrollMainInfo() {
      return this.$store.state.payrollModule.payrollMainInfo;
    }
  },
  mounted() {
    this.getStaffPayrollInfo();
  },
  methods: {
    getStaffPayrollInfo(){
      this.$myApi.http.post("/server/api/v1/payroll/staff/staffPayrollInfo", { staffCode: this.payrollMainInfo.staffCode }).then(res => {
        this.staffPayrollInfo = res.data.data;
      });
    },
    /**
     * @description: 新增
     */
    addFun() {
      this.isShowEditLayer = true;
      this.curInfo.payrollMainInfo = this.payrollMainInfo;
      this.curInfo.staffPayrollInfo = this.staffPayrollInfo;
      this.curInfo.type = "add";
    },
    /**
     * @description: 编辑
     */
    editFun(index, res) {
      this.isShowEditLayer = true;
      this.curInfo = res;
      this.curInfo.payrollMainInfo = this.payrollMainInfo;
      this.curInfo.staffPayrollInfo = this.staffPayrollInfo;
      this.curInfo.type = "modify";
    },
    /**
     * @description: 详情
     */
    openDetailFun(index, res) {
      this.isShowDetail = true;
      this.curInfo.id = res.id;
    },
    /**
     * @description: 确认出粮项目
     */
    confirmFun(index, res) {
      this.curInfo = {
        id: res.id
      };
      this.isShowConfirm = true;
    },
    /**
     * @description: 调整金额
     */
    adjAmountFun(index, res) {
      this.curInfo = this.payrollMainInfo;
      this.curInfo.timesId = res.id;
      this.isShowAdjAmount = true;
    },
    // 编辑
    modifyFun(index, res) {
      this.isShowEditLayer = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$myApi.http.post("/server/api/v1/payroll/staff/payrollTimesDelete", { id: res.id }).then(res => {
              this.reload();
              this.$message.success("删除成功");
            });
        })
    },
    // 改变状态
    changStatus(res) {
      var reqUrl = "/server/api/v1/staff/deduction/update";
      var data = {
        id: res.id,
        staffCode: res.staffCode,
        status: res.status
      };
      this.$myApi.http.post(reqUrl, data).then(res => {});
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
      this.isShowDetail = res;
      this.isShowConfirm = res;
      this.isShowAdjAmount = res;
    },
    // 返回
    goBack() {
      this.$store.commit({
        type: "setPayrollMainKey",
        payrollMainKey: "staffPayrollList"
      });
    }
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
</style>






