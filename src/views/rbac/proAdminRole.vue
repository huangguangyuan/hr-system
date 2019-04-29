<template>
  <div class="wrap proAdminRole">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>后台管理角色列表</span>
      <el-button type="warning" size="small" @click="isShowAddRole=true;curInfo.type='admin'">添加角色</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input
        placeholder="请输入内容"
        v-model="searchInner"
        class="input-with-select"
        @blur="searchFun"
      >
        <el-select
          v-model="roleTypeValue"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="getRoleType"
        >
          <el-option label="后台管理员" value="1"></el-option>
          <el-option label="HR管理员" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchFun">搜 索</el-button>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click='editFun(scope.$index, scope.row)'>编辑</el-button>
          <el-button size="mini" icon="el-icon-plus">新增子角色</el-button>
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
    <!-- 添加角色 -->
    <el-dialog title="新增角色" :visible.sync="isShowAddRole" :close-on-click-modal="false">
      <add-role v-if="isShowAddRole" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></add-role>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="isShowModifyRole" :close-on-click-modal="false">
      <modify-role v-if='isShowModifyRole' v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></modify-role>
    </el-dialog>
  </div>
</template>
<script>
import addRole from "./addRole.vue";
import modifyRole from "./modifyRole.vue";
export default {
  name: "proAdminRole",
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前信息
      isShowAddRole: false, //是否显示新增角色浮层
      isShowModifyRole:false,//是否显示修改角色浮层
      roleTypeValue: "1", //角色类型
      searchInner: "" //搜索内容
    };
  },
  mounted() {
    var _this = this;
    _this.getData();
  },
  methods: {
    //获取项目数据列表
    getData() {
      var _this = this;
      var reqUrl = "/server/api/v1/projectRole/projectRolesWithAll";
      var myData = { typeId: parseInt(_this.roleTypeValue) };
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.tableData = res.data.data
            .map(item => {
              item.createTime = _this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
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
    // 获取角色类型
    getRoleType(val) {
      var _this = this;
      _this.roleTypeValue = val;
      _this.getData();
    },
    // 根据name字段查找数据
    searchFun() {
      var _this = this;
      if (_this.searchInner != "") {
        var reqUrl = "/server/api/v1/projectRole/getByOptions";
        var data = { name: _this.searchInner };
        _this.$http.post(reqUrl, data).then(res => {
          if (res.data.code == 0) {
            _this.tableData = res.data.data
              .map(item => {
                item.createTime = _this.$toolFn.timeFormat(item.createTime);
                item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
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
      }else{
        _this.getData();
      }
    },
    // 监听子组件发过来信息
    listenIsShowMask(res) {
      this.isShowAddRole = res;
      this.isShowModifyRole = res;
    },
    // 编辑信息
    editFun(index,res){
      var _this = this;
      _this.isShowModifyRole = true;
      _this.curInfo = res;
    },
    // 删除
    handleDelete(index, res) {}
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
    addRole,
    modifyRole
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
  margin: 20px auto;width: 100%;box-sizing: border-box;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>






