<template>
  <div class="regionBUList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>单位列表</span>
      <el-button type="warning" size="small" @click="isShowAddModule=true;curInfo.type='add'">新增单位</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search">
        <el-select v-model="companyCode" slot="prepend" placeholder="请选择公司" @change="changeCompanyCode" style="width:200px;">
          <el-option v-for='(item,index) in companyList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="loading" :data="queryTableDate" stripe row-key="id">
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
            <el-form-item label="联系人电话：">
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
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="companyRegionName" label="所属区域"></el-table-column>
      <el-table-column label="公司logo">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.logo?scope.row.logo:AvatarDefault"
            fit="scale-down"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="350px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-warning"
            @click="prohibitFun(scope.$index, scope.row)"
          >{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button
            size="mini"
            icon="el-icon-setting"
            @click="handleSetting(scope.$index, scope.row)"
          >设置</el-button>
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
    <!-- 编辑单位信息 -->
    <el-dialog
      title="编辑单位信息"
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
export default {
  name: "regionBUList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前信息
      isShowAddModule: false, //是否显示增加模块
      loading: true,
      AvatarDefault:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //默认头像
      companyCode:"",
      companyList:[]
    };
  },
  mounted() {
    var _this = this;
    _this.getCompanyCodeFun();
    //_this.getData();
    
  },
  methods: {
    // 获取单位列表
    getCompanyCodeFun(){
      var _this = this;
      var reqUrl = '/server/api/v1/company/companys';
      _this.$http.post(reqUrl,{}).then(res => {
        this.companyList = res.data.data;
        this.companyCode = this.$toolFn.sessionGet('hrCompanyCode')?this.$toolFn.sessionGet('hrCompanyCode'):res.data.data[0].code;
        this.getData({companyCode:this.companyCode});
      });
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
      _this.loading = true;
      var reqUrl = "/server/api/v1/company/regionBUs";
      var myData = {};
      if (params && params.companyCode != ""){
        myData.companyCode = params.companyCode
      }
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.loading = false;
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
      var txt = "";
      var status = 1;
      if (res.status == 1) {
        txt = "此操作将禁用该数据, 是否继续?";
        status = 0;
      } else {
        txt = "此操作将启用该数据, 是否继续?";
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
            id: res.id,
            status: status
          };
          _this.$http
            .post("/server/api/v1/company/regionBUUpdate", data)
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
      var _this = this;
      _this
        .$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .post("/server/api/v1/company/regionBUDelete", { id: res.id })
            .then(res => {
              if (res.data.code == 0) {
                _this.reload();
                _this.$message.success("删除成功~");
              } else {
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


