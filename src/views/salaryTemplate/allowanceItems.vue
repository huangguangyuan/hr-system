<template>
  <div class="wrap STitems" v-if="isShow">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>津贴项目</span>
      <el-button type="primary" size="small" @click="isShowAdd = true;curInfo.type='add'">添加项目</el-button>
    </div>
    <!-- 搜索 -->
    <bus-and-search :busAndSearch_props="busAndSearch" ref="busAndSearch"></bus-and-search>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="tableData" stripe style="width: 100%" border>
      <el-table-column sortable prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 添加津贴项目 -->
    <el-dialog title="添加津贴项目" :visible.sync="isShowAdd" :close-on-click-modal="false">
      <addAllowanceItems v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo" v-if="isShowAdd"></addAllowanceItems>
    </el-dialog>
  </div>
</template>
<script>
import addAllowanceItems from "./addAllowanceItems.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    addAllowanceItems,pageInfo,busAndSearch
  },
  name: "allowanceItems",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList: [],
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      curInfo: {}, //传值给子组件
      filter:{searchKey:'',searchField:['name']}
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/allowance/getAll",
            data:{}
          }
        }
    },
    busAndSearch(){
      return {BUCodeOptionsShow:false,filter:this.filter};
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
    if ([3].indexOf(this.$toolFn.curUser.roleTypeId) >= 0){//如果是平台管理员和用户管理员
      this.isShow = true;
    }
  },
  methods: {
    // 检测是否关闭表单
    listenIsShowMask(res) {
      this.isShowAdd = res;
    },
    // 编辑
    handleEdit(index, res) {
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.isShowAdd = true;
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/allowance/delete", { id: res.id }).then(() => {
              this.reload();
              this.$message('取消成功');
            });
        })
    },
  },
   watch: {
    "filter.searchKey":{
      handler: function() {
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






