<template>
  <div class="holidaysApplyList">
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit" @click="addFun">请假申请</el-button>
    </el-button-group>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column sortable prop="createTime" label="申请时间" width="200"></el-table-column>
      <el-table-column sortable prop="totalDay" label="请假天数"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="扣除金额"></el-table-column>
      <el-table-column prop="isWithpayTxt" label="是否带薪"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-info"
            @click="handleDetails(scope.$index, scope.row)"
          >查看详情</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="scope.row.status < 3"
          >撤销请假</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"></page-info>
    <!-- 请假申请表单 -->
    <el-dialog title="请假申请表单" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
    <!-- 请假表单详情 -->
    <el-dialog title="请假申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <holidays-apply-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></holidays-apply-details>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
import holidaysApplyDetails from "./holidaysApplyDetails.vue";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    editLayer,holidaysApplyDetails,pageInfo
  },
  name: "holidaysApplyList",
  inject: ["reload"],
  props: ["staffCode_props"],
  data() {
    return {
      //tableData: [],
      pageList:[],
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      staffCode: this.staffCode_props
    };
  },
  computed:{
    pageInfo(){
      return {pageType:2,reqParams:{url:"/server/api/v1/staff/holidaysApply/staffHolidaysApplyList",data:{ staffCode: this.staffCode }}}
    },
    tableData(){
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.isBalanceTxt = item.isBalance == 1?'是':'否';
        item.isWithpayTxt = item.isWithpay == 1?'是':'否';
        return item;
      });
    }
  },
  mounted() {
  },
  methods: {
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
      this.isShowDetails = false;
    },
    // 新增
    addFun() {
      this.isShowAddAccess = true;
      this.curInfo.staffCode = this.staffCode;
    },
    // 查看详情
    handleDetails(index, res){
      this.isShowDetails = true;
      this.curInfo = res;
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("是否撤销该请假申请?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$http
            .post("/server/api/v1/staff/holidaysApply/recallApply", { holidaysApplyCode: res.code,staffCode:res.staffCode })
            .then(res => {
              if(res.data.code == 0){
                this.reload();
                this.$message.success("撤销成功！");
              }else{
                this.$message.error(res.data.msg);
              }
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
  // watch: {
  //     pageList(val) {//监听分页数据变化
  //       this.tableData = val.map(item => {
  //         item.createTime = this.$toolFn.timeFormat(item.createTime);
  //         item.isBalanceTxt = item.isBalance == 1?'是':'否';
  //         item.isWithpayTxt = item.isWithpay == 1?'是':'否';
  //         return item;
  //       });
  //     }
  //   }
};
</script>
<style scoped lang="scss">

</style>






