<template>
  <div class="wrap company">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>公司列表</span>
      <el-button type="warning" size="small" @click='isShowAddModule=true;curInfo.type="company"'>新增公司</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="contactName" label="联系人"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit">修改信息</el-button>
          <el-button size="mini" icon="el-icon-plus">增加信息</el-button>
          <el-button size="mini" icon="el-icon-warning">禁用</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <!-- 新增公司 -->
    <el-dialog title="新增公司" :visible.sync="isShowAddModule" :close-on-click-modal="false" width="65%">
      <add-module v-if="isShowAddModule" v-on:listenChildren="listenChildren" :curInfo="curInfo"></add-module>
    </el-dialog>
    <!-- 加载等待页 -->
    <loading-page v-if="isShowLoading"></loading-page>
  </div>
</template>
<script>
import addModule from './addModule.vue';
import loadingPage from "@/components/loadingPage.vue";
export default {
  name: "company",
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo:{},//当前信息
      isShowAddModule:false,//是否显示增加模块
      isShowLoading: false, //是否显示loading页
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
      _this.$http.post(reqUrl, myData).then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data.sort((a, b) => {
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
    listenChildren(res){
      this.isShowAddModule = res;
    },
    // 删除
    handleDelete(index,res){

    }
  },
  computed: {
    queryTableDate() {
      var _this = this;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return _this.tableData.slice(begin, end);
    },
    pageTotal(){
      var _this = this;
      var pageTotal = Math.ceil(_this.total/_this.pageSize);
      return pageTotal;
    }
  },
  components:{
    addModule,loadingPage
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
  margin-top: 20px;display: flex;justify-content: space-between;
  p{font-size: 14px;margin-right: 20px;}
}
.search{margin:20px auto;}
</style>






