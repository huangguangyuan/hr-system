<template>
  <div class="schemeSI">
    <!-- 头部内容 -->
    <div class="my-top">
      <el-button type="primary" size="small" @click="handleAdd(curInfo.code)">添加模板</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe style="width: 100%" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
      <el-table-column prop="baseLower" label="基数下限"></el-table-column>
      <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
      <el-table-column prop="typeIdTxt" label="类型"></el-table-column>
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
    <!-- 添加社保 -->
    <el-dialog title="添加社保" append-to-body :visible.sync="isShowAdd" :close-on-click-modal="false">
      <schemeSIAdd v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfoNode" v-if="isShowAdd"></schemeSIAdd>
    </el-dialog>
  </div>
</template>
<script>
import schemeSIAdd from './schemeSIAdd.vue';
export default {
  name: "schemeSI",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      tableData: [], //列表数据
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      curInfoNode: {}, //传值给子组件
      cityCode: "" //城市代号
    };
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    // 获取所有数据列表
    getAllData() {
      var reqUrl = "/server/api/v1/bu/insuredScheme/si/list";
      var myData = {
        schemeCode: this.curInfo.code
      };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          console.log(res);
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
              switch (item.typeId) {
                case 1:
                  item.typeIdTxt = "养老";
                  break;
                case 2:
                  item.typeIdTxt = "医疗";
                  break;
                case 3:
                  item.typeIdTxt = "工伤";
                  break;
                case 4:
                  item.typeIdTxt = "生育";
                  break;
                case 5:
                  item.typeIdTxt = "失业";
                  break;
                case 6:
                  item.typeIdTxt = "大病";
                  break;
              }
              item.paymentIdTxt = item.paymentId == '1'?'公司':'个人';
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
    // 监听子组件发过的触发函数
    listenIsShowMask(res) {
      this.isShowAdd = res;
      this.getAllData();
      console.log(res);
    },
    // 添加模板
    handleAdd(res){
      this.curInfoNode = {
        type:'add',
        schemeCode:res
      }
      this.isShowAdd = true;
    },
    // 编辑
    handleEdit(index, res) {
      this.curInfoNode = res;
      this.curInfoNode.type = 'modify';
      this.curInfoNode.cityCode = this.curInfo.cityCode;
      this.isShowAdd = true;
    },
    // 查询
    searchFun() {},
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/server/api/v1/bu/insuredScheme/si/delete", { id: res.id })
            .then(res => {
              this.getAllData();
              this.$message.success("删除成功~");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
    schemeSIAdd
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
.el-table {
  margin: 30px auto 0;
}
</style>






