<template>
  <div class="newsList wrap">
    <!-- 搜索 -->
    <el-button v-if="userRight" type="primary" @click='isShowEditLayer = true;curInfo.type="add"'>添加消息</el-button>
    
    <div class="search-wrap">
      <el-input placeholder="请输入关键字" v-model="filter.searchKey">
      <el-select
        v-model="typeId"
        slot="prepend"
        placeholder="请选择"
        style="width:200px;"
        @change="selectFun"
      >
        <el-option label="公开信息" value="1"></el-option>
        <el-option label="公司信息" value="2"></el-option>
      </el-select>
      </el-input>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column  prop="title" label="信息标题"></el-table-column>
      <el-table-column prop="content" label="信息内容"></el-table-column>
      <el-table-column sortable v-if="typeId == 2  && userInfo.lev >= 201" prop="companyName" label="公司名称"></el-table-column>
      <el-table-column sortable v-if="typeId == 2 && userInfo.lev >= 211" prop="regionName" label="区域名称"></el-table-column>
      <el-table-column sortable v-if="typeId == 2  && userInfo.lev >= 221" prop="BUName" label="单位名称"></el-table-column>
      <el-table-column sortable prop="createTimeTxt" label="发布时间"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
          v-if="userRight"
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="editFun(scope.$index, scope.row)"
          >修 改</el-button>
          <el-button
          v-if="userRight"
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="handleDelete(scope.$index, scope.row)"
          >删 除</el-button>
          <el-button v-if="!userRight"
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="editFun(scope.$index, scope.row)"
          >查 看</el-button>
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
    <!-- 编辑消息 -->
    <el-dialog
      :visible.sync="isShowEditLayer"
      :close-on-click-modal="false"
      width="55%"
    >
      <edit-layer
        v-on:listenIsShowMask="listenIsShowMask"
        :curInfo="curInfo"
        v-if="isShowEditLayer"
      ></edit-layer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
import { deflate } from "zlib";
import { truncate } from 'fs';
export default {
  name: "newsList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前内容
      typeId: "1", //消息类型
      isShowLoading: false, //是否显示loading页
      isShowEditLayer:false, //是否显示编辑消息页面
      filter:{searchKey:'',searchField:['title','content','companyName','regionName','BUName']},
      userInfo:{},
      userRight:false
    };
  },
  mounted() {
    this.typeId = this.$toolFn.sessionGet('newsTypeId') || "1";
    this.userInfo = this.$toolFn.localGet("userInfo");
    if (this.userInfo.roleTypeId == 3 ){
      this.userRight = true;
    }
    this.getData(parseInt(this.typeId));
  },
  methods: {
    //获取项目数据列表
    getData(typeId) {
      var _this = this;
      var reqUrl = "/server/api/v1/info/buInfos";
      var myData = { typeId: typeId };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
              item.typeIdTxt = item.typeId == 1?'公开信息':'指定信息';
              item.createTimeTxt = _this.$toolFn.timeFormat(item.createTime);
              //item.createTimeTxt = _this.$toolFn.timeFormat(item.createTime,"yyyy-MM-dd HH:mm:ss");
              return item;
            })
            .sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
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
    // 获取信息类型
    selectFun(val) {
      this.typeId = val;
      this.getData(parseInt(this.typeId));
      this.$toolFn.sessionSet("newsTypeId", val);
    },
    // 编辑页面
    editFun(index, res) {
      this.isShowEditLayer = true;
      this.curInfo = res;
      this.curInfo.userRight = this.userRight;
      this.curInfo.type = 'modify';
    },
    // 删除
    handleDelete(index, res) {
      var _this = this;
      _this
        .$confirm("此操作将永久删除该消息, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .post("/server/api/v1/info/buInfoDelete", { id: res.id })
            .then(res => {
              _this.reload();
              _this.$message.success("删除成功！");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
    },
    searchFun(list,search){
      let newList = [];
      for(let i = 0;i < list.length;i++){
        for(let key in list[i]) {
          if (search.searchField.indexOf(key) >= 0){
            if (list[i][key] != undefined && list[i][key] != '' && list[i][key].toString().includes(search.searchKey)){
              newList.push(list[i]);
              break;
            }
          }
        };
      }
      return newList;
    },
  },
  computed: {
    queryTableDate() {
      var _this = this;
      let tableData = _this.tableData;
      if (_this.filter.searchKey != ""){
        tableData = _this.searchFun(tableData,_this.filter);
      }
      _this.total = tableData.length;
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return tableData.slice(begin, end);
    },
    pageTotal() {
      var pageTotal = Math.ceil(this.total / this.pageSize);
      return pageTotal;
    }
  },
  components: {
    editLayer
  }
};
</script>
<style scoped lang="scss">
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }
}
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
</style>






