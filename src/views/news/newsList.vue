<template>
  <div class="newsList wrap">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select
        v-model="typeId"
        slot="prepend"
        placeholder="请选择"
        style="width:200px;"
        @change="selectFun"
      >
        <el-option label="公开信息" value="1"></el-option>
        <el-option label="指定信息" value="2"></el-option>
      </el-select>

      <el-button type="primary" @click='isShowEditLayer = true;curInfo.type="add"'>添加消息</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="信息标题"></el-table-column>
      <el-table-column prop="content" label="信息内容"></el-table-column>
      <el-table-column prop="typeIdTxt" label="信息类型"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="editFun(scope.$index, scope.row)"
          >修 改</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="handleDelete(scope.$index, scope.row)"
          >删 除</el-button>
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
      title="编辑消息"
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
      isShowEditLayer:false //是否显示编辑消息页面
    };
  },
  mounted() {
    this.typeId = this.$toolFn.sessionGet('newsTypeId') || "1";
    this.getData(parseInt(this.typeId));
  },
  methods: {
    //获取项目数据列表
    getData(typeId) {
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
    }
  },
  computed: {
    queryTableDate() {
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return this.tableData.slice(begin, end);
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






