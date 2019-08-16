<template>
  <div class="claimList">
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit" @click="addFun">报销申请</el-button>
    </el-button-group>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
      <el-table-column prop="createTime" label="创建日期"></el-table-column>
      <el-table-column prop="statusTxt" label="状态"></el-table-column>
      <el-table-column prop="totalAmount" label="结算金额"></el-table-column>
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
          >撤销申请</el-button>
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
    <!-- 报销申请表单 -->
    <el-dialog title="报销申请表单" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
    <!-- 申请表单详情 -->
    <el-dialog title="报销申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <claim-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></claim-details>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
import claimDetails from "./claimDetails.vue";
let id = 0;
export default {
  name: "claimList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      staffCode: "7ef51e60-9e01-11e9-bde5-6d1157612d12"
    };
  },
  mounted() {
    this.getData(this.staffCode);
  },
  methods: {
    //获取数据列表
    getData(staffCode) {
      var reqUrl = "/server/api/v1/staff/claim/staffClaimList";
      var myData = { staffCode: staffCode };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.isBalanceTxt = item.isBalance == 1?'已结算':'未结算';
            return item;
          });
          this.total =  this.tableData.length;
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
    // 删除
    handleDelete(index, res) {
      this
        .$confirm("是否撤销该申请?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          //console.log({ claimCode: res.code,staffCode:res.staffCode });
          this.$http
            .post("/server/api/v1/staff/claim/recallApply", { claimCode: res.code,staffCode:res.staffCode })
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
    editLayer,claimDetails
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
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .el-input-group {
    width: 500px;
  }
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.addBtn-wrap {
  margin: 10px auto;
  display: flex;
  justify-content: flex-end;
}
</style>






