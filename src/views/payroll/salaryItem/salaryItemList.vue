<template>
  <div class="salaryItemList">
    <el-page-header @back="goBack" content="额外应税项目"></el-page-header>
    <el-divider></el-divider>
    <!-- 头部内容 -->
    <div class="my-top">
      <el-button type="primary" @click="addFun" v-if="userRight.indexOf(2) >= 0">添 加</el-button>
      <el-button type="danger" @click="deleteAll" v-if="userRight.indexOf(2) >= 0">删除所有</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe>
      <el-table-column sortable prop="name" label="应税项目"></el-table-column>
      <!-- <el-table-column sortable prop="taxableTxt" label="是否应税"></el-table-column> -->
      <el-table-column sortable prop="amount" label="应税金额"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="是否生效"></el-table-column>
      <el-table-column prop="remarks" label="备 注"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button size="mini" icon="el-icon-edit" @click="modifyFun(scope.$index, scope.row)" v-if="userRight.indexOf(2) >= 0">编辑</el-button>
          <!-- 删除 -->
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="userRight.indexOf(2) >= 0"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>

    <!-- 新增 -->
    <el-dialog
      title="新增应税项目"
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
  name: "salaryItemList",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      userRight:[],
      pageList: [],
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      isShowLoading: false, //是否显示loading页
      isShowEditLayer: false, //是否显示新增页面
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/staff/salaryItem/getAll",
            data:{staffCode: this.payrollInfo.code,taxable:1}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.statusTxt = item.status == '1'?'是':'否';
        item.taxableTxt = item.taxable == '1'?'是':'否';
        return item;
      });
    },
    payrollInfo() {
      return this.$store.state.payrollModule.payrollInfo;
    }
  },
  mounted() {
    this.userRight = this.userRight_props;
  },
  methods: {
    // 新增专项扣除
    addFun() {
      this.isShowEditLayer = true;
      this.curInfo = {
        staffCode: this.payrollInfo.code,
        BUCode: this.payrollInfo.BUCode,
        taxable:1,
        type: "add"
      };
    },
    // 编辑
    modifyFun(index, res) {
      this.isShowEditLayer = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.curInfo.taxable = 1;
      this.curInfo.BUCode = this.payrollInfo.BUCode;
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/salaryItem/delete", { id: res.id }).then(() => {
              this.reload();
              this.$message.success("删除成功");
            });
        })
    },
    // 删除所有
    deleteAll() {
      this.$confirm("是否确认删除所有数据？", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$myApi.http.post("/server/api/v1/staff/salaryItem/deleteByStaffCode", { staffCode: this.payrollInfo.code }).then(() => {
              this.reload();
              this.$message.success("删除成功");
            });
        })
    },
    // 改变状态
    changStatus(res){
      var reqUrl = '/server/api/v1/staff/deduction/update';
      var data = {
        id:res.id,
        staffCode:res.staffCode,
        status:res.status
      }
      this.$myApi.http.post(reqUrl,data).then(() => {})
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
    },
    // 返回
    goBack() {
      this.$store.commit({
        type: "getPayrollInfo",
        payrollKey: "payrollList"
      });
    }
  }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.deductionList {
  .photo {
    width: 35px;
    height: 35px;
    border-radius: 5px;
  }
}
</style>






