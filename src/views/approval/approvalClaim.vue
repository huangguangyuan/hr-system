<template>
  <div class="approvalClaim wrap" v-if="isShow">
    <h5 class="title-h5">报销列表</h5>
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id" >
      <el-table-column sortable prop="nameChinese" label="申请人"></el-table-column>
      <el-table-column sortable prop="deptName" label="部门"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建日期"></el-table-column>
      <el-table-column sortable prop="isBalanceTxt" label="是否结算"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="结算金额"></el-table-column>
      <el-table-column prop="nextStepTip" label="下一步提示"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column sortable prop="approveOfficerNameArr" label="审批人员" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column sortable prop="balanceOfficerNameArr" label="结算人员" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column sortable prop="noticeOfficerNameArr" label="已抄送" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-info" @click="handleDetails(scope.$index, scope.row)" >查看{{approveTxt(scope.row)}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 申请表单详情 -->
    <el-dialog title="报销申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <approval-claim-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></approval-claim-details>
    </el-dialog>
  </div>
</template>
<script>
import approvalClaimDetails from "./approvalClaimDetails.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    approvalClaimDetails,pageInfo,busAndSearch
  },
  name: "approvalClaim",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList:[],
      curInfo: {},
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      BUCodeSelected: "", //单位code
      filter:{searchKey:'',searchField:['nameChinese','createTime','nextStepTip','totalAmount','deptName']},
      userInfo:{}
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/staff/claim/hrSysClaimList",
            data:{ hrCode: this.$toolFn.curUser.userCode,BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter};
    },
    tableData(){
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.isBalanceTxt = item.isBalance == 1?'已结算':'未结算';
        return item;
      });
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    this.approvalClaim = this.$toolFn.curUser.access.approvalClaim || [];
    if (this.approvalClaim.length > 0){
      this.isShow = true;
    }
  },
  methods: {
    approveTxt(item){//显示文字并判断是否有权限审批
      //item.canApprove = false;
      var str = "";
      if (item.status == 1){
        if (this.approvalClaim.indexOf(2) >= 0 && item.canApprove){//前后端判断是否有权限审批
          str = "并审批";
          //item.canApprove = true;
        }
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
  },
};
</script>
<style scoped lang="scss">
.title-h5{font-size: 22px;font-weight: 500;}
</style>






