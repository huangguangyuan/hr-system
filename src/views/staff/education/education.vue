<template>
  <div class="education">
    <div class="addBtn-wrap" v-if="userRight">
      <el-button type="primary" @click="addFun">添 加</el-button>
      <el-button type="danger" @click='handleDeleteAll'>删除所有</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="school" label="学校"></el-table-column>
      <el-table-column prop="degree" label="学历及主修"></el-table-column>
      <el-table-column prop="startDate" label="入校时间"></el-table-column>
      <el-table-column prop="endDateTxt" label="结业时间"></el-table-column>
      <el-table-column prop="details" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
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
    <!-- 添加学历 -->
    <el-dialog :title="this.curInfo.type=='modify'?'修改学历':'增加学历'" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess"
        :curInfo="curInfo"
        :userRight_props="userRight"
        v-on:listenIsShowMask="listenIsShowMask"></editLayer>
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
  name: "education",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      isShow:false,
      pageList: [],
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowLoading: false, //是否显示loading页
      userRight:false
    };
  },
  computed: {
    staffInfo() {
      return this.$store.state.staffModule.staffInfo;
    },
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/staff/education/getAll",
            data:{staffCode: this.staffInfo.code }
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate,"yyyy-MM")
        item.endDateTxt = item.endDate = this.$toolFn.timeFormat(item.endDate,"yyyy-MM")
        if (item.endDate == "2100-01-01"){
          item.endDateTxt = "至今";
        }
        return item;
      });
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
      this.curInfo = {};
      this.curInfo.type = "add";
      this.curInfo.staffCode = this.staffInfo.code;
    },
    // 编辑
    editFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/education/delete", { id: res.id }).then(res => {
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
          this.$myApi.http.post("/server/api/v1/staff/education/deleteByStaffCode", { staffCode:this.staffInfo.code })
            .then(res => {
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






