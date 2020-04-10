<template>
  <div class="regionBUList" v-if="isShow">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>单位列表</span>
      <el-button type="warning" v-if="userRight.indexOf('add')>=0" size="small" @click="isShowAddModule=true;curInfo.type='add'">新增单位</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search">
        <el-select v-model="companyCode" slot="prepend" placeholder="请选择公司" @change="changeCompanyCode" style="width:200px;">
          <el-option v-for='(item,index) in companyList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="tableData" stripe row-key="id">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="名称：">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="账号：">
              <span>{{ props.row.account }}</span>
            </el-form-item>
            <el-form-item label="所属公司：">
              <span>{{ props.row.companyName }}</span>
            </el-form-item>
            <el-form-item label="国家：">
              <span>{{ props.row.country }}</span>
            </el-form-item>
            <el-form-item label="位置：">
              <span>{{ props.row.location }}</span>
            </el-form-item>
            <el-form-item label="地址：">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="备注：">
              <span>{{ props.row.remarks }}</span>
            </el-form-item>
            <el-form-item label="联系人名称：">
              <span>{{ props.row.contactName }}</span>
            </el-form-item>
            <el-form-item label="联系人手机：">
              <span>{{ props.row.contactTel }}</span>
            </el-form-item>
            <el-form-item label="联系人邮箱：">
              <span>{{ props.row.contactEmail }}</span>
            </el-form-item>
            <el-form-item label="联系人职位：">
              <span>{{ props.row.contactTitle }}</span>
            </el-form-item>
            <el-form-item label="联系人位置：">
              <span>{{ props.row.contactLocation }}</span>
            </el-form-item>
            <el-form-item label="联系人备注：">
              <span>{{ props.row.contactRemarks }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="companyRegionName" label="所属区域"></el-table-column>
      <el-table-column label="公司logo">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.logo?scope.row.logo:avatarDefault"
            fit="scale-down"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="350px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="userRight.indexOf('edit')>=0">编辑</el-button>
          <el-button v-if="userRight.indexOf('del')>=0"
            size="mini"
            icon="el-icon-warning"
            @click="prohibitFun(scope.$index, scope.row)"
          >{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button
            size="mini"
            icon="el-icon-setting"
            @click="handleSetting(scope.$index, scope.row)"
            v-if="userRight.indexOf('set')>=0"
          >设置</el-button>
          <el-button v-if="userRight.indexOf('del')>=0"
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 编辑单位信息 -->
    <el-dialog
      title="编辑单位信息"
      :visible.sync="isShowAddModule"
      :close-on-click-modal="false"
      width="65%">
      <edit-template
        v-if="isShowAddModule"
        v-on:listenIsShowMask="listenIsShowMask"
        :curInfo="curInfo"
      ></edit-template>
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
  name: "regionBUList",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList: [],
      curInfo: {}, //当前信息
      isShowAddModule: false, //是否显示增加模块
      isShowLoading: true,
      avatarDefault:require("@/assets/images/avatar.png"), //默认头像
      companyCode:"",
      companyList:[],
      userInfo:{},
      userRight:[]
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/company/regionBUs",
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
    this.getCompanyCodeFun();
    if (this.userInfo.roleTypeId == 4){//201公司管理员，211区域管理员，221单位管理员
      if ([201,211].indexOf(this.userInfo.lev) >= 0){
        this.userRight = ['add','edit','del'];
      }else if (this.userInfo.lev == 221){
        this.userRight = ['edit'];
      }
    }
    if (this.userInfo.roleTypeId == 3){//平台管理员
      this.userRight = ['add','edit','del'];
    }
    if (this.userInfo.roleTypeId == 2 && this.userInfo.lev == 301){//hr系统管理员
      this.userRight = ['set'];
    }
    if ([2,3,4].indexOf(this.userInfo.roleTypeId) >= 0){//如果是平台管理员和用户管理员
      this.isShow = true;
    }
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
        }
    },
    // 选择单位
    changeCompanyCode(code){
      this.companyCode = code;
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
      this.$toolFn.sessionSet('hrCompanyCode',code);
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
      var txt = "";
      var status = 1;
      if (res.status == 1) {
        txt = "此操作将禁用该数据, 是否继续?";
        status = 0;
      } else {
        txt = "此操作将启用该数据, 是否继续?";
        status = 1;
      }
      this.$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          var data = {
            id: res.id,
            status: status
          };
          this.$myApi.http.post("/server/api/v1/company/regionBUUpdate", data).then(res => {
              this.reload();
              this.$message.success("操作成功~");
            });
        })
    },
    // 设置
    handleSetting(index, res){
      this.$store.commit({
        type: "getBUInfo",
        BUInfo: res,
        isShowSetting: true
      });
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/company/regionBUDelete", { id: res.id }).then(res => {
              if (res.data.code == 0) {
                this.reload();
                this.$message.success("删除成功~");
              } else {
                this.$message.error(res.data.msg);
              }
            });
        })
    }
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
.search {
  margin: 20px auto;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 25%;
}
</style>


