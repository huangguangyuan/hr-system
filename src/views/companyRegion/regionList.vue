<template>
  <div class="wrap regionList" v-if="isShow">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>区域列表</span>
      <el-button type="warning" v-if="userRight" size="small" @click="isShowAddModule=true;curInfo.type='add'">新增区域</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search">
        <el-select v-if="userRight" v-model="companyCode" slot="prepend" placeholder="请选择公司" @change="changeCompanyCode" style="width:200px;">
          <el-option v-for='(item,index) in companyList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="tableData" stripe row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column sortable prop="account" label="账号"></el-table-column>
      <el-table-column prop="companyName" label="所属公司"></el-table-column>
      <el-table-column prop="contactName" label="联系人"></el-table-column>
      <el-table-column prop="contactTel" label="联系人手机"></el-table-column>
      <el-table-column prop="contactEmail" label="联系人邮箱"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column prop="location" label="位置"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="logo" label="logo">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.logo?scope.row.logo:avatarDefault"
            fit="scale-down"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" v-if="userRight" icon="el-icon-warning" @click='prohibitFun(scope.$index, scope.row)'>{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button v-if="userRight"
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 编辑区域信息 -->
    <el-dialog
      title="编辑区域信息"
      :visible.sync="isShowAddModule"
      :close-on-click-modal="false"
      width="65%"
    >
      <edit-template v-if="isShowAddModule" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></edit-template>
    </el-dialog>
  </div>
</template>
<script>
import editTemplate from "./editTemplate.vue";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    editTemplate,pageInfo
  },
  name: "regionList",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList: [],
      curInfo: {}, //当前信息
      isShowAddModule: false, //是否显示增加模块
      isShowLoading: false, //是否显示loading页
      companyCode:"",
      companyList:[],
      userInfo:{},
      userRight:true,
      avatarDefault:require("@/assets/images/avatar.png"), //默认头像
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/company/regions",
            data:{companyCode:this.companyCode}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.statusTxt = item.status == 1 ? "启用" : "禁用";
        return item;
      });
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.roleTypeId == 4 && this.userInfo.lev > 210){
      this.userRight = false;
    }
    if ([3,4].indexOf(this.userInfo.roleTypeId) >= 0){//如果是平台管理员和用户管理员
      this.isShow = true;
    }
    this.getCompanyCodeFun();
  },
  methods: {
    // 获取区域列表
    async getCompanyCodeFun(){
      var companys = await this.$myApi.companys();
      if (companys) {
          this.companyList = companys;
          this.companyCode = this.$toolFn.sessionGet('hrCompanyCode')?this.$toolFn.sessionGet('hrCompanyCode'):companys[0].code;

        }
    },
    // 选择公司
    changeCompanyCode(code){
      this.companyCode = code;
      this.pageInfo.reqParams.isReq = true;
    },
    // 监听子组件信息
    listenIsShowMask(res) {
      this.isShowAddModule = res;
    },
    // 编辑信息
    handleEdit(index, res) {
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.isShowAddModule = true;
    },
    // 禁用
    prohibitFun(index, res) {
      var txt = '';
      var status = 1;
      if(res.status == 1){
          txt = '此操作将禁用该数据, 是否继续?'
          status = 0;
      }else{
          txt = '此操作将启用该数据, 是否继续?'
          status = 1;
      }
      this.$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          var data = {
                id:res.id,
                status:status
            }
          this.$myApi.http.post("/server/api/v1/company/regionUpdate", data).then(res => {
              this.reload();
              this.$message.success("操作成功");
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
          this.$myApi.http.post("/server/api/v1/company/regionDelete", { id: res.id }).then(res => {
                if(res.data.code == 0){
                    this.reload();
                    this.$message.success("删除成功");
                }else{
                    this.$message.error(res.data.msg);
                }
            });
        })
    }
  },
  watch: {
    companyCode: {
      handler: function(newVal) {
          this.pageInfo.reqParams.isReq = true;
          this.$refs.pageInfo.getData(this.pageInfo);
      }
    }
  },
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


