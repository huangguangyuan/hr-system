<template>
  <div class="wrap customerAdminList" v-if="isShow">
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
      <el-select v-model="companyCode" slot="prepend" placeholder="请选择公司" @change="changeCompanyCode" style="width:200px;">
          <el-option v-for='(item,index) in companyList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id" border>
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
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
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
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    addAdmin,modifyAdmin,modifyPassword,addRole,pageInfo
  },
  name: "customerAdminList",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList:[],
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
  computed:{
    pageInfo(){
      return {
        reqParams:{//请求分页参数
            isReq:false,
            url:"/server/api/v1/admin/client/getAll",
            data:{companyCode:this.companyCode}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.isStatus = item.status == 1 ? "启用" : "禁用";
        item.mobile =  item.companyTel || ""  + item.companyRegionTel || "" + item.BUTel || "";
        item.email = item.companyEmail || "" + item.companyRegionEmail || "" + item.BUEmail || "";
        item.mobile = this.$toolFn.isNotOrEmpty(item.mobile)?"":item.mobile;
        item.email = this.$toolFn.isNotOrEmpty(item.email)?"":item.email;
        item.children = item.childrenList.map(childItem => {
          childItem.isStatus = item.status == 1 ? "启用" : "禁用";
          return childItem;
        });
        return item;
      });
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    if ([3,4].indexOf(this.userInfo.roleTypeId) >= 0){//平台管理员,用户管理员
      this.isShow = true;
    }
    this.getCompanyCodeFun();
    //this.getData({companyCode:companyCode});
  },
  methods: {
    // 获取单位列表
    async getCompanyCodeFun(){
      var companys = await this.$myApi.companys({isCache:true});
      if (companys) {
          this.companyList = companys;
          this.companyCode = this.$toolFn.sessionGet('hrCompanyCode')?this.$toolFn.sessionGet('hrCompanyCode'):this.companyList[0].code;
          this.pageInfo.reqParams.isReq = true;
          this.$refs.pageInfo.getData(this.pageInfo);
          //this.getData({companyCode:this.companyCode});
        }
    },
    // 选择单位
    changeCompanyCode(code){
      this.companyCode = code;
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
      this.$toolFn.sessionSet('hrCompanyCode',code);
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
      this.modifyInfo.adminType = "customerAdmin";
    },
    // 修改密码
    modifyPassWord(index, res) {
      this.isShowModifyPassword = true;
      this.modifyInfo = res;
      this.modifyInfo.adminType = "admin";
    },
    // 添加子权限
    addAccount(index, res) {
      this.isShowAddAdmin = true;
      this.modifyInfo = res;
      this.modifyInfo.adminType = "customerAdmin";
    },
    // 添加角色
    addRole(index, res) {
      this.isShowAddRole = true;
      this.modifyInfo = res;
      this.modifyInfo.adminType = "admin";
    },
    // 禁用
    forbidden(index, res) {
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
          this.$myApi.http.post("/server/api/v1/admin/delete", { id: res.id })
            .then(res => {
              this.reload();
            });
        })
    },
  }
};
</script>
<style scoped lang="scss">
</style>






