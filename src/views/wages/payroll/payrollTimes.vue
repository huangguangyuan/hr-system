<template>
  <div class="deductionList">
    <el-page-header @back="goBack" :content="payrollMainInfo.nameChinese+'-多次出粮列表'"></el-page-header>
    <el-divider></el-divider>
    <!-- 头部内容 -->
    <div class="my-top">
      <el-button type="primary" @click="addFun">添 加</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="totalAmount" label="出粮金额"></el-table-column>
      <el-table-column prop="isInsured" label="是否包含缴纳"></el-table-column>
      <el-table-column prop="payDay" label="出粮日期"></el-table-column>
      <el-table-column prop="status" label="是否生效"></el-table-column>
      <el-table-column prop="adjAmount" label="调整金额"></el-table-column>
      <el-table-column prop="typeTxt" label="状态"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button size="mini" icon="el-icon-edit" @click="modifyFun(scope.$index, scope.row)">确认粮单</el-button>
          <el-button size="mini" icon="el-icon-edit" @click="modifyFun(scope.$index, scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 新增 -->
    <el-dialog
      title="新增出粮项目"
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
import editLayer from "./payrollTimesEditLayer.vue";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    editLayer,pageInfo
  },
  name: "deductionList",
  inject: ["reload"],
  data() {
    return {
      pageList: [],
      curInfo: {}, //当前内容
      isShowLoading: false, //是否显示loading页
      isShowEditLayer: false //是否显示新增页面
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/payroll/staff/payrollTimesList",
            data:{payrollCode: this.payrollMainInfo.code}
          }
        }
    },
    tableData(){
      let id = 1;
      return this.pageList.map(item => {
        item.id = id;
        id++;
        return item;
      });
    },
    payrollMainInfo() {
      return this.$store.state.payrollModule.payrollMainInfo;
    }
  },
  mounted() {
  },
  methods: {
    // 新增专项扣除
    addFun() {
      this.isShowEditLayer = true;
      this.curInfo = this.payrollMainInfo;
    },
    // 编辑
    modifyFun(index, res) {
      this.isShowEditLayer = true;
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
          this.$myApi.http.post("/server/api/v1/payroll/staff/payrollTimesDelete", { id: res.id }).then(res => {
              this.reload();
              this.$message.success("删除成功~");
            });
        })
    },
    // 改变状态
    changStatus(res) {
      var reqUrl = "/server/api/v1/staff/deduction/update";
      var data = {
        id: res.id,
        staffCode: res.staffCode,
        status: res.status
      };
      this.$myApi.http.post(reqUrl, data).then(res => {});
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
    },
    // 返回
    goBack() {
      this.$store.commit({
        type: "setPayrollMainKey",
        payrollMainKey: "staffPayrollList"
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
</style>






