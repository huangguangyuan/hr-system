<template>
  <div class="experience">
    <div class="addBtn-wrap" v-if="userRight">
      <el-button type="primary" @click="addFun">添 加</el-button>
      <el-button type="danger" @click='handleDeleteAll'>删除所有</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="companyName" label="公司名称"></el-table-column>
      <el-table-column prop="position" label="职位"></el-table-column>
      <el-table-column prop="jobNature" label="工作性质"></el-table-column>
      <el-table-column prop="startDate" label="入职时间"></el-table-column>
      <el-table-column prop="endDate" label="离职时间"></el-table-column>
      <el-table-column prop="details" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="editFun(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
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
    <!-- 添加学历 -->
    <el-dialog title="添加学历" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
let id = 0;
export default {
  name: "experience",
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
      userRight:false
    };
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.getData(this.staffInfo.code);
  },
  methods: {
    //获取数据列表
    getData(staffCode) {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/working/getAll";
      var myData = { staffCode: staffCode };
      _this.isShowLoading = true;
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data.map(item => {
            item.startDate = _this.$toolFn
              .timeFormat(item.startDate)
              .slice(0, 10);
            item.endDate = _this.$toolFn.timeFormat(item.endDate).slice(0, 10);
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
        staffCode: this.staffInfo.code
      };
    },
    // 编辑
    editFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除单个
    handleDelete(index, res) {
      var _this = this;
      _this
        .$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .post("/server/api/v1/staff/working/delete", { id: res.id })
            .then(res => {
              _this.reload();
              _this.$message.success("删除成功！");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除所有
    handleDeleteAll() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$http
            .post("/server/api/v1/staff/working/deleteByStaffCode", { staffCode:this.staffInfo.code })
            .then(res => {
              this.reload();
              this.$message.success("删除成功！");
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






