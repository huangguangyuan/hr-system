<template>
  <div class="wrap departmentList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>部门列表</span>
      <el-button type="warning" size="small" @click="isShowAddAccess = true;curInfo.type='add'">添加部门</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入部门名称" v-model="searchInner" @blur="searchFun">
        <el-select
          v-model="BUCode"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="selectFun"
        >
          <el-option v-for='(item,index) in regionBUList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchFun">搜 索</el-button>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="isStatus" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click='modifyFun(scope.$index, scope.row)'>编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="addChildAccessFun(scope.$index, scope.row)"
          >增加从属部门</el-button>
          <el-button
            size="mini"
            icon="el-icon-warning"
            @click="forbidden(scope.$index, scope.row)"
          >{{scope.row.status==1?'禁用':'启用'}}</el-button>
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
    <el-dialog title="添加部门" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editTemplate v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editTemplate>
    </el-dialog>
    <!-- 添加从属部门 -->
    <el-dialog title="添加从属部门" :visible.sync="isShowAddChild" :close-on-click-modal="false">
      <add-children v-if="isShowAddChild" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></add-children>
    </el-dialog>
  </div>
</template>
<script>
import editTemplate from "./editTemplate.vue";
import addChildren from "./addChildren.vue";
export default {
  name: "departmentList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      regionBUList:[],//单位列表
      BUCode: "18fa0a70-62c5-11e9-93a9-f78fd132055e", //单位code
      isShowAddAccess: false, //是否显示新增权限页面
      isShowAddChild: false, //是否显示新增子权限页面
      isShowLoading: false //是否显示loading页
    };
  },
  mounted() {
    var _this = this;
    _this.getRegionBUList();
  },
  methods: {
    //获取项目数据列表
    getData(BUCode) {
      var _this = this;
      var reqUrl = "/server/api/v1/buDepartment/getAllWithNodes";
      var myData = { BUCode: BUCode };
      _this.isShowLoading = true;
      _this.$http.post(reqUrl, myData).then(res => {
        _this.isShowLoading = false;
        _this.tableData = _this.mapFun(res.data.data).sort((a, b) => {
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
    // 获取单位列表
    getRegionBUList(){
      var _this = this;
      var reqUrl = '/server/api/v1/company/regionBUs';
      _this.$http.post(reqUrl,{}).then(res => {
        if(res.data.code == 0){
          _this.regionBUList = res.data.data;
          _this.BUCode = this.$toolFn.sessionGet('departmentBUCode')?this.$toolFn.sessionGet('departmentBUCode'):res.data.data[0].code;
          _this.getData(this.BUCode);
        }else{
          _this.$message({type:'info',message:`报错：${res.data.code}`})
        }
      })
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
    // 获取单位列表
    selectFun(val) {
      this.BUCode = val;
      this.getData(this.BUCode);
      this.$toolFn.sessionSet('departmentBUCode',val);
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
        _this.getData(this.BUCode);
      }
    },
    // 修改权限
    modifyFun(index, res) {
      var _this = this;
      _this.curInfo = res;
      _this.curInfo.type = 'modify';
      _this.isShowAddAccess = true;
    },
    // 添加子权限
    addChildAccessFun(index, res) {
      var _this = this;
      _this.isShowAddChild = true;
      _this.curInfo = res;
    },
    // 禁用
    forbidden(index, res) {
      var _this = this;
      var reqUrl = "/server/api/v1/buDepartment/update";
      var data = { id: res.id };
      var txt = "";
      if (res.status == 1) {
        data.status = 0;
        txt = "此操作将禁用, 是否继续?";
      } else {
        data.status = 1;
        txt = "此操作将启用, 是否继续?";
      }
      _this
        .$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http.post(reqUrl, data).then(res => {
            _this.reload();
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消操作~"
          });
        });
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
    editTemplate,addChildren
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
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>






