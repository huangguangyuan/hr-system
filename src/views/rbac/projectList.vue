<template>
  <div class="wrap projectList"  v-if="isShow">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>项目列表</span>
      <el-button type="primary" size="small" @click='isShowProject = true;isType="added"'>添加项目</el-button>
    </div>
    <!-- 搜索 -->
    <bus-and-search :busAndSearch_props="busAndSearch" ref="busAndSearch"></bus-and-search>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="tableData" stripe style="width: 100%" border>
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
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 新增项目 -->
    <el-dialog :title="isType=='added'?'新增项目':'修改项目'" :visible.sync="isShowProject" :close-on-click-modal='false'>
      <add-project v-on:listenIsShowProject='showIsShowProject' :isType='isType' v-if='isShowProject'></add-project>
    </el-dialog>
  </div>
</template>
<script>
import addProject from './addProject.vue'
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    addProject,pageInfo,busAndSearch
  },
  name: "projectList",
  inject:['reload'],
  data() {
    return {
      isShow:false,
      pageList: [],
      isShowProject:false,//是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      isType:'added',//判断传入添加or修改
      filter:{searchKey:'',searchField:['name','description']}
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{//请求分页参数
            url:"/server/api/v1/project/getAll",
            data:{}
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter,BUCodeOptionsShow:false};
    },
    tableData(){
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
        return item;
      });
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    if ([3].indexOf(this.userInfo.roleTypeId) >= 0){//平台管理员
      this.isShow = true;
    }
  },
  methods: {
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
      })
    },
  },
   watch: {
    "filter.searchKey":{
      handler: function(newVal) {
        this.$refs.pageInfo.searchKey(this.busAndSearch.filter);
      }
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

</style>






