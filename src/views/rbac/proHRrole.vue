<!--
 * @Author: your name
 * @Date: 2019-07-21 14:51:54
 * @LastEditTime: 2020-08-05 22:20:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \hr-system\src\views\rbac\proHRrole.vue
-->
<template>
  <div class="wrap proHRrole">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>HR角色列表</span>
      <el-button type="warning" size="small">添加角色</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table :data="tableData" stripe row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" icon="el-icon-plus" type="primary">新增子角色</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
  </div>
</template>
<script>
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    pageInfo
  },
  name: "proHRrole",
  data() {
    return {
      pageList: []
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/projectRole/projectRolesWithAll",
            data:{"typeId":2}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
        item.children = item.nodes
        return item;
      });
    }
  },
  methods: {
    //获取项目数据列表
    getData() {
      var reqUrl = "/server/api/v1/projectRole/projectRolesWithAll";
      var myData = {"typeId":2};
      this.$myApi.http
        .post(reqUrl, myData)
        .then(res => {
          this.tableData = res.data.data.map(item => {
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
            item.children = item.nodes
            return item;
          });
          this.total = this.tableData.length;
        })
    },
    // 获取当前页数
    curChange(val) {
      this.curPage = val;
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






