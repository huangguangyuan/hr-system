<template>
  <div class="wrap departmentList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>部门列表</span>
      <el-button type="warning" size="small" @click="isShowAddAccess = true;curInfo.type='add'">添加部门</el-button>
    </div>
    <!-- 搜索 -->
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id" border>
      <el-table-column sortable prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column sortable prop="isStatus" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click='modifyFun(scope.$index, scope.row)'>编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="addChildAccessFun(scope.$index, scope.row)"
          >增加从属部门</el-button>
          <el-button
            size="mini"
            icon="el-icon-warning"
            @click="forbidden(scope.$index, scope.row)"
          >{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 添加部门 -->
    <el-dialog :title="curInfo.type=='modify'?'编辑部门':'新增部门'" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editTemplate v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editTemplate>
    </el-dialog>
    <!-- 添加从属部门 -->
    <el-dialog title="添加从属部门" :visible.sync="isShowAddChild" :close-on-click-modal="false">
      <add-children v-if="isShowAddChild" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></add-children>
    </el-dialog>
  </div>
</template>
<script>
import editTemplate from "./editTemplate.vue";
import addChildren from "./addChildren.vue";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    editTemplate,addChildren,pageInfo,busAndSearch
  },
  name: "departmentList",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList:[],
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      regionBUList:[],//单位列表
      BUCodeSelected: "", //单位code
      isShowAddAccess: false, //是否显示新增权限页面
      isShowAddChild: false, //是否显示新增子权限页面
      isShowLoading: false, //是否显示loading页
      filter:{searchKey:'',searchField:['name','description']}
    };
  },
  mounted() {
    if (this.$toolFn.curUser.roleTypeId == 2){
      this.isShow = true;
    }
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{//请求分页参数
            isReq:false,
            url:"/server/api/v1/buDepartment/getAllWithNodes",
            data:{BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter};
    },
    tableData(){
      return this.mapFun(this.pageList);
    }
  },
  methods: {
    //获取项目数据列表
    getData(BUCode) {
      var reqUrl = "/server/api/v1/buDepartment/getAllWithNodes";
      var myData = { BUCode: BUCode };
      this.isShowLoading = true;
      this.$myApi.http.post(reqUrl, myData).then(res => {
        if (res.data.code == 0) {
          this.isShowLoading = false;
          this.tableData = this.mapFun(res.data.data);
          this.total = this.tableData.length;
        }
      })
    },
    // 循环数据列表获取属性
    mapFun(objArr) {
      return objArr.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
        item.isStatus = item.status == 1 ? "启用" : "禁用";
        item.children = item.nodes;
        if (item.children != 0) {
          this.mapFun(item.children);
        }
        return item;
      });
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
      this.isShowAddChild = false;
    },
    // 获取单位列表
    selectFun(val) {
      this.BUCode = val;
      this.getData(this.BUCode);
      this.$toolFn.sessionSet('departmentBUCode',val);
    },
    // 修改权限
    modifyFun(index, res) {
      this.curInfo = res;
      this.curInfo.type = 'modify';
      this.isShowAddAccess = true;
    },
    // 添加子权限
    addChildAccessFun(index, res) {
      this.isShowAddChild = true;
      this.curInfo = res;
    },
    // 禁用
    forbidden(index, res) {
      var reqUrl = "/server/api/v1/buDepartment/update";
      var data = { id: res.id };
      var txt = "";
      if (res.status == 1) {
        data.status = 0;
        txt = "此操作将禁用, 是否继续?";
      } else {
        data.status = 1;
        txt = "此操作将启用, 是否继续?";
      }
      this.$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post(reqUrl, data).then(res => {
            if (res.data.code == 0) {
            this.reload();
            }
          });
        })
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/buDepartment/delete", { id: res.id }).then(res => {
              this.reload();
              this.$message.success('删除成功！');
            });
        })
    }
  },
  watch: {
    BUCodeSelected: {
      handler: function(newVal) {
            this.pageInfo.reqParams.isReq = true;
            this.$refs.pageInfo.getData(this.pageInfo);
      }
    },
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
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>






