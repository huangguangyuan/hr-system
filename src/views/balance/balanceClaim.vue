<template>
  <div class="settlementClaim wrap" v-if="isShow">
    <h5 class="title-h5">结算列表</h5>
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column sortable prop="nameChinese" label="申请人" width="200"></el-table-column>
      <el-table-column sortable prop="deptName" label="部门" width="150"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建日期" width="200">
        <template slot-scope="scope">
          <div class="showTip"  v-show="scope.row.showTip" >
            <i class="el-icon-alarm-clock"></i><span style="padding-left:10px">{{ scope.row.createTime }}</span>
          </div>
          <span v-show="!scope.row.showTip">{{ scope.row.createTime }}</span>
      </template>
      </el-table-column>
      <el-table-column sortable prop="typeTxt" label="报销类型" width="150"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="结算金额"  width="200"></el-table-column>
      <el-table-column sortable prop="isBalanceTxt" label="是否结算" width="200"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="结算金额"></el-table-column>
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
    <!-- 申请表单详情 -->
    <el-dialog title="报销申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <balance-claim-details
        v-if="isShowDetails"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></balance-claim-details>
    </el-dialog>
  </div>
</template>
<script>
import balanceClaimDetails from "./balanceClaimDetails.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
import {approveHisTypeTxt} from "@/lib/staticData.js";
export default {
  components: {
    balanceClaimDetails,pageInfo,busAndSearch
  },
  name: "settlementClaim",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      claimTypes:[],
      pageList:[],
      curInfo: {},
      isShowDetails: false, //是否显示表单详情
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
            url:"/server/api/v1/staff/claim/claimListBalance",
            data:{ hrCode: this.$toolFn.curUser.userCode,BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter};
    },
    tableData(){
      const timestamp = Date.parse(new Date());
      return this.pageList.map(item => {
        item.showTip = timestamp - Date.parse(new Date(item.createTime)) >= 2592000000
        item.createTime = this.$toolFn.timeFormat(item.createTime,'yyyy-MM-dd hh:mm');
        item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
        item.typeIdTxt = this.claimTypes.find(child => {
          return child.id == item.typeId;
        }).name;
        return item;
      });
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init(){
      if (this.$toolFn.curUser.access.approvalClaim.length > 0){
        this.isShow = true;
      }
    },
    approveTxt(item){//显示文字并判断是否有权限结算
      item.canBalance = false;
      var str = "";
      if (this.$toolFn.curUser.access.approvalClaim.indexOf(3) >= 0){
        str = "并结算";
        item.canBalance = true;
      }
      return str;
    },
    // 查看详情
    handleDetails(index, res) {
      this.isShowDetails = true;
      this.curInfo = res;
      this.curInfo.hrCode = this.$toolFn.curUser.userCode;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowDetails = false;
    },
  },
  watch: {
    BUCodeSelected: {
      handler: async function(newVal) {
        this.pageInfo.reqParams.isReq = true;
        this.claimTypes = await this.$myApi.getBUClaimType({isCache:false,BUCode:newVal});
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
.title-h5 {
  font-size: 22px;
  font-weight: 500;
}
.showTip{
  color: #ff0000;
}
</style>






