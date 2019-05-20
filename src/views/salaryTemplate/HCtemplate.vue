<template>
  <div class="wrap HCtemplate">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>公积金模板</span>
      <el-button type="primary" size="small" @click="isShowAdd = true;curInfo.type='add'">添加模板</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select
        v-model="cityCode"
        slot="prepend"
        placeholder="请选择"
        style="width:200px;"
        @change="changeCity"
      >
        <el-option label="全部" value=""></el-option>
        <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- 列表内容 -->
    <el-table :data="queryTableDate" stripe style="width: 100%" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
      <el-table-column prop="baseLower" label="基数下限"></el-table-column>
      <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
      <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
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
    <!-- 添加公积金模板 -->
    <el-dialog title="添加公积金模板" :visible.sync="isShowAdd" :close-on-click-modal="false">
      <addHCtemplate v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo" v-if="isShowAdd"></addHCtemplate>
    </el-dialog>
    <!-- 加载等待页 -->
    <loading-page v-if="isShowLoading"></loading-page>
  </div>
</template>
<script>
import addHCtemplate from "./addHCtemplate.vue";
import loadingPage from "@/components/loadingPage.vue";
export default {
  name: "HCtemplate",
  inject: ["reload"],
  data() {
    return {
      tableData: [], //列表数据
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      searchInner: "", //搜索关键字
      curInfo: {}, //传值给子组件
      cityList: [], //城市列表
      cityCode: "" //城市代号
    };
  },
  mounted() {
    var _this = this;
    _this.getAllData();
    _this.getCityList();
  },
  methods: {
    //获取城市数据列表
    getData() {
      var _this = this;
      var reqUrl = "/server/api/v1/cityHC/getByOptions";
      var myData = {
        cityCode: _this.cityCode
      };
      _this.isShowLoading = true;
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              switch (item.paymentId) {
                case 1:
                  item.paymentIdTxt = "公司";
                  break;
                case 2:
                  item.paymentIdTxt = "个人";
                  break;
                default:
                  item.typeIdTxt = "未知";
              }
              item.createTime = _this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
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
          _this.total = _this.tableData.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取所有城市数据列表
    getAllData(){
      var _this = this;
      var reqUrl = "/server/api/v1/cityHC/getAll";
      var myData = {
        cityCode: 'b39f8ec0-676f-11e9-93b3-31525099b521'
      };
      _this.isShowLoading = true;
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              switch (item.paymentId) {
                case 1:
                  item.paymentIdTxt = "公司";
                  break;
                case 2:
                  item.paymentIdTxt = "个人";
                  break;
                default:
                  item.typeIdTxt = "未知";
              }
              item.createTime = _this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
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
    // 获取城市列表
    getCityList() {
      var _this = this;
      var reqUrl = "/server/api/v1/city/getAll";
      var data = {};
      _this.$http.post(reqUrl, data).then(res => {
        _this.cityList = res.data.data;
      });
    },
    // 选择城市
    changeCity(val) {
      this.cityCode = val;
      if(val == ''){
        this.getAllData();
      }else{
        this.getData();
      }
    },
    // 检测是否关闭表单
    listenIsShowMask(res) {
      var _this = this;
      _this.isShowAdd = res;
    },
    // 编辑
    handleEdit(index, res) {
      var _this = this;
      _this.curInfo = res;
      _this.curInfo.type = "modify";
      _this.isShowAdd = true;
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
            .post("/server/api/v1/cityHC/delete", { id: res.id })
            .then(res => {
              _this.reload();
              _this.$message("取消成功~");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
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
    }
  },
  components: {
    loadingPage,
    addHCtemplate
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
}
.search {
  margin: 20px auto;
}
</style>






