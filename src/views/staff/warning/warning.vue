<template>
  <div class="warning">
    <div class="addBtn-wrap" v-if="userRight">
      <el-button type="primary" @click="addFun">添 加</el-button>
      <el-button type="danger" @click='handleDeleteAll'>删除所有</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column prop="hrName" label="发起人"></el-table-column>
      <el-table-column sortable prop="issueTime" label="发起时间"></el-table-column>
      <el-table-column prop="contents" label="内容"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope" >
          <el-button size="mini" icon="el-icon-edit" @click="editFun(scope.$index, scope.row)">{{ userRight ?"编辑":"查看"}}</el-button>
          <el-button v-if="userRight"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 添加学历 -->
    <el-dialog title="警告信" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :userRight_props="userRight" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
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
  name: "warning",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      pageList:[],
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowLoading: false, //是否显示loading页
      userRight:false,
      staffCode:"",
      userInfo:{}
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/staff/warning/getAll",
            data:{ typeId:2}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.issueTime = this.$toolFn.timeFormat(item.issueTime,"yyyy-MM-dd")
        return item;
      });
    },
    staffInfo() {
      return this.$store.state.staffModule.staffInfo;
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    this.userRight = this.userRight_props;
    if (this.userInfo.roleTypeId != 1){
      this.pageInfo.reqParams.data.staffCode = this.staffInfo.code;
    }else{
      this.pageInfo.reqParams.data.staffCode = this.userInfo.staffCode;
    }
    this.pageInfo.reqParams.isReq = true;
    this.$refs.pageInfo.getData(this.pageInfo);
    
  },
  methods: {
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
    },
    // 新增
    addFun() {
      this.isShowAddAccess = true;
      this.curInfo = {
        type: "add",
        staffCode: this.staffInfo.code,
        issueBy:this.userInfo.userCode,
        BUCode:this.staffInfo.BUCode
      };
    },
    // 编辑
    editFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.curInfo.BUCode = this.staffInfo.BUCode;
      this.curInfo.showText = false;
      this.curInfo.issueBy = this.userInfo.userCode;
      if (this.userInfo.roleTypeId == 1){
        this.curInfo.showText = true;
      }
    },
    // 删除单个
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/warning/delete", { id: res.id }).then(res => {
              this.reload();
              this.$message.success("删除成功！");
            });
        })
    },
    // 删除所有
    handleDeleteAll() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/warning/deleteByStaffCode", { staffCode:this.staffInfo.code }).then(res => {
              this.reload();
              this.$message.success("删除成功！");
            });
        })
    }
  }
};
</script>
<style scoped lang="scss">
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.addBtn-wrap {
  margin: 10px auto;
  display: flex;
  justify-content: flex-end;
}
</style>






