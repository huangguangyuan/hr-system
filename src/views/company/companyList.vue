<template>
  <div class="wrap company">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>公司列表</span>
      <el-button type="warning" size="small" @click="isShowAddModule=true;curInfo.type='add'">新增公司</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="contactName" label="联系人"></el-table-column>
      <el-table-column prop="contactTel" label="联系人电话"></el-table-column>
      <el-table-column prop="contactEmail" label="联系人邮箱"></el-table-column>
      <el-table-column prop="statusTxt" label="状态"></el-table-column>
      <el-table-column prop="country" label="国家"></el-table-column>
      <el-table-column prop="location" label="位置"></el-table-column>
      <el-table-column prop="logo" label="logo"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" icon="el-icon-warning" @click='prohibitFun(scope.$index, scope.row)'>{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button
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
    <!-- 编辑公司信息 -->
    <el-dialog
      title="编辑公司信息"
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
    <!-- 加载等待页 -->
    <loading-page v-if="isShowLoading"></loading-page>
  </div>
</template>
<script>
import editTemplate from "./editTemplate.vue";
import loadingPage from "@/components/loadingPage.vue";
export default {
  name: "company",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前信息
      isShowAddModule: false, //是否显示增加模块
      isShowLoading: false //是否显示loading页
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
      _this.isShowLoading = true;
      var reqUrl = "/server/api/v1/company/companys";
      var myData = {};
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
          console.log(res);
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
            .post("/server/api/v1/company/companyUpdate", data)
            .then(res => {
              _this.reload();
              _this.$message("操作成功~");
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
            .post("/server/api/v1/company/companyDelete", { id: res.id })
            .then(res => {
              if(res.data.code == 0){
                  _this.reload();
                  _this.$message("删除成功~");
              }else{
                  _this.$message(res.data.msg);
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
    editTemplate,
    loadingPage
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


