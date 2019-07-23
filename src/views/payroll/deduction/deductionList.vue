<template>
  <div class="deductionList">
    <el-page-header @back="goBack" :content="payrollInfo.nameChinese+'-专项扣除'"></el-page-header>
    <el-divider></el-divider>
    <!-- 头部内容 -->
    <div class="my-top">
      <el-button type="primary" @click="addFun">添 加</el-button>
      <el-button type="danger" @click="deleteAll">删除所有</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="amount" label="扣除金额"></el-table-column>
      <el-table-column prop="status" label="是否生效">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" active-text="是" inactive-text="否" @change="changStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="typeIdTxt" label="类 型"></el-table-column>
      <el-table-column prop="remarks" label="备 注"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button size="mini" icon="el-icon-edit" @click="modifyFun(scope.$index, scope.row)">编辑</el-button>
          <!-- 删除 -->
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

    <!-- 新增 -->
    <el-dialog
      title="新增专项扣除"
      :visible.sync="isShowEditLayer"
      :close-on-click-modal="false"
      width="55%"
    >
      <edit-layer
        v-on:listenIsShowMask="listenIsShowMask"
        :curInfo="curInfo"
        v-if="isShowEditLayer"
      ></edit-layer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
export default {
  name: "deductionList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      isShowLoading: false, //是否显示loading页
      isShowEditLayer: false //是否显示新增页面
    };
  },
  mounted() {
    this.getData();
    console.log(this.payrollInfo);
  },
  methods: {
    //获取项目数据列表
    getData() {
      var reqUrl = "/server/api/v1/staff/deduction/getAll";
      var myData = { staffCode: this.payrollInfo.code };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
              switch (item.typeId) {
                case 1:
                  item.typeIdTxt = "赡养老人";
                  break;
                case 2:
                  item.typeIdTxt = "子女教育";
                  break;
                case 3:
                  item.typeIdTxt = "房贷利息";
                  break;
                case 4:
                  item.typeIdTxt = "住房租金";
                  break;
                case 5:
                  item.typeIdTxt = "继续教育";
                  break;
                case 6:
                  item.typeIdTxt = "大病医疗";
                  break;
              }
              item.status = item.status.toString();
              return item;
            })
            .sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
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
    // 新增专项扣除
    addFun() {
      this.isShowEditLayer = true;
      this.curInfo = {
        staffCode: this.payrollInfo.code,
        type: "add"
      };
    },
    // 编辑
    modifyFun(index, res) {
      this.isShowEditLayer = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/server/api/v1/staff/deduction/delete", { id: res.id })
            .then(res => {
              this.reload();
              this.$message.success("删除成功~");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除所有
    deleteAll() {
      this.$confirm("是否确认删除所有数据？", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/server/api/v1/staff/deduction/deleteByStaffCode", {
              staffCode: this.payrollInfo.code
            })
            .then(res => {
              this.reload();
              this.$message.success("删除成功~");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 改变状态
    changStatus(res) {
      var reqUrl = "/server/api/v1/staff/deduction/update";
      var data = {
        id: res.id,
        staffCode: res.staffCode,
        status: res.status
      };
      this.$http.post(reqUrl, data).then(res => {});
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
    },
    // 返回
    goBack() {
      this.$store.commit({
        type: "getPayrollInfo",
        payrollKey: "payrollList"
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
    payrollInfo() {
      return this.$store.state.payrollModule.payrollInfo;
    }
  },
  components: {
    editLayer
  }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
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
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.deductionList {
  .photo {
    width: 35px;
    height: 35px;
    border-radius: 5px;
  }
}
</style>






