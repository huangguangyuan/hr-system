<template>
  <div class="holidaysApplyList">
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit" @click="addFun">请假申请</el-button>
    </el-button-group>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column sortable prop="createTime" label="申请时间" width="200"></el-table-column>
      <el-table-column sortable prop="totalDay" label="请假天数"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="扣除金额"></el-table-column>
      <el-table-column prop="isWithpayTxt" label="是否带薪"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-info"
            @click="handleDetails(scope.$index, scope.row)"
          >查看详情</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="scope.row.status < 3"
          >撤销请假</el-button>
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
    <!-- 请假申请表单 -->
    <el-dialog title="请假申请表单" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
    <!-- 请假表单详情 -->
    <el-dialog title="请假申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <holidays-apply-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></holidays-apply-details>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
import holidaysApplyDetails from "./holidaysApplyDetails.vue";
let id = 0;
export default {
  name: "holidaysApplyList",
  inject: ["reload"],
  props: ["staffCode_props"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      pageType:2,//分页类型，1为前端分页，2为后端分页
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      staffCode: this.staffCode_props,
      step:1
    };
  },
  mounted() {
    this.getData(this.staffCode);
  },
  methods: {
    //获取数据列表
    getData(staffCode) {
      var reqUrl = "/server/api/v1/staff/holidaysApply/staffHolidaysApplyList";
      var myData = { staffCode: staffCode };
      if (this.pageType == 2){
        myData.pageNo = this.curPage;
        myData.pageSize = this.pageSize;
      }
      this.isShowLoading = true;
      this.$http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.list.map(item => {
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.isBalanceTxt = item.isBalance == 1?'是':'否';
            item.isWithpayTxt = item.isWithpay == 1?'是':'否';
            return item;
          });
          this.total =  this.tableData.length;
          if (this.pageType == 2){
            this.total =  res.data.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前页数
    curChange(val) {
      this.curPage = val;
      if (this.pageType == 2){
        this.getData(this.staffCode);
      }
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
    // 删除
    handleDelete(index, res) {
      this
        .$confirm("是否撤销该请假申请?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$http
            .post("/server/api/v1/staff/holidaysApply/recallApply", { holidaysApplyCode: res.code,staffCode:res.staffCode })
            .then(res => {
              if(res.data.code == 0){
                this.reload();
                this.$message.success("撤销成功！");
              }else{
                this.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  computed: {
    queryTableDate() {
      if (this.pageType == 2){
        return this.tableData;
      }else{
        var begin = (this.curPage - 1) * this.pageSize;
        var end = this.curPage * this.pageSize;
        return this.tableData.slice(begin, end);
      }
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
    editLayer,holidaysApplyDetails
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

</style>






