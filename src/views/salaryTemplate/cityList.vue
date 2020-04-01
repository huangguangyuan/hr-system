<template>
  <div class="wrap cityList"  v-if="isShow">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>主要城市列表</span>
      <el-button type="primary" size="small" @click="isShowAddCity = true;curInfo.type='add'">添加城市</el-button>
    </div>
    <!-- 搜索 -->
    <bus-and-search :busAndSearch_props="busAndSearch" ref="busAndSearch"></bus-and-search>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="tableData" stripe style="width: 100%" border>
      <el-table-column sortable prop="name" label="城市名称"></el-table-column>
      <el-table-column sortable prop="remarks" label="备注"></el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间"></el-table-column>
      <el-table-column sortable prop="modifyTime" label="修改时间"></el-table-column>
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
    <!-- 新增项目 -->
    <el-dialog title="新增项目" :visible.sync="isShowAddCity" :close-on-click-modal="false">
      <add-city v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo" v-if="isShowAddCity"></add-city>
    </el-dialog>
  </div>
</template>
<script>
import addCity from "./addCity.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    addCity,pageInfo,busAndSearch
  },
  name: "cityList",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList: [],
      isShowAddCity: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      curInfo: {}, //传值给子组件
      filter:{searchKey:'',searchField:['name','roleCode']}
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{//请求分页参数
            url:"/server/api/v1/city/getAll",
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
      this.isShowAddCity = res;
    },
    // 编辑
    handleEdit(index, res) {
      this.curInfo = res;
      this.curInfo.type='modify';
      this.isShowAddCity = true;
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/city/delete", { id: res.id }).then(res => {
              this.reload();
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






