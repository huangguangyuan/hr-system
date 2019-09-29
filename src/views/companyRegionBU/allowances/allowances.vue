<template>
  <div class="allowances">
    <div class="addBtn-wrap">
      <el-select v-model="allowanceIds" multiple placeholder="请选择津贴项目模板" class='selectCode'>
        <el-option
          v-for="item in allowanceTemplateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="addFun">确认添加</el-button>
      <el-button type="primary" @click="newAddFun">新 增</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe row-key="id">
      <el-table-column prop="name" label="薪资项目"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
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
    
    <!-- 新增津贴项目项目 -->
    <el-dialog title="新增津贴项目项目" :visible.sync="isShowEdit" :close-on-click-modal="false" width="65%">
      <edit-layer v-if='isShowEdit' v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></edit-layer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from './editLayer.vue'
export default {
  name: "allowances",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //记录当前内容信息
      allowanceTemplateList: [], //津贴项目项目列表
      allowanceIds: [], //津贴项目项目ID列表
      isShowEdit: false, //是否显示新增权限页面
      isShowLoading: false //是否显示loading页
    };
  },
  mounted() {
    this.getData(this.BUInfo.code);
    this.getAllowanceTemplate();
  },
  methods: {
    //获取数据列表
    getData(BUCode) {
      var reqUrl = "/server/api/v1/bu/allowances";
      var myData = { BUCode: BUCode };
      this.isShowLoading = true;
      this.$http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.map(item => {
              item.createTime = this.$toolFn.timeFormat(item.createTime).slice(0, 10);
              item.taxableTxt = item.taxable == '1'?'是':'否';
              return item;
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取薪资应对项目模板
    getAllowanceTemplate() {
      var reqUrl = "/server/api/v1/allowance/getAll";
      this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.allowanceTemplateList = res.data.data;
        } else {
          this.$message.error(res.data.msg || res.data.code);
        }
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
    },
    // 添加津贴项目模板
    addFun() {
      if(this.allowanceIds.length == 0){
          this.$message.info('请选择津贴项目模板');
          return false;
      }
      var reqUrl = '/server/api/v1/bu/selectedAllowances';
      var data = {BUCode:this.BUInfo.code,allowanceIds:this.allowanceIds}
      this.$http.post(reqUrl,data).then(res => {
          if(res.data.code == 0){
              this.reload();
              this.$message.success('添加成功！');
          }else{
              //this.reload();
              this.$message.error(res.data.msg);
          }
      })
    },
    // 添加
    newAddFun(){
        this.curInfo.type = 'add';
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
            .post("/server/api/v1/bu/allowanceDelete", { code: res.code })
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
    editLayer
  }
};
</script>
<style scoped lang="scss">
.selectCode {
  width: 220px;
  margin-right: 10px;
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
</style>






