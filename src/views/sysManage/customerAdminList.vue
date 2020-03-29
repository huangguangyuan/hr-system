<template>
  <div class="wrap customerAdminList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>客户管理员列表</span>
    </div>
    <!-- 搜索 -->
    <!-- <div class="search">
      <el-input placeholder="请输入搜索关键字" v-model="searchInner" @blur="searchFn">
        <el-select v-model="companyCode" slot="prepend" placeholder="请选择公司" @change="changeCompanyCode" style="width:200px;">
          <el-option v-for='(item,index) in companyList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchFn">搜 索</el-button>
      </el-input>
    </div> -->
    <div class="search" >
      <el-input placeholder="请输入关键字" v-model="filter.searchKey">
      <el-select v-model="companyCode" slot="prepend" placeholder="请选择公司" @change="changeCompanyCode" style="width:200px;">
          <el-option v-for='(item,index) in companyList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table
      v-loading="isShowLoading"
      :data="queryTableDate"
      stripe
      row-key="id"
      border
    >
      <el-table-column sortable prop="name" label="名称"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column sortable prop="levTxt" label="类型"></el-table-column>
      <el-table-column sortable prop="isStatus" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="editFn(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit-outline"
            @click="modifyPassWord(scope.$index, scope.row)"
          >修改密码</el-button>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="addAccount(scope.$index, scope.row)"
            v-if='!scope.row.superCode'
          >添加子账号</el-button>
          <!-- <el-button size="mini" icon="el-icon-plus" @click="addRole(scope.$index, scope.row)">添加角色</el-button> -->
          <el-button
            size="mini"
            icon="el-icon-warning"
            @click="forbidden(scope.$index, scope.row)"
            v-if='!scope.row.superCode'
          >{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            v-if='scope.row.superCode'
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
    <!-- 新增管理员 -->
    <el-dialog
      title="新增管理员"
      :visible.sync="isShowAddAdmin"
      :close-on-click-modal="false"
      width="65%"
    >
      <add-admin
        v-if="isShowAddAdmin"
        v-on:listenIsShowAddAdmin="IsShowAddAdminFn"
        :modifyInfo="modifyInfo"
      ></add-admin>
    </el-dialog>
    <!-- 修改管理员 -->
    <el-dialog
      title="修改信息"
      :visible.sync="isShowModifyAdmin"
      :close-on-click-modal="false"
      width="65%"
    >
      <modify-admin
        v-if="isShowModifyAdmin"
        v-on:listenIsShowAddAdmin="IsShowAddAdminFn"
        :modifyInfo="modifyInfo"
        :userInfo_prop="userInfo"
      ></modify-admin>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="isShowModifyPassword"
      :close-on-click-modal="false"
      width="65%"
    >
      <modify-password
        v-if="isShowModifyPassword"
        v-on:listenIsShowAddAdmin="IsShowAddAdminFn"
        :modifyInfo="modifyInfo"
      ></modify-password>
    </el-dialog>
    <!-- 增加角色 -->
    <el-dialog title="添加角色" :visible.sync="isShowAddRole" :close-on-click-modal="false" width="40%">
      <add-role
        v-if="isShowAddRole"
        v-on:listenIsShowAddAdmin="IsShowAddAdminFn"
        :modifyInfo="modifyInfo"
      ></add-role>
    </el-dialog>
  </div>
</template>
<script>
import addAdmin from "./addAdmin.vue";
import modifyAdmin from "./modifyAdmin.vue";
import modifyPassword from "./modifyPassword.vue";
import addRole from "./addRole.vue";
export default {
  name: "customerAdminList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      searchInner: "", //搜索内容
      isShowAddAdmin: false, //是否显示新增后台管理员
      isShowModifyAdmin: false, //是否显示修改后台管理员
      isShowModifyPassword: false, //是否显示修改密码
      isShowAddRole: false, //是否显示增加角色
      isShowLoading: false, //是否显示loading页
      modifyInfo: {}, //当前列表信息
      companyCode:"",
      companyList:[],
      userInfo:{},
      userRight:true,
      filter:{searchKey:'',searchField:['name','roleTypeTxt','account','mobile','email']}
    };
  },
  mounted() {
    var _this = this;
    this.userInfo = this.$toolFn.localGet("userInfo");
    _this.getCompanyCodeFun();
    //_this.getData({companyCode:companyCode});
  },
  methods: {
    // 获取单位列表
    async getCompanyCodeFun(){
      var _this = this;
      var companys = await _this.$myApi.companys({isCache:true});
      if (companys) {
          _this.companyList = companys;
          _this.companyCode = this.$toolFn.sessionGet('hrCompanyCode')?this.$toolFn.sessionGet('hrCompanyCode'):_this.companyList[0].code;
          _this.getData({companyCode:_this.companyCode});
        }
    },
    // 选择单位
    changeCompanyCode(code){
      this.companyCode = code;
      this.getData({companyCode:this.companyCode});
      this.$toolFn.sessionSet('hrCompanyCode',code);
    },
    //获取项目数据列表
    getData(params) {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/client/getAll";
      var myData = {};
      if (params && params.companyCode != ""){
        myData.companyCode = params.companyCode
      }
      _this.isShowLoading = true;
      _this.$myApi.http.post(reqUrl, myData).then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data.map(item => {
              item.isStatus = item.status == 1 ? "启用" : "禁用";
              item.mobile =  item.companyTel || ""  + item.companyRegionTel || "" + item.BUTel || "";
              item.email = item.companyEmail || "" + item.companyRegionEmail || "" + item.BUEmail || "";
              item.mobile = _this.$toolFn.isNotOrEmpty(item.mobile)?"":item.mobile;
              item.email = _this.$toolFn.isNotOrEmpty(item.email)?"":item.email;
              item.children = item.childrenList.map(childItem => {
                childItem.isStatus = item.status == 1 ? "启用" : "禁用";
                return childItem;
              });
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
    // 接受子组件接受的值
    IsShowAddAdminFn(res) {
      this.isShowAddAdmin = res;
      this.isShowModifyAdmin = res;
      this.isShowModifyPassword = res;
      this.isShowAddRole = res;
    },
    // 搜索
    searchFn() {
      var _this = this;
      if (_this.searchInner == "") {
        _this.getData();
      } else {
        var reqUrl = "/server/api/v1/admin/getByOptions";
        var data = { name: _this.searchInner };
        _this.$myApi.http.post(reqUrl, data).then(res => {
          _this.tableData = res.data.data.map(item => {
            item.createTime = _this.$toolFn.timeFormat(item.createTime);
            item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
            item.isStatus = item.status == 1 ? "启用" : "禁用";
            item.children = item.nodes;
            return item;
          });
          _this.total = _this.tableData.length;
        });
      }
    },
    // 编辑
    editFn(index, res) {
      var _this = this;
      _this.isShowModifyAdmin = true;
      _this.modifyInfo = res;
      _this.modifyInfo.adminType = "customerAdmin";
    },
    // 修改密码
    modifyPassWord(index, res) {
      var _this = this;
      _this.isShowModifyPassword = true;
      _this.modifyInfo = res;
      _this.modifyInfo.adminType = "admin";
    },
    // 添加子权限
    addAccount(index, res) {
      var _this = this;
      _this.isShowAddAdmin = true;
      _this.modifyInfo = res;
      _this.modifyInfo.adminType = "customerAdmin";
    },
    // 添加角色
    addRole(index, res) {
      var _this = this;
      _this.isShowAddRole = true;
      _this.modifyInfo = res;
      _this.modifyInfo.adminType = "admin";
    },
    // 禁用
    forbidden(index, res) {
      var _this = this;
      var reqUrl = "/server/api/v1/admin/update";
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
          _this.$myApi.http.post(reqUrl, data).then(res => {
            if (res.data.code == 0) {
            _this.reload();
            }
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
          _this.$myApi.http
            .post("/server/api/v1/admin/delete", { id: res.id })
            .then(res => {
              _this.reload();
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  },
  computed: {
    queryTableDate() {
      var _this = this;
      let tableData = _this.tableData;
      if (_this.filter.searchKey != ""){
        tableData = _this.$toolFn.searchFun(tableData,_this.filter);
      }
      _this.total = tableData.length;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return tableData.slice(begin, end);
    },
    pageTotal() {
      var _this = this;
      var pageTotal = Math.ceil(_this.total / _this.pageSize);
      return pageTotal;
    }
  },
  components: {
    addAdmin,
    modifyAdmin,
    modifyPassword,
    addRole
  }
};
</script>
<style scoped lang="scss">
</style>






