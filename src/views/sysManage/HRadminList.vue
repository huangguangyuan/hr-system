<template>
  <div class="wrap HRadminList" v-if="isShow">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>HR管理员列表</span>
      <el-button type="warning" v-if="userRight" size="small" @click="isShowAddAdmin = true;modifyInfo.adminType = 'HRadmin'">添加HR管理员</el-button>
    </div>
    <!-- 搜索 -->
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch" v-if="userRight"></bus-and-search>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="tableData" stripe row-key="id" border>
      <el-table-column sortable prop="name" label="名称"></el-table-column>
      <el-table-column sortable prop="roleTypeTxt" label="权限"></el-table-column>
      <el-table-column sortable prop="levExtendTxt" label="扩展权限"></el-table-column>
      <el-table-column sortable prop="serveIdTxt" label="服务归属"></el-table-column>
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
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
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
import modifyAdmin from "./modifyHRAdmin.vue";
import modifyPassword from "./modifyPassword.vue";
import addRole from "./addRole.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    addHRadmin,modifyAdmin,modifyPassword,addRole,pageInfo,busAndSearch
  },
  name: "HRadminList",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList:[],
      isShowAddAdmin: false, //是否显示新增后台管理员
      isShowModifyAdmin: false, //是否显示修改后台管理员
      isShowModifyPassword: false, //是否显示修改密码
      isShowAddRole: false, //是否显示增加角色
      modifyInfo: {}, //当前列表信息
      BUCodeSelected:'',//单位code
      isShowLoading:false,//加载
      userInfo:{},
      userRight:true,
      filter:{searchKey:'',searchField:['name','roleTypeTxt','account']}
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/admin/hrSys/getAll",
            data:{ BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {BUCodeOptionsShow:true,filter:this.filter};
    },
    tableData(){
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
        item.isStatus = item.status == 1 ? "启用" : "禁用";
        item.children = item.nodes;
        return item;
      });
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.roleTypeId == 2 && this.userInfo.lev != 301 ){
      this.userRight = false;
      this.BUCodeSelected = this.userInfo.BUCode;
    }
    if ([3,4].indexOf(this.userInfo.roleTypeId) >= 0){//如果是平台管理员,用户管理员
      this.isShow = true;
    }else if ([2].indexOf(this.$toolFn.curUser.roleTypeId) >= 0){//如果是hr管理员
      this.isShow = true;
      this.busAndSearch.BUCodeOptionsShow = false;
      this.busAndSearch.BUCodeSelected = this.userInfo.BUCode;
    }
  },
  methods: {
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
      this.$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post(reqUrl, data).then(res => {
            if (res.data.code == 0) {
            this.reload();
            }
          });
        })
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/admin/hrSys/delete", { id: res.id }).then(res => {
              this.reload();
              this.$message('删除成功！');
            });
        })
    }
  },
  watch: {
    BUCodeSelected: {
      handler: function(newVal) {
        this.pageInfo.reqParams.isReq = true;
        if (this.$refs.busAndSearch){
          this.$refs.busAndSearch.init(this.busAndSearch);
        }
        if (this.$refs.pageInfo){
          this.$refs.pageInfo.getData(this.pageInfo);
        }
      }
    },
    "filter.searchKey":{
      handler: function(newVal) {
        this.$refs.pageInfo.searchKey(this.busAndSearch.filter);
      }
    }
  },
};
</script>
<style scoped lang="scss">
</style>

