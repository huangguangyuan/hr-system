<template>
  <div class="education">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入学校名称" v-model="searchInner" @blur="searchFun">
        <el-button slot="append" icon="el-icon-search" @click="searchFun">搜 索</el-button>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="school" label="学校"></el-table-column>
      <el-table-column prop="degree" label="學歷及主修"></el-table-column>
      <el-table-column prop="startDate" label="入校时间"></el-table-column>
      <el-table-column prop="endDate" label="结业时间"></el-table-column>
      <el-table-column prop="details" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
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
    <!-- 添加部门 -->
    <!-- <el-dialog title="添加部门" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editTemplate v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editTemplate>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  name: "education",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      searchInner: "", //搜索内容
      BUCode: "18fa0a70-62c5-11e9-93a9-f78fd132055e", //单位code
      isShowAddAccess: false, //是否显示新增权限页面
      isShowLoading: false //是否显示loading页
    };
  },
  mounted() {
    var _this = this;
    _this.getData();
    console.log(this.curInfo);
  },
  methods: {
    //获取项目数据列表
    getData() {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/education/getAll";
      var myData = { staffCode: _this.curInfo.code };
      _this.isShowLoading = true;
      _this.$http.post(reqUrl, myData).then(res => {
        console.log(res);
        _this.isShowLoading = false;
        _this.tableData = res.data.data.map(item => {
            item.startDate = _this.$toolFn.timeFormat(item.startDate).slice(0,10);
            item.endDate = _this.$toolFn.timeFormat(item.endDate).slice(0,10);
            return item;
        });
        // _this.tableData = _this.mapFun(res.data.data).sort((a, b) => {
        //     if (a.id < b.id) {
        //       return 1;
        //     }
        //     if (a.id > b.id) {
        //       return -1;
        //     }
        //     return 0;
        //   });
        // _this.total = _this.tableData.length;
      })
      .catch(err => {
        console.log(err);
      });
    },
    // 循环数据列表获取属性
    mapFun(objArr) {
      var _this = this;
      return objArr.map(item => {
        item.createTime = _this.$toolFn.timeFormat(item.createTime);
        item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
        item.isStatus = item.status == 1 ? "启用" : "禁用";
        item.children = item.nodes;
        if (item.children != 0) {
          _this.mapFun(item.children);
        }
        return item;
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
    // 根据name字段查找数据
    searchFun() {
      var _this = this;
      if (_this.searchInner != "") {
        var reqUrl = "/server/api/v1/buDepartment/getByOptions";
        var data = { name: _this.searchInner };
        _this.$http.post(reqUrl, data).then(res => {
          if (res.data.code == 0) {
            _this.tableData = res.data.data
              .map(item => {
                item.createTime = _this.$toolFn.timeFormat(item.createTime);
                item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
                item.isStatus = item.status == 1 ? "启用" : "禁用";
                item.children = item.nodes;
                return item;
              }) //倒序
              .sort((a, b) => {
                if (a.id < b.id) {
                  return 1;
                }
                if (a.id > b.id) {
                  return -1;
                }
                return 0;
              });
            _this.total = _this.tableData.length;
          } else {
            console.log(res.data.code);
          }
        });
      } else {
        _this.getData();
      }
    },
    // 删除
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
            .post("/server/api/v1/buDepartment/delete", { id: res.id })
            .then(res => {
              _this.reload();
              _this.$message.success('删除成功！');
            });
        })
        .catch(() => {
          _this.$message({
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
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>






