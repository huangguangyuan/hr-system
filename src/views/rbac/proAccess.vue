<template>
  <div class="wrap proAccess">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>管理权限操作</span>
      <el-button type="warning" size="small" @click='isShowAddAccess = true'>添加权限</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" icon="el-icon-plus" type="primary">新增子权限</el-button>
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
    <!-- 添加权限 -->
    <el-dialog title="添加权限" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <add-access v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></add-access>
    </el-dialog>
    <!-- 添加子权限 -->
    <el-dialog title="添加子权限" :visible.sync="isShowAddChildAccess" :close-on-click-modal="false">
      <add-child-access v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></add-child-access>
    </el-dialog>
  </div>
</template>
<script>
import addAccess from './addAccess.vue'
import addChildAccess from './addChildAccess.vue'
export default {
  name: "proAccess",
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo:{},//当前内容
      isShowAddAccess:false,//是否显示新增权限页面
      isShowAddChildAccess:false,//是否显示新增子权限页面
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
      var reqUrl = "/server/api/v1/projectAccess/getAllWithNodes";
      var myData = {"typeId":1};
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.tableData = res.data.data.map(item => {
            item.createTime = _this.$toolFn.timeFormat(item.createTime);
            item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
            item.children = item.nodes
            return item;
          })//倒序
          .sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
            });;
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
    // 接收子组件发送信息
    listenIsShowMask(res){
      this.isShowAddAccess = false;
    },
    // 添加子权限
    addChildAccessFun(index,res){

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
    addAccess,addChildAccess
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






