<template>
  <div class="wrap STitems">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>薪资应税项目</span>
      <el-button type="primary" size="small" @click="isShowAdd = true;curInfo.type='add'">添加项目</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入内容" v-model="searchInner" @blur="searchFun">
        <el-button slot="append" icon="el-icon-search" @click="searchFun">搜 索</el-button>
      </el-input>
    </div>

    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe style="width: 100%" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="taxableTxt" label="是否应税项目"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
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
    <!-- 添加公积金模板 -->
    <el-dialog title="添加公积金模板" :visible.sync="isShowAdd" :close-on-click-modal="false">
      <addHCtemplate v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo" v-if="isShowAdd"></addHCtemplate>
    </el-dialog>
    <!-- 加载等待页 -->
    <loading-page v-if="isShowLoading"></loading-page>
  </div>
</template>
<script>
import addHCtemplate from "./addHCtemplate.vue";
import loadingPage from "@/components/loadingPage.vue";
export default {
  name: "STitems",
  inject: ["reload"],
  data() {
    return {
      tableData: [], //列表数据
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      searchInner: "", //搜索关键字
      curInfo: {}, //传值给子组件
    };
  },
  mounted() {
    var _this = this;
    _this.getData();
  },
  methods: {
    //获取数据列表
    getData() {
      var _this = this;
      var reqUrl = "/server/api/v1/salaryItem/getAll";
      var myData = {
        cityCode: _this.cityCode
      };
      _this.isShowLoading = true;
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          console.log(res);
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              switch (item.taxable) {
                case 0:
                  item.taxableTxt = "否";
                  break;
                case 1:
                  item.taxableTxt = "是";
                  break;
                default:
                  item.taxableTxt = "未知";
              }
              item.createTime = _this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
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
          _this.total = _this.tableData.length;
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
    // 检测是否关闭表单
    listenIsShowMask(res) {
      var _this = this;
      _this.isShowAdd = res;
    },
    // 编辑
    handleEdit(index, res) {
      var _this = this;
      _this.curInfo = res;
      _this.curInfo.type = "modify";
      _this.isShowAdd = true;
    },
    // 删除
    handleDelete(index, res) {
      var _this = this;
      console.log(res.id);
      _this
        .$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .post("/server/api/v1/citySI/delete", { id: res.id })
            .then(res => {
              _this.reload();
              _this.$message('取消成功~');
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 搜索
    searchFun() {
      var _this = this;
      if (_this.searchInner) {
        var reqUrl = "/server/api/v1/salaryItem/getByOptions";
        var data = { name: _this.searchInner };
        _this.$http.post(reqUrl, data).then(res => {
          _this.tableData = res.data.data.map(item => {
            switch (item.taxable) {
                case 0:
                  item.taxableTxt = "否";
                  break;
                case 1:
                  item.taxableTxt = "是";
                  break;
                default:
                  item.taxableTxt = "未知";
              }
            item.createTime = _this.$toolFn.timeFormat(item.createTime);
            item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
            return item;
          });
          _this.total = _this.tableData.length;
        });
      } else {
        _this.getData();
      }
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
    loadingPage,
    addHCtemplate
  }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.search {
  margin: 20px auto;
}
</style>






