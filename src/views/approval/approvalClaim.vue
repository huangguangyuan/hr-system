<template>
  <div class="approvalClaim wrap" v-if="isShow">
    <h5 class="title-h5">报销列表</h5>
        <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入关键字" v-model="filter.searchKey" >
        <el-select
          v-model="BUCode"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="selectFun"
        >
          <el-option v-for='(item,index) in regionBUList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-input>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column sortable prop="nameChinese" label="申请人"></el-table-column>
      <el-table-column sortable prop="deptName" label="部门"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建日期"></el-table-column>
      <el-table-column sortable prop="isBalanceTxt" label="是否结算"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="结算金额"></el-table-column>
      <el-table-column prop="nextStepTip" label="下一步提示"></el-table-column>
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
    <!-- 申请表单详情 -->
    <el-dialog title="报销申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <approval-claim-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></approval-claim-details>
    </el-dialog>
  </div>
</template>
<script>
import approvalClaimDetails from "./approvalClaimDetails.vue";
let id = 0;
export default {
  name: "approvalClaim",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {},
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      hrCode: "",
      userInfo:{},
      BUCode: "", //单位code
      claimAccess:[],
      rightStatus:[], //当前管理员可审批的申请类型
      regionBUList:[],//单位列表
      filter:{searchKey:'',searchField:['nameChinese','createTime','nextStepTip']}
    };
  },
  mounted() {
    var _this = this;
     _this.getRegionBUList();
    _this.userInfo = _this.$toolFn.localGet("userInfo");
    _this.hrCode = _this.userInfo.userCode;
    this.approvalClaim = _this.userInfo.access.approvalClaim || [];
    if (_this.userInfo.roleTypeId == 2 ){//hr系统管理员
      if (_this.userInfo.lev == 301){
        _this.rightStatus = [1,2,3];//查看，审批，结算权限
      }else{
        _this.rightStatus = this.approvalClaim;
      }
    }
    if (this.rightStatus.length > 0){
      this.isShow = true;
    }
  },
  methods: {
    approveTxt(item){//显示文字并判断是否有权限审批
      item.canApprove = false;
      var str = "";
      if (item.status == 1){
        if (this.rightStatus.indexOf(2) >= 0){
          str = "并审批";
          item.canApprove = true;
        }
      }
      return str;
    },
    //获取数据列表
    getData(hrCode,BUCode) {
      var reqUrl = "/server/api/v1/staff/claim/hrSysClaimList";
      var myData = { hrCode: hrCode,BUCode:BUCode };
      this.isShowLoading = true;
      this.$http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.isBalanceTxt = item.isBalance == 1?'已结算':'未结算';
            item.nameChinese = item.staff ? item.staff.nameChinese :"";
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
    },
    selectFun(val) {
      this.BUCode = val;
      this.getData(this.hrCode,this.BUCode);
      this.$toolFn.sessionSet('approveBUCode',val);
    },
    // 获取单位列表
    async getRegionBUList(){
      var _this = this;
      var regionBUs = await _this.$myApi.regionBUs(_this,{isCache:true});
      if (regionBUs && regionBUs.length > 0) {
        _this.regionBUList = regionBUs;
        _this.BUCode = this.$toolFn.sessionGet('approveBUCode')?this.$toolFn.sessionGet('approveBUCode'):_this.regionBUList[0].code;
        this.getData(this.hrCode,this.BUCode);
      }
    },
    searchFun(list,search){
      let newList = [];
      for(let i = 0;i < list.length;i++){
        for(let key in list[i]) {
          if (search.searchField.indexOf(key) >= 0){
            if (list[i][key] != undefined && list[i][key] != '' && list[i][key].toString().includes(search.searchKey)){
              newList.push(list[i]);
              break;
            }
          }
        };
      }
      return newList;
    },
  },
  computed: {
    queryTableDate() {
      var _this = this;
      let tableData = _this.tableData;
      if (_this.filter.searchKey != ""){
        tableData = _this.searchFun(tableData,_this.filter);
      }
      _this.total = tableData.length;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return tableData.slice(begin, end);
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
    approvalClaimDetails
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
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .el-input-group {
  }
}

</style>






