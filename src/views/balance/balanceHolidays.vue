<template>
  <div class="approvalHolidays wrap">
    <h5 class="title-h5">请假结算列表</h5>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
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
            @click="handleDetails(scope.$index, scope.row)"
          >结 算</el-button>
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
      <balance-holidays-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></balance-holidays-details>
    </el-dialog>
  </div>
</template>
<script>
import balanceHolidaysDetails from "./balanceHolidaysDetails.vue";
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
      hrCode: "baa7b350-96f4-11e9-9069-bf35c07c51d4"
    };
  },
  mounted() {
    this.getData(this.hrCode);
  },
  methods: {
    //获取数据列表
    getData(hrCode) {
      var reqUrl = "/server/api/v1/staff/holidaysApply/holidaysApplyListBalance";
      var myData = { hrCode: hrCode };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.isBalanceTxt = this.isBalance == 1?'是':'否';
            item.isWithpayTxt = this.isBalance == 1?'是':'否';
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
    balanceHolidaysDetails
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






