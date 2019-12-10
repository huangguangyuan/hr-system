<template>
  <div class="holidaysApplyList">
    <div>
      <el-radio-group v-model="holidayTypeSelected">
        <el-radio-button
          v-for="item in holidaysTypeList"
            :key="item.typeId"
            :label="item.typeId"
          @click.native.prevent="changeType(item.typeId)"
        >{{item.val}}</el-radio-button>
      </el-radio-group>
    </div>
<br />
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe show-summary sum-text="剩余合计">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="开始日期" v-if="props.row.startTime">
              <span>{{props.row.startTime}}</span>
            </el-form-item>
            <el-form-item label="结束日期"  v-if="props.row.endTime">
              <span>{{props.row.endTime}}</span>
            </el-form-item>
            <el-form-item label="是否带薪"  v-if="props.row.isWithpay && props.row.isWithpay == 1">
              <span>{{props.row.isWithpayTxt}}</span>
            </el-form-item>
            <el-form-item label="扣除金额"  v-if="props.row.totalAmount && props.row.totalAmount!=0">
              <span>{{props.row.totalAmount}}</span>
            </el-form-item>
            <el-form-item label="申请日期"  v-if="props.row.createTime">
              <span>{{props.row.createTime}}</span>
            </el-form-item>            
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="applyDate" label="日期"></el-table-column>
      <el-table-column prop="applyDay" label="天数"></el-table-column>
      <el-table-column prop="hisTypeIdTxt" label="类型"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <!-- <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-info"
            @click="handleDetails(scope.$index, scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column> -->
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
  </div>
</template>
<script>
let id = 0;
export default {
  name: "holidaysApplyList",
  inject: ["reload"],
  props: ["staffCode_props"],
  data() {
    return {
      holidayTypeSelected: 1,
      holidaysTypeList: [],
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      staffCode: this.staffCode_props,
      step:1
    };
  },
  mounted() {
    this.getHolidaysApplyTypeFun();
  },
  methods: {
    changeType(typeId){
      this.curPage = 1;
      this.holidayTypeSelected = typeId;
      this.getData(this.staffCode,typeId);
    },
    // 获取请假类型
    getHolidaysApplyTypeFun() {
      var reqUrl = "/server/api/v1/staff/holidaysApply/getHolidaysApplyTypeId";
      this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.holidaysTypeList = res.data.data;
          this.holidayTypeSelected = this.holidaysTypeList[0].typeId;
          //console.log(this.staffCode,this.holidayTypeSelected);
          this.getData(this.staffCode,this.holidayTypeSelected);

        }
      });
    },
    //获取数据列表
    getData(staffCode,typeId) {
      //var reqUrl = "/server/api/v1/staff/holidaysApply/staffCompleteHolidays";
      var reqUrl = "/server/api/v1/staff/holidaysApply/staffLeaves";
      var myData = { staffCode: staffCode,typeId: parseInt(typeId) };
      this.isShowLoading = true;
      this.$http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
            item.applyDate = this.$toolFn.timeFormat(item.applyDate,"yyyy-MM-dd");
            //item.isBalanceTxt = item.isBalance == 1?'是':'否';
            item.isWithpayTxt = item.isWithpay == 1?'是':'否';
            item.hisTypeIdTxt = item.hisTypeId == 2?'系统结算':'员工发起';
            item.createTime = item.createTime? this.$toolFn.timeFormat(item.createTime,"yyyy-MM-dd"):null
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
      this.isShowAddAccess = false;
      this.isShowDetails = false;
    },
    // 新增
    addFun() {
      this.isShowAddAccess = true;
      this.curInfo.staffCode = this.staffCode;
    },
    // 查看详情
    handleDetails(index, res){
      this.isShowDetails = true;
      this.curInfo = res;
    },
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
  }
};
</script>
<style scoped lang="scss">
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }
}
.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled){
box-shadow:0 0 0 0 #f28c38;
}
.table-expand{
    display: flex;flex-wrap: wrap;
    .el-form-item{
        width: 23%;box-sizing: border-box;border-bottom:1px #99a9bf solid;padding:0 10px;
        box-shadow: darkgrey 0px 2px 15px 1px;border-radius: 8px;
    }
}
</style>






