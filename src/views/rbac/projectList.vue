<template>
  <div class="wrap projectList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>项目列表</span>
      <el-button type="primary" size="small" @click='isShowProject = true;isType="added"'>添加项目</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <el-input placeholder="请输入搜索关键字" v-model="searchInner" @blur='searchFn'>
        <el-button slot="append" icon="el-icon-search" @click='searchFn'>搜 索</el-button>
      </el-input>
    </div>
    
    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe style="width: 100%" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="description" label="项目描述"></el-table-column>
      <el-table-column prop="orderNo" label="项目序号"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <!-- 新增项目 -->
    <el-dialog title="新增项目" :visible.sync="isShowProject" :close-on-click-modal='false'>
      <add-project v-on:listenIsShowProject='showIsShowProject' :isType='isType' v-if='isShowProject'></add-project>
    </el-dialog>
  </div>
</template>
<script>
import addProject from './addProject.vue'
export default {
  name: "projectList",
  inject:['reload'],
  data() {
    return {
      tableData: [],//列表数据
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowProject:false,//是否显示增加项目表单
      isType:'added',//判断传入添加or修改
      searchInner:''//搜索关键字
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
      var reqUrl = "/server/api/v1/project/getAll";
      var myData = {};
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.tableData = res.data.data.map(item => {
            item.createTime = _this.$toolFn.timeFormat(item.createTime);
            item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
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
    // 检测是否关闭表单
    showIsShowProject(res){
      var _this = this;
      _this.isShowProject = res;
    },
    // 编辑
    handleEdit(index,res){
      var _this = this;
      _this.$store.commit({
        type:'projectEditInfo',
        editInfo:res
      });
      _this.isShowProject = true;
      _this.isType = 'modify';
    },
    // 删除
    handleDelete(index,res){
      var _this = this;
      _this.$confirm('此操作将永久删除该数据, 是否继续?','提 示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        _this.$http.post('/server/api/v1/project/delete', {id:res.id}).then(res => {
          _this.reload();
        });
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 搜索
    searchFn(){
      var _this = this;
      if(_this.searchInner){
        var reqUrl = '/server/api/v1/project/getByOptions';
        var data = {name:_this.searchInner}
        _this.$http.post(reqUrl,data).then(res => {
          _this.tableData = res.data.data.map(item => {
              item.createTime = _this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
              return item;
            });
            _this.total = _this.tableData.length;
        })
      }else{
        _this.getData();
      }
      
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
    addProject
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






