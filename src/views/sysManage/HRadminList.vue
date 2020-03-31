<template>
  <div class="wrap HRadminList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>HR管理员列表</span>
      <el-button type="warning" v-if="userRight" size="small" @click="isShowAddAdmin = true;modifyInfo.adminType = 'HRadmin'">添加HR管理员</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search" v-if="userRight">
      <el-input placeholder="请输入关键字" v-model="filter.searchKey">
        <el-select v-model="BUCode" slot="prepend" placeholder="请选择" @change="changeBUCode" style="width:200px;">
          <el-option v-for='(item,index) in regionBUList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="queryTableDate" stripe row-key="id" border>
      <el-table-column sortable prop="name" label="名称"></el-table-column>
      <el-table-column sortable prop="roleTypeTxt" label="权限"></el-table-column>
      <el-table-column sortable prop="levExtendTxt" label="扩展权限"></el-table-column>
      <el-table-column sortable prop="account" label="账号"></el-table-column>
      <!-- <el-table-column prop="mobile" label="手机"></el-table-column> -->
      <el-table-column sortable prop="isStatus" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="480px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="editFn(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit-outline"
            @click="modifyPassWord(scope.$index, scope.row)"
          >修改密码</el-button>
          <!-- <el-button  v-if="userRight && [3,4].indexOf(userInfo.roleTypeId) >= 0" size="mini" icon="el-icon-plus" @click="addRole(scope.$index, scope.row)">编辑角色</el-button> -->
          <el-button  v-if="userRight"
            size="mini"
            icon="el-icon-warning"
            @click="forbidden(scope.$index, scope.row)"
          >{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button  v-if="userRight"
            size="mini"
            icon="el-icon-delete"
            class="el-button--danger"
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
    <!-- 新增管理员 -->
    <el-dialog
      title="新增管理员"
      :visible.sync="isShowAddAdmin"
      :close-on-click-modal="false"
      width="65%"
    >
      <add-h-radmin v-if="isShowAddAdmin" v-on:listenIsShowAddAdmin="IsShowAddAdminFn" :modifyInfo="modifyInfo"></add-h-radmin>
    </el-dialog>
    <!-- 修改管理员 -->
    <el-dialog
      title="编辑信息"
      :visible.sync="isShowModifyAdmin"
      :close-on-click-modal="false"
      width="65%"
    >
      <modify-admin
        v-if="isShowModifyAdmin"
        v-on:listenIsShowAddAdmin="IsShowAddAdminFn"
        :modifyInfo="modifyInfo"
        :userRight="userRight"
        :userInfo_prop="userInfo"
      ></modify-admin>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      title="编辑密码"
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
    <el-dialog title="增加角色" :visible.sync="isShowAddRole" :close-on-click-modal="false" width="40%">
      <add-role
        v-if="isShowAddRole"
        v-on:listenIsShowAddAdmin="IsShowAddAdminFn"
        :modifyInfo="modifyInfo"
      ></add-role>
    </el-dialog>
  </div>
</template>
<script>
import addHRadmin from "./addHRadmin.vue";
import modifyAdmin from "./modifyAdmin.vue";
import modifyPassword from "./modifyPassword.vue";
import addRole from "./addRole.vue";
import { Promise } from 'q';
export default {
  name: "HRadminList",
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
      modifyInfo: {}, //当前列表信息
      BUCode:'',//单位code
      regionBUList:[],//单位列表
      isShowLoading:false,//加载
      userInfo:{},
      userRight:true,
      filter:{searchKey:'',searchField:['name','roleTypeTxt','account']}
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
     initializeFun(){
      this.userInfo = this.$toolFn.localGet("userInfo");
      //console.log(this.userInfo);
      if (this.userInfo.roleTypeId == 2 && this.userInfo.lev != 301 ){
        this.userRight = false;
      }
      if ([3,4].indexOf(this.userInfo.roleTypeId) >= 0){//如果是平台管理员
        this.getBUCodeFun();
      }else{
        this.BUCode = this.userInfo.BUCode;
        this.getData(this.BUCode);
      }
      
      
      //this.getBUCodeFun();
    },
    //获取项目数据列表
    getData(code) {
      
      var reqUrl = "/server/api/v1/admin/hrSys/getAll";
      var myData = { BUCode: code };
      this.isShowLoading =true;
      this.$myApi.http.post(reqUrl, myData)
        .then(res => {
          this.isShowLoading =false;
          this.tableData = res.data.data
            .map(item => {
              item.createTime = this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
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
          this.total = this.tableData.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取单位列表
    async getBUCodeFun(){
      
      var regionBUs = await this.$myApi.regionBUs();
      if (regionBUs && regionBUs.length > 0) {
        this.regionBUList = regionBUs;
        this.BUCode = this.$toolFn.sessionGet('hrBUCode')?this.$toolFn.sessionGet('hrBUCode'):this.regionBUList[0].code;
        //如果选中bu不存在，则获取第一个bu
        if (this.regionBUList.filter(f => {return (this.BUCode == f)}).length == 0){
          this.BUCode = this.regionBUList[0].code;
        }
        this.getData(this.BUCode);
      }
    },
    // 选择单位
    changeBUCode(code){
      this.BUCode = code;
      this.getData(this.BUCode);
      this.$toolFn.sessionSet('hrBUCode',code);
    },
    // 获取当前页数
    curChange(val) {
      
      this.curPage = val;
    },
    // 接受子组件接受的值
    IsShowAddAdminFn(res) {
      this.isShowAddAdmin = res;
      this.isShowModifyAdmin = res;
      this.isShowModifyPassword = res;
      this.isShowAddRole = res;
    },
    // 编辑
    editFn(index, res) {
      
      this.isShowModifyAdmin = true;
      this.modifyInfo = res;
      this.modifyInfo.adminType = "HRadmin";
    },
    // 修改密码
    modifyPassWord(index, res) {
      
      this.isShowModifyPassword = true;
      this.modifyInfo = res;
      this.modifyInfo.adminType = "HRadmin";
    },
    // 添加角色
    addRole(index, res) {
      
      this.isShowAddRole = true;
      this.modifyInfo = res;
      this.modifyInfo.adminType = "HRadmin";
    },
    // 禁用
    forbidden(index, res) {
      
      var reqUrl = "/server/api/v1/admin/hrSys/update";
      var data = { id: res.id };
      var txt = "";
      if (res.status == 1) {
        data.status = 0;
        txt = "此操作将禁用, 是否继续?";
      } else {
        data.status = 1;
        txt = "此操作将启用, 是否继续?";
      }
      this
        .$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$myApi.http.post(reqUrl, data).then(res => {
            if (res.data.code == 0) {
            this.reload();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作~"
          });
        });
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
            .post("/server/api/v1/admin/hrSys/delete", { id: res.id })
            .then(res => {
              console.log(res);
              this.reload();
              this.$message('删除成功！');
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
    addHRadmin,
    modifyAdmin,
    modifyPassword,
    addRole
  }
};
</script>
<style scoped lang="scss">
</style>

