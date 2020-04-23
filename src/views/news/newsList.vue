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
    <el-table v-loading="isShowLoading" :data="tableData" stripe>
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
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
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
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    editLayer,pageInfo
  },
  name: "newsList",
  inject: ["reload"],
  data() {
    return {
      pageList: [],
      curInfo: {}, //当前内容
      typeId: "1", //消息类型
      isShowLoading: false, //是否显示loading页
      isShowEditLayer:false, //是否显示编辑消息页面
      filter:{searchKey:'',searchField:['title','content','companyName','regionName','BUName']},
      userInfo:{},
      userRight:false
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/info/buInfos",
            data:{typeId: parseInt(this.typeId)}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.typeIdTxt = item.typeId == 1?'公开信息':'指定信息';
        item.createTimeTxt = this.$toolFn.timeFormat(item.createTime);
        return item;
      });
    }
  },
  mounted() {
    this.typeId = this.$toolFn.sessionGet('newsTypeId') || "1";
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.roleTypeId == 3 ){
      this.userRight = true;
    }
    //this.getData(parseInt(this.typeId));
  },
  methods: {
    //获取项目数据列表
    getData(typeId) {
      var reqUrl = "/server/api/v1/info/buInfos";
      var myData = { typeId: typeId };
      this.isShowLoading = true;
      this.$myApi.http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
              item.typeIdTxt = item.typeId == 1?'公开信息':'指定信息';
              item.createTimeTxt = this.$toolFn.timeFormat(item.createTime);
              return item;
            })
          this.total = this.tableData.length;
        })
    },
    // 获取信息类型
    selectFun(val) {
      this.typeId = val;
      this.$refs.pageInfo.getData(this.pageInfo);
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
      this.$confirm("此操作将永久删除该消息, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$myApi.http.post("/server/api/v1/info/buInfoDelete", { id: res.id }).then(res => {
              this.reload();
              this.$message.success("删除成功！");
            });
        })
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
    },
  }
};
</script>
<style scoped lang="scss">
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
</style>