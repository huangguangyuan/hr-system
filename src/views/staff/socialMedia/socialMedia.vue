<template>
  <div class="socialMedia">
    <div class="addBtn-wrap" v-if="userRight" >
      <el-button type="primary" @click="addFun">添 加</el-button>
      <el-button type="danger" @click='handleDeleteAll'>删除所有</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="media" label="媒体名称"></el-table-column>
      <el-table-column prop="account" label="媒体账号"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px" v-if="userRight">
        <template slot-scope="scope">
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
    <!-- 添加 -->
    <el-dialog title="添加合同" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :curInfo="curInfo" :userRight_props="userRight" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
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
  name: "socialMedia",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      pageList:[],
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowLoading: false, //是否显示loading页
      userRight:false
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{//请求分页参数
            url:"/server/api/v1/staff/socialMedia/getAll",
            data:{ staffCode: this.staffInfo.code}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate).slice(0, 10);
        item.endDateTxt = item.endDate = this.$toolFn.timeFormat(item.endDate).slice(0, 10);
        if (item.endDate == "2100-01-01"){
          item.endDateTxt = "至今";
        }
        return item;
      });
    },
    staffInfo() {
      return this.$store.state.staffModule.staffInfo;
    }
  },
  mounted() {
    this.userRight = this.userRight_props;
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
        staffCode: this.staffInfo.code
      };
    },
    // 编辑
    editFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除单个
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/socialMedia/delete", { id: res.id }).then(res => {
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
          this.$myApi.http.post("/server/api/v1/staff/socialMedia/deleteByStaffCode", { staffCode:this.staffInfo.code }).then(res => {
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






