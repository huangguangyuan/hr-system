<template>
  <div class="warning">
    <div class="addBtn-wrap" v-if="userRight">
      <el-button type="primary" @click="addFun">添 加</el-button>
      <el-button type="danger" @click='handleDeleteAll'>删除所有</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id"  show-summary sum-text="剩余合计">
      <el-table-column sortable prop="applyDate" label="变动日期"></el-table-column>
      <el-table-column prop="applyDay" label="变动天数"></el-table-column>
      <el-table-column prop="remarks" label="内容"></el-table-column>
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
    <!-- 增加年假 -->
    <el-dialog title="编辑年假" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :userRight_props="userRight" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
import { setTimeout } from 'timers';
let id = 0;
export default {
  name: "warning",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      searchInner: "", //搜索内容
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowLoading: false, //是否显示loading页
      userRight:false,
      staffCode:"",
      userInfo:{}
    };
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.userInfo = this.$toolFn.localGet("userInfo");
    if (this.userInfo.roleTypeId != 1){
      this.staffCode = this.staffInfo.code;
    }else{
      this.staffCode = this.userInfo.staffCode;
    }
    this.getData(this.staffCode);
  },
  methods: {
    //获取数据列表
    getData(staffCode) {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/holidaysApply/staffLeaves";
      var myData = { staffCode: staffCode,typeId:2 };
      _this.isShowLoading = true;
      _this.$http.post(reqUrl, myData).then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data.map(item => {
          item.applyDate = _this.$toolFn.timeFormat(item.applyDate).slice(0, 10);
              // this.getHRadminName(item.issueBy).then(res => {
              //   item.hrName = res;
              // });
          return item;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前页数
    curChange(val) {
      var _this = this;
      _this.curPage = val;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
    },
    // 新增
    addFun() {
      this.isShowAddAccess = true;
      this.curInfo = {
        type: "add",
        staffCode: this.staffInfo.code,
        BUCode:this.staffInfo.BUCode,
        applyDay:this.userInfo.applyDay,
        applyDate:this.userInfo.applyDate,
        remarks:this.userInfo.remarks,
        
      };
    },
    // 编辑
    editFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.curInfo.BUCode = this.staffInfo.BUCode;
      this.curInfo.showText = false;
      this.curInfo.applyDate = this.userInfo.applyDate;
      if (this.userInfo.roleTypeId == 1){
        this.curInfo.showText = true;
      }
    },
    // 删除所有
    handleDeleteAll() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$http.post("/server/api/v1/staff/holidaysApply/staffLeaves/deleteByStaffCode", { staffCode:this.staffInfo.code,typeId:2 }).then(res => {
              if (res.data.code == 0){
                this.reload();
                this.$message.success("删除成功！");
              }else{
                this.$message.error("删除失败，请联系管理员。");
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
      var _this = this;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return _this.tableData.slice(begin, end);
    },
    pageTotal() {
      var _this = this;
      var pageTotal = Math.ceil(_this.total / _this.pageSize);
      return pageTotal;
    },
    staffInfo() {
      return this.$store.state.staffModule.staffInfo;
    }
  },
  components: {
    editLayer
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






