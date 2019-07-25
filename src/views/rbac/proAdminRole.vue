<template>
  <div class="wrap proAdminRole">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>后台管理角色列表</span>
      <el-button type="warning" size="small" @click="isShowAddRole=true;curInfo.type='admin'">添加角色</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <div class="selectItem">
        <p>管理员类型：</p>
        <el-select
          v-model="roleTypeValue"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="getRoleType"
        >
          <el-option label="后台管理员" value="1"></el-option>
          <el-option label="HR管理员" value="2"></el-option>
          <el-option label="员工" value="3"></el-option>
        </el-select>
      </div>
      <div class="selectItem">
        <p>所属项目：</p>
        <el-select
          v-model="projectCode"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="selectPro"
        >
          <el-option
            v-for="item in projectList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <el-input
        placeholder="请输入内容"
        v-model="searchInner"
        class="input-with-select"
        @blur="searchFun"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchFun">搜 索</el-button>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="roleCode" label="角色代号"></el-table-column>
      <el-table-column prop="isStatus" label="状态"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="editFun(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="addChildRoleFun(scope.$index, scope.row)"
          >增加从属角色</el-button>
          <el-button
            size="mini"
            icon="el-icon-s-tools"
            @click="assignPermissionsFun(scope.$index, scope.row)"
          >分配权限</el-button>
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
    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="isShowAddRole" :close-on-click-modal="false">
      <add-role v-if="isShowAddRole" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></add-role>
    </el-dialog>
    <!-- 添加从属角色 -->
    <el-dialog title="添加从属角色" :visible.sync="isShowAddChildRole" :close-on-click-modal="false">
      <add-child-role
        v-if="isShowAddChildRole"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></add-child-role>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="isShowModifyRole" :close-on-click-modal="false">
      <modify-role
        v-if="isShowModifyRole"
        v-on:listenIsShowMask="listenIsShowMask"
        :curInfo="curInfo"
      ></modify-role>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="isShowAssignPermissions" :close-on-click-modal="false">
      <assign-permissions
        v-if="isShowAssignPermissions"
        v-on:listenIsShowMask="listenIsShowMask"
        :curInfo="curInfo"
      ></assign-permissions>
    </el-dialog>
  </div>
</template>
<script>
import addRole from "./addRole.vue";
import addChildRole from "./addChildRole.vue";
import modifyRole from "./modifyRole.vue";
import assignPermissions from "./assignPermissions.vue";
export default {
  name: "proAdminRole",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前信息
      isShowAddRole: false, //是否显示新增角色浮层
      isShowAddChildRole: false, //是否显示新增角色浮层
      isShowModifyRole: false, //是否显示修改角色浮层
      isShowAssignPermissions: false, //是否显示分配权限浮层
      isShowLoading: false, //是否显示loading页
      roleTypeValue: "1", //角色类型
      searchInner: "", //搜索内容
      projectList: [], //项目列表
      projectCode: "" //项目code
    };
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    // 获取项目列表
    getProjectList() {
      var reqUrl = "/server/api/v1/project/getAll";
      this.$http.post(reqUrl, {}).then(res => {
        if (res.data.data) {
          this.projectList = res.data.data;
          this.projectCode = res.data.data[0].code;
          if(this.$toolFn.sessionGet('proAdminRoleInitialize')){
            this.projectCode = this.$toolFn.sessionGet('proAdminRoleInitialize').projectCode;
            this.roleTypeValue = this.$toolFn.sessionGet('proAdminRoleInitialize').roleTypeValue; 
          }
          this.getData(this.projectCode);
        }
      });
    },
    // 选择项目
    selectPro(val) {
      this.$toolFn.sessionSet('proAdminRoleInitialize',{roleTypeValue:this.roleTypeValue,projectCode:val});
      this.getData(val);
    },
    //获取数据列表
    getData(proCode) {
      var _this = this;
      var reqUrl = "/server/api/v1/projectRole/projectRolesWithAll";
      var myData = { typeId: parseInt(_this.roleTypeValue) };
      _this.isShowLoading = true;
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.isShowLoading = false;
          _this.tableData = _this
            .mapFun(res.data.data, proCode)
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
    // 循环数据列表获取属性
    mapFun(objArr, proCode) {
      var _this = this;
      return objArr
        .map(item => {
          item.createTime = _this.$toolFn.timeFormat(item.createTime);
          item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
          item.isStatus = item.status == 1 ? "启用" : "禁用";
          item.children = item.nodes;
          if (item.children != 0) {
            _this.mapFun(item.children);
          }
          return item;
        })
        .filter(item => {
          return item.projectCode == proCode;
        });
    },
    // 获取当前页数
    curChange(val) {
      var _this = this;
      _this.curPage = val;
    },
    // 获取角色类型
    getRoleType(val) {
      this.roleTypeValue = val;
      this.getData(this.projectCode);
      this.$toolFn.sessionSet('proAdminRoleInitialize',{roleTypeValue:this.roleTypeValue,projectCode:this.projectCode});
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
      } else {
        this.getData(this.projectCode);
      }
    },
    // 监听子组件发过来信息
    listenIsShowMask(res) {
      this.isShowAddRole = res;
      this.isShowModifyRole = res;
      this.isShowAddChildRole = res;
      this.isShowAssignPermissions = res;
    },
    // 编辑信息
    editFun(index, res) {
      var _this = this;
      _this.isShowModifyRole = true;
      _this.curInfo = res;
    },
    // 添加从属角色
    addChildRoleFun(index, res) {
      var _this = this;
      _this.isShowAddChildRole = true;
      _this.curInfo = res;
    },
    // 分配权限
    assignPermissionsFun(index, res) {
      var _this = this;
      _this.isShowAssignPermissions = true;
      _this.curInfo = res;
    },
    // 禁用
    forbidden(index, res) {
      var _this = this;
      var reqUrl = "/server/api/v1/projectRole/update";
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
            .post("/server/api/v1/projectRole/delete", { id: res.id })
            .then(res => {
              _this.$message({ message: "删除成功！" });
              _this.reload();
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
    addRole,
    modifyRole,
    addChildRole,
    assignPermissions
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
  display: flex;
  justify-content: space-between;
  .selectItem {
    display: flex;
    min-width: 300px;
    align-items: center;
    font-size: 14px;
    color: rgb(237, 137, 55);
  }
}
.el-input-group{
  min-width: 400px;
}
.el-select {
  margin-right: 10px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>






