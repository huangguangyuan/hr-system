<template>
  <div class="schemeList">
    <div class="addBtn-wrap">
      <el-select v-model="typeId" placeholder="请选择" class="typeId" @change='changeType'>
        <el-option label="社保" value="1"></el-option>
        <el-option label="公积金" value="2"></el-option>
        <el-option label="香港MPF" value="3"></el-option>
      </el-select>
      <el-button type="primary" @click="newAddFun">新 增</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="方案名称"></el-table-column>
      <el-table-column prop="typeIdTxt" label="类型"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" fixed="right" width="600px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="schemeSIFun(scope.$index, scope.row)"
            v-if="scope.row.typeId == '1'"
          >编辑社保</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="schemeHCFun(scope.$index, scope.row)"
            v-if="scope.row.typeId == '2'"
          >编辑公积金</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="isShowSchemeMPFFun(scope.$index, scope.row)"
            v-if="scope.row.typeId == '3'"
          >编辑香港MPF</el-button>
          <el-button size="mini" icon="el-icon-edit" @click="editFun(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
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

    <!-- 新增/编辑 -->
    <el-dialog title="新增/编辑方案" :visible.sync="isShowEdit" :close-on-click-modal="false" width="65%">
      <scheme-edit v-if="isShowEdit" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></scheme-edit>
    </el-dialog>
    <!-- 编辑社保 -->
    <el-dialog
      title="编辑社保"
      :visible.sync="isShowSchemeSI"
      :close-on-click-modal="false"
      width="65%"
    >
      <schemeSI v-if="isShowSchemeSI" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></schemeSI>
    </el-dialog>
    <!-- 编辑公積金 -->
    <el-dialog
      title="编辑公積金"
      :visible.sync="isShowSchemeHC"
      :close-on-click-modal="false"
      width="65%"
    >
      <schemeHC v-if="isShowSchemeHC" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></schemeHC>
    </el-dialog>
    <!-- 香港MPF -->
    <el-dialog
      title="香港MPF"
      :visible.sync="isShowSchemeMPF"
      :close-on-click-modal="false"
      width="65%"
    >
      <schemeMPF v-if="isShowSchemeMPF" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></schemeMPF>
    </el-dialog>
  </div>
</template>
<script>
import schemeEdit from "./schemeEdit.vue";
import schemeSI from "./schemeSI.vue";
import schemeHC from "./schemeHC.vue";
import schemeMPF from "./schemeMPF.vue";
export default {
  name: "schemeList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //记录当前内容信息
      typeId:'1',//方案类型
      isShowEdit: false, //是否显示新增
      isShowSchemeHC: false, //是否显示编辑公积金
      isShowSchemeSI: false, //是否显示编辑社保
      isShowSchemeMPF: false, //是否显示编辑香港MPF
      isShowLoading: false //是否显示loading页
    };
  },
  mounted() {
    this.getData(this.BUInfo.code);
  },
  methods: {
    //获取数据列表
    getData(BUCode) {
      var reqUrl = "/server/api/v1/insuredScheme/getAll";
      var myData = { BUCode: BUCode };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.filter(item => {
              return item.typeId == this.typeId;
            }).map(item => {
              switch (item.typeId) {
                case 1:
                  item.typeIdTxt = "社保";
                  break;
                case 2:
                  item.typeIdTxt = "公积金";
                  break;
                case 3:
                  item.typeIdTxt = "香港MPF";
                  break;
              }
              item.createTime = this.$toolFn
                .timeFormat(item.createTime)
                .slice(0, 10);
              return item;
            });
          }
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
    listenIsShowMask(res) {
      this.isShowEdit = false;
      this.isShowSchemeSI = false;
      this.isShowSchemeHC = false;
      this.isShowSchemeMPF = false;
    },
    // 添加
    newAddFun() {
      this.curInfo.type = "add";
      this.isShowEdit = true;
    },
    // 编辑
    editFun(index, res) {
      this.isShowEdit = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除
    handleDelete(index, res) {
      var _this = this;
      _this
        .$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .post("/server/api/v1/bu/salaryItemDelete", { code: res.code })
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
    // 选择方案类型
    changeType(res){
      this.typeId = res;
      this.getData(this.BUInfo.code);
    },
    // 编辑社保
    schemeSIFun(index, res) {
      this.curInfo = res;
      this.isShowSchemeSI = true;
    },
    // 编辑公積金
    schemeHCFun(index, res) {
      this.curInfo = res;
      this.isShowSchemeHC = true;
    },
    // 编辑香港MPF
    isShowSchemeMPFFun(index, res) {
      this.curInfo = res;
      this.isShowSchemeMPF = true;
    }
  },
  computed: {
    queryTableDate() {
      var _this = this;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return _this.tableData.slice(begin, end);
    },
    pageTotal() {
      var _this = this;
      var pageTotal = Math.ceil(_this.total / _this.pageSize);
      return pageTotal;
    },
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  },
  components: {
    schemeEdit,
    schemeSI,
    schemeHC,
    schemeMPF
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
  .el-input-group {
    width: 500px;
  }
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.addBtn-wrap {
  margin: 10px auto;
  display: flex;
}
.typeId{width: 200px;margin-right: 10px;}
</style>






