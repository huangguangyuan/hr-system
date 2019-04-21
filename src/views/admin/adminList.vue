<template>
  <div class="wrap adminList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>后台管理列表</span>
      <el-button type="warning" size="small" @click='isShowAddAdmin = true'>添加管理员</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" icon="el-icon-plus">修改密码</el-button>
          <el-button size="mini" icon="el-icon-plus">禁用</el-button>
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
    <!-- 新增管理员 -->
    <el-dialog title="新增管理员" :visible.sync="isShowAddAdmin" :close-on-click-modal='false' width="65%">
      <add-admin v-if='isShowAddAdmin' v-on:listenIsShowAddAdmin='IsShowAddAdminFn'></add-admin>
    </el-dialog>
  </div>
</template>
<script>
import addAdmin from './addAdmin.vue'
export default {
  name: "adminList",
  inject:['reload'],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowAddAdmin:false//是否显示新增后台管理员
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
      var reqUrl = "/server/api/v1/admin/getAll";
      var myData = {"typeId":1};
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.tableData = res.data.data.map(item => {
            item.createTime = _this.$toolFn.timeFormat(item.createTime);
            item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
            item.children = item.nodes
            return item;
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
    IsShowAddAdminFn(res){
      this.isShowAddAdmin = res
    },
    // 删除
    handleDelete(index,res){
      var _this = this;
      _this.$confirm('此操作将永久删除该数据, 是否继续?','提 示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        _this.$http.post('/server/api/v1/admin/delete', {id:res.id}).then(res => {
          _this.reload();
        });
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
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
    pageTotal(){
      var _this = this;
      var pageTotal = Math.ceil(_this.total/_this.pageSize);
      return pageTotal;
    }
  },
  components:{
    addAdmin
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






