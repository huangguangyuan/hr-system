<template>
  <div class="approvalClaim wrap" v-if="isShow">
    <h5 class="title-h5">报销列表</h5>
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id" >
      <el-table-column sortable prop="nameChinese" label="申请人" width="200">
        <template slot-scope="scope">
          <span :class="typeColor(scope.row.status)">{{scope.row.nameChinese}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="deptName" label="部门" width="150"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建日期" width="150"></el-table-column>
      <el-table-column sortable prop="typeIdTxt" label="报销类型" width="150"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="结算金额"  width="120"></el-table-column>
      <el-table-column sortable prop="isBalanceTxt" label="是否结算" width="120"></el-table-column>
      <el-table-column prop="nextStepTip" label="下一步提示" width="150"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态" width="120">
        <template slot-scope="scope">
          <span :class="typeColor(scope.row.status)">{{scope.row.statusTxt}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column sortable prop="approveOfficerNameArr" width="200" label="审批人员" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column sortable prop="balanceOfficerNameArr" width="200" label="结算人员" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column sortable prop="noticeOfficerNameArr" width="200" label="已抄送" v-if="userInfo.lev ==301"></el-table-column> -->
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
      claimTypes:[],
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
        item.createTime = this.$toolFn.timeFormat(item.createTime,'yyyy-MM-dd hh:mm');
        item.isBalanceTxt = item.isBalance == 1?'已结算':'未结算';
        let claimType = this.claimTypes.find(child => {
          return child.id == item.typeId;
        })
        item.typeIdTxt = claimType ? claimType.name:"暂无";
        return item;
      });
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init(){
      this.userInfo = this.$toolFn.curUser;
      this.claimTypes = await this.$myApi.getBUClaimType();
      this.approvalClaim = this.$toolFn.curUser.access.approvalClaim || [];
      if (this.approvalClaim.length > 0){
        this.isShow = true;
      }
    },
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
    typeColor(typeId){//1新建，2已审批，11已结算
      if (typeId === 1){
        return "tip1"
      }else  if (typeId === 2){
        return "tip2"
      }
      return "tip3"
    }
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
  .tip1{
    color: red;
  }
  .tip2{
    color:sienna;
  }
  .tip3{
  }
</style>






