<template>
  <div class="wrap regionList">
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
    <el-table v-loading='isShowLoading' :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column sortable prop="account" label="账号"></el-table-column>
      <el-table-column prop="companyName" label="所属公司"></el-table-column>
      <el-table-column prop="contactName" label="联系人"></el-table-column>
      <el-table-column prop="contactTel" label="联系人电话"></el-table-column>
      <el-table-column prop="contactEmail" label="联系人邮箱"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column prop="location" label="位置"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="logo" label="logo">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.logo?scope.row.logo:AvatarDefault"
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
    <!-- 编辑区域信息 -->
    <el-dialog
      title="编辑区域信息"
      :visible.sync="isShowAddModule"
      :close-on-click-modal="false"
      width="65%"
    >
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
import { truncate } from 'fs';
export default {
  name: "regionList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前信息
      isShowAddModule: false, //是否显示增加模块
      isShowLoading: false, //是否显示loading页
      companyCode:"",
      companyList:[],
      userInfo:{},
      userRight:true,
      AvatarDefault:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //默认头像
    };
  },
  mounted() {
    var _this = this;
    _this.userInfo = _this.$toolFn.localGet("userInfo");
    if (_this.userInfo.roleTypeId == 4 && _this.userInfo.lev > 210){
      this.userRight = false;
    }
    _this.getCompanyCodeFun();
    //_this.getData({companyCode:companyCode});
  },
  methods: {
    // 获取单位列表
    async getCompanyCodeFun(){
      var _this = this;
      var companys = await _this.$myApi.companys(_this,{isCache:true});
      if (companys) {
          _this.companyList = companys;
          _this.companyCode = this.$toolFn.sessionGet('hrCompanyCode')?this.$toolFn.sessionGet('hrCompanyCode'):companys[0].code;
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
      _this.isShowLoading = true;
      var reqUrl = "/server/api/v1/company/regions";
      var myData = {};
      if (params && params.companyCode != ""){
        myData.companyCode = params.companyCode
      }
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              item.statusTxt = item.status == 1 ? "启用" : "禁用";
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
    // 监听子组件信息
    listenIsShowMask(res) {
      this.isShowAddModule = res;
    },
    // 编辑信息
    handleEdit(index, res) {
      var _this = this;
      _this.curInfo = res;
      _this.curInfo.type = "modify";
      _this.isShowAddModule = true;
    },

    // 禁用
    prohibitFun(index, res) {
      var _this = this;
      var txt = '';
      var status = 1;
      if(res.status == 1){
          txt = '此操作将禁用该数据, 是否继续?'
          status = 0;
      }else{
          txt = '此操作将启用该数据, 是否继续?'
          status = 1;
      }
      _this
        .$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var data = {
                id:res.id,
                status:status
            }
          _this.$http
            .post("/server/api/v1/company/regionUpdate", data)
            .then(res => {
              _this.reload();
              _this.$message.success("操作成功~");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
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
            .post("/server/api/v1/company/regionDelete", { id: res.id })
            .then(res => {
                if(res.data.code == 0){
                    _this.reload();
                    _this.$message.success("删除成功~");
                }else{
                    _this.$message.error(res.data.msg);
                }
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
    editTemplate
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


