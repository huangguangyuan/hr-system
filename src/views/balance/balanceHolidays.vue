<template>
  <div class="approvalHolidays wrap">
    <h5 class="title-h5">请假结算列表</h5>
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column sortable prop="nameChinese" label="申请人"></el-table-column>
      <el-table-column sortable prop="deptName" label="部门"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建日期" width="200">
        <template slot-scope="scope">
          <div class="showTip"  v-show="scope.row.showTip" >
            <i class="el-icon-alarm-clock"></i><span style="padding-left:10px">{{ scope.row.createTime }}</span>
          </div>
          <span v-show="!scope.row.showTip">{{ scope.row.createTime }}</span>
      </template>
      </el-table-column>
      <el-table-column sortable prop="isBalanceTxt" label="是否结算"></el-table-column>
      <el-table-column sortable prop="totalDay" label="请假天数"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="应扣金额"></el-table-column>
      <el-table-column sortable prop="isWithpayTxt" label="是否带薪"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-info"
            @click="handleDetails(scope.$index, scope.row)"
          >查看{{approveTxt(scope.row)}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 请假表单详情 -->
    <el-dialog title="请假申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <balance-holidays-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></balance-holidays-details>
    </el-dialog>
  </div>
</template>
<script>
import balanceHolidaysDetails from "./balanceHolidaysDetails.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    balanceHolidaysDetails,pageInfo,busAndSearch
  },
  name: "approvalHolidays",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList:[],
      curInfo: {},
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      BUCodeSelected: "", //单位code
      filter:{searchKey:'',searchField:['nameChinese']}
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/staff/holidaysApply/holidaysApplyListBalance",
            data:{ hrCode: this.$toolFn.curUser.userCode,BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter};
    },
    tableData(){
      const monthNow = new Date().getMonth();
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime,'yyyy-MM-dd hh:mm');
        item.isBalanceTxt = item.isBalance == 1?'是':'否';
        item.isWithpayTxt = item.isWithpay == 1?'是':'否';
        item.showTip = monthNow - new Date(item.createTime).getMonth() >= 1 ? true : false
        return item;
      });
    }
  },
  mounted() {
    if (this.$toolFn.curUser.access.approvalClaim.length > 0){
      this.isShow = true;
    }
  },
  methods: {
    approveTxt(item){//显示文字并判断是否有权限结算
      item.canBalance = false;
      var str = "";
      if (this.$toolFn.curUser.access.approvalHolidays.indexOf(3) >= 0){
        str = "并结算";
        item.canBalance = true;
      }
      return str;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowDetails = false;
    },
    // 查看详情
    handleDetails(index, res){
      this.isShowDetails = true;
      this.curInfo = res;
      this.curInfo.hrCode = this.$toolFn.curUser.userCode;
    },
  },
  watch: {
    BUCodeSelected: {
      handler: function(newVal) {
        this.pageInfo.reqParams.isReq = true;
        this.$refs.pageInfo.getData(this.pageInfo);
      }
    },
    "filter.searchKey":{
      handler: function(newVal) {
        this.$refs.pageInfo.searchKey(this.busAndSearch.filter);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.title-h5{font-size: 22px;font-weight: 500;}
.showTip{
  color: #ff0000;
}
</style>






