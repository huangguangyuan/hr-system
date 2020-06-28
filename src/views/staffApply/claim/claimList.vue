<template>
  <div class="claimList">
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit" @click="addFun">报销申请</el-button>
    </el-button-group>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column sortable prop="createTime" label="申请时间"></el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="结算金额"></el-table-column>
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
            v-if="scope.row.status < 4"
          >撤销申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading" ></page-info>
    <!-- 报销申请表单 -->
    <el-dialog title="报销申请表单" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <editLayer v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
    <!-- 申请表单详情 -->
    <el-dialog title="报销申请详情" :visible.sync="isShowDetails" :close-on-click-modal="false">
      <claim-details v-if="isShowDetails" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></claim-details>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
import claimDetails from "./claimDetails.vue";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    editLayer,claimDetails,pageInfo
  },
  name: "claimList",
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
      return {pageType:2,reqParams:{url:"/server/api/v1/staff/claim/staffClaimList",data:{ staffCode: this.staffCode }}}
    },
    tableData(){
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime,"yyyy-MM-dd hh:mm");
        item.isBalanceTxt = item.isBalance == 1?'已结算':'未结算';
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
      this.$confirm("是否撤销该申请?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/claim/recallApply", { claimCode: res.code,staffCode:res.staffCode }).then(res => {
              if(res.data.code == 0){
                this.reload();
                this.$message.success("撤销成功！");
              }else{
                this.$message.error(res.data.msg);
              }
              
            });
        })
    },
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







