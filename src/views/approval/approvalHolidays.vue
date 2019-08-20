<template>
  <div class="approvalHolidays wrap">
    <h5 class="title-h5">请假列表</h5>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column prop="staff.nameChinese" label="申请人"></el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="200"></el-table-column>
      <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
      <el-table-column prop="totalDay" label="请假天数"></el-table-column>
      <el-table-column prop="totalAmount" label="金 额"></el-table-column>
      <el-table-column prop="isWithpayTxt" label="是否带薪"></el-table-column>
      <el-table-column prop="nextStepTip" label="下一步提示"></el-table-column>
      <el-table-column prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-info"
            @click="handleDetails(scope.$index,scope.row)"
          >查看{{approveTxt(scope.row)}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <div class="pageInfo">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="curChange"
      ></el-pagination>
      <p>当前为第 {{curPage}} 页，共有 {{pageTotal}} 页</p>
    </div>
    <!-- 请假表单详情 -->
    <el-dialog title="请假申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <approval-holidays-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></approval-holidays-details>
    </el-dialog>
  </div>
</template>
<script>
import approvalHolidaysDetails from "./approvalHolidaysDetails.vue";
import { truncate } from 'fs';
let id = 0;
export default {
  name: "approvalHolidays",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {},
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      hrCode: "baa7b350-96f4-11e9-9069-bf35c07c51d4",
      rightStatus:[], //当前管理员可审批的申请类型
    };
  },
  mounted() {
    this.userInfo = this.$toolFn.localGet("userInfo");
    if (this.userInfo.roleTypeId == 2 ){
      this.hrCode = this.userInfo.userCode;
      if (this.userInfo.lev == 301){
        this.rightStatus = [1,2,3];
      }else if ([501,511].indexOf(this.userInfo.lev) >= 0){//主管，假期审批主管
        this.rightStatus = [1];
      }else if ([601,611].indexOf(this.userInfo.lev) >= 0){//人事，人事文员
        this.rightStatus = [2];
      }
    }else if (this.userInfo.roleTypeId == 3){
      this.rightStatus = [1,2,3];
    }
    this.getData(this.hrCode);
  },
  methods: {
    approveTxt(item){//显示文字并判断是否有权限审批
      item.canApprove = false;
      var str = "";
      if (this.rightStatus.length == 0){
        str = "";
      }
      if (this.rightStatus.indexOf(item.status) >= 0){
        str = "并审批";
        item.canApprove = true;
      }
      if (item.status >= 3){
        str = "";
      }
      return str

    },
    //获取数据列表
    getData(hrCode) {
      var reqUrl = "/server/api/v1/staff/holidaysApply/hrSysHolidaysApplyList";
      var myData = { hrCode: hrCode };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.isBalanceTxt = item.isBalance == 1?'是':'否';
            item.isWithpayTxt = item.isWithpay == 1?'是':'否';
            return item;
          });
          this.total = this.tableData.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前页数
    curChange(val) {
      this.curPage = val;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowDetails = false;
    },
    // 查看详情
    handleDetails(index, res){
      this.isShowDetails = true;
      this.curInfo = res;
      this.curInfo.hrCode = this.hrCode;
    }
  },
  computed: {
    queryTableDate() {
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return this.tableData.slice(begin, end);
    },
    pageTotal() {
      var pageTotal = Math.ceil(this.total / this.pageSize);
      return pageTotal;
    },
    staffInfo() {
      return this.$store.state.staffModule.staffInfo;
    }
  },
  components: {
    approvalHolidaysDetails
  }
};
</script>
<style scoped lang="scss">
.title-h5{font-size: 22px;font-weight: 500;}
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }
}

</style>






