<template>
  <div class="wrap cityList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>主要城市列表</span>
      <el-button type="primary" size="small" @click="isShowAddCity = true;curInfo.type='add'">添加城市</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入关键字" v-model="filter.searchKey"></el-input>
    </div>

    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="queryTableDate" stripe style="width: 100%" border>
      <el-table-column sortable prop="name" label="城市名称"></el-table-column>
      <el-table-column sortable prop="remarks" label="备注"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间"></el-table-column>
      <el-table-column sortable prop="modifyTime" label="修改时间"></el-table-column>
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
    <!-- 新增项目 -->
    <el-dialog title="新增项目" :visible.sync="isShowAddCity" :close-on-click-modal="false">
      <add-city v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo" v-if="isShowAddCity"></add-city>
    </el-dialog>
  </div>
</template>
<script>
import addCity from "./addCity.vue";
export default {
  name: "cityList",
  inject: ["reload"],
  data() {
    return {
      tableData: [], //列表数据
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowAddCity: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      searchInner: "", //搜索关键字
      curInfo: {}, //传值给子组件
      filter:{searchKey:'',searchField:['name','roleCode']}
    };
  },
  mounted() {
    
    this.getData();
  },
  methods: {
    //获取城市数据列表
    getData() {
      
      var reqUrl = "/server/api/v1/city/getAll";
      var myData = {};
      this.isShowLoading = true;
      this.$myApi.http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
              item.createTime = this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
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
    // 检测是否关闭表单
    listenIsShowMask(res) {
      
      this.isShowAddCity = res;
    },
    // 编辑
    handleEdit(index, res) {
      
      this.curInfo = res;
      this.curInfo.type='modify';
      this.isShowAddCity = true;
    },
    // 删除
    handleDelete(index, res) {
      
      this
        .$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$myApi.http
            .post("/server/api/v1/city/delete", { id: res.id })
            .then(res => {
              this.reload();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  },
  computed: {
    queryTableDate() {
      
      let tableData = this.tableData;
      if (this.filter.searchKey != ""){
        tableData = this.$toolFn.searchFun(tableData,this.filter);
      }
      this.total = tableData.length;
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return tableData.slice(begin, end);
    },
    pageTotal() {
      
      var pageTotal = Math.ceil(this.total / this.pageSize);
      return pageTotal;
    }
  },
  components: {
    addCity
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
.search {
  margin: 20px auto;
}
</style>






