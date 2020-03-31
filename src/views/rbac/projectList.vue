<template>
  <div class="wrap projectList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>项目列表</span>
      <el-button type="primary" size="small" @click='isShowProject = true;isType="added"'>添加项目</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入关键字" v-model="filter.searchKey"></el-input>
    </div>
    
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="queryTableDate" stripe style="width: 100%" border>
      <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
      <el-table-column sortable prop="name" label="项目名称"></el-table-column>
      <el-table-column sortable prop="description" label="项目描述"></el-table-column>
      <!-- <el-table-column prop="orderNo" label="项目序号"></el-table-column> -->
      <!-- <el-table-column sortable prop="createTime" label="创建时间"></el-table-column> -->
      <!-- <el-table-column prop="modifyTime" label="修改时间"></el-table-column> -->
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
    <el-dialog :title="isType=='added'?'新增项目':'修改项目'" :visible.sync="isShowProject" :close-on-click-modal='false'>
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
      isShowLoading: false, //是否显示loading页
      isType:'added',//判断传入添加or修改
      filter:{searchKey:'',searchField:['name','description']}
    };
  },
  mounted() {
    
    this.getData();
  },
  methods: {
    //获取项目数据列表
    getData() {
      
      var reqUrl = "/server/api/v1/project/getAll";
      var myData = {};
      this.isShowLoading = true;
      this.$myApi.http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
            return item;
          });
          this.total = this.tableData.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前页数
    curChange(val) {
      
      this.curPage = val;
    },
    // 检测是否关闭表单
    showIsShowProject(res){
      
      this.isShowProject = res;
    },
    // 编辑
    handleEdit(index,res){
      
      this.$store.commit({
        type:'projectEditInfo',
        editInfo:res
      });
      this.isShowProject = true;
      this.isType = 'modify';
    },
    // 删除
    handleDelete(index,res){
      
      this.$confirm('此操作将永久删除该数据, 是否继续?','提 示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.$myApi.http.post('/server/api/v1/project/delete', {id:res.id}).then(res => {
          if (res.data.code == 0) {
            this.$message({message: "删除成功！"});
            this.reload();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
  },
  computed: {
    queryTableDate() {
      
      let tableData = this.tableData;
      if (this.filter.searchKey != ""){
        tableData = this.$toolFn.searchFun(tableData,this.filter);
      }
      this.total = tableData.length;
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return tableData.slice(begin, end);
    },
    pageTotal(){
      
      var pageTotal = Math.ceil(this.total/this.pageSize);
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

</style>






