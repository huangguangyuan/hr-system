<template>
  <div class="approvalHolidays wrap" v-if="isShow">
    <h5 class="title-h5">请假列表</h5>
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column sortable prop="nameChinese" label="申请人" width="150">
        <template slot-scope="scope">
          <span :class="typeColor(scope.row.status)">{{scope.row.nameChinese}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="deptName" label="部门"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建日期" width="150"></el-table-column>
      <el-table-column sortable prop="typeIdTxt" label="假期类型" width="150"></el-table-column>
      <el-table-column sortable prop="startDate" label="开始时间" width="200"></el-table-column>
      <el-table-column sortable prop="endDate" label="结束时间" width="200"></el-table-column>
      <el-table-column sortable prop="totalDay" label="请假天数" width="120"></el-table-column>
      <!-- <el-table-column sortable prop="totalAmount" label="应扣金额"></el-table-column> -->
      <el-table-column sortable prop="isWithpayTxt" label="是否带薪" width="120"></el-table-column>
      <el-table-column sortable prop="isBalanceTxt" label="是否结算" width="120"></el-table-column>
      <el-table-column prop="nextStepTip" label="下一步提示" width="120"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态" width="120">
        <template slot-scope="scope">
          <span :class="typeColor(scope.row.status)">{{scope.row.statusTxt}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" sortable prop="approveOfficerNameArr" label="审批人员" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column width="300" sortable prop="balanceOfficerNameArr" label="结算人员" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column width="300" sortable prop="noticeOfficerNameArr" label="已抄送" v-if="userInfo.lev ==301"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-info"
            @click="handleDetails(scope.$index,scope.row)"
          >查看{{approveTxt(scope.row)}}</el-button>
          <el-button
            size="mini"
            icon="el-icon-info"
            @click="handleStaffHolidays(scope.$index,scope.row)"
          >员工假期记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 请假表单详情 -->
    <el-dialog title="请假申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <approval-holidays-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></approval-holidays-details>
    </el-dialog>
    <el-dialog title="假期记录" :visible.sync="isShowStaffHolidays" :close-on-click-modal="false">
      <staff-holiday-stat v-if="isShowStaffHolidays" :staffCode_props="staffCode_props" v-on:listenIsShowMask="listenIsShowMask"></staff-holiday-stat>
    </el-dialog>    
  </div>
</template>
<script>
import approvalHolidaysDetails from "./approvalHolidaysDetails.vue";
import staffHolidayStat from "../staffApply/staffHolidayStat/staffHolidayStat.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
let id = 0;
export default {
  components: {
    approvalHolidaysDetails,staffHolidayStat,pageInfo,busAndSearch
  },
  name: "approvalHolidays",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      holidayTypes:[],
      pageList:[],
      curInfo: {},
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      isShowStaffHolidays:false,
      BUCodeSelected: "", //单位code
      staffCode_props:'',
      filter:{searchKey:'',searchField:['nameChinese','createTime','nextStepTip']},
      userInfo:{}
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/staff/holidaysApply/hrSysHolidaysApplyList",
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
        item.isBalanceTxt = item.isBalance == 1?'是':'否';
        item.isWithpayTxt = item.isWithpay == 1?'是':'否';
        item.startDate = this.$toolFn.timeFormat(item.startDate,"yyyy-MM-dd hh:mm");
        item.endDate = this.$toolFn.timeFormat(item.endDate,"yyyy-MM-dd hh:mm");
        item.typeIdTxt = this.holidayTypes.find(child => {
          return child.typeId == item.typeId;
        }).val;
        return item;
      });
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init(){
      this.holidayTypes = await this.$myApi.getHolidaysTypeId();
      this.userInfo = this.$toolFn.curUser;
      this.approvalHolidays = this.$toolFn.curUser.access.approvalHolidays || [];
      if (this.approvalHolidays.length > 0){
        this.isShow = true;
      }
    },
    approveTxt(item){//显示文字并判断是否有权限审批
      //item.canApprove = false;
      var str = "";
      if (item.status == 1){
        if (this.approvalHolidays.indexOf(2) >= 0 && item.canApprove){//前后端判断是否有权限审批
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
    // 员工假期记录
    handleStaffHolidays(index, res){
      this.isShowStaffHolidays= true;
      this.staffCode_props = res.staffCode;
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
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }

}
  .tip1{
    color: red;
  }
  .tip2{
    color:sienna;
  }
  .tip3{
  }
</style>






