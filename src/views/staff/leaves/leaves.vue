<template>
  <div class="leaves">
    <div class="addBtn-wrap" v-if="userRight">
      <el-button type="primary" @click="addFun">添 加</el-button>
      <el-button type="danger" @click='handleDeleteAll'>删除所有</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id"  show-summary sum-text="合计">
      <el-table-column sortable prop="applyDate" label="变动日期"></el-table-column>
      <el-table-column prop="applyDay" label="变动天数"></el-table-column>
      <el-table-column prop="remarks" label="内容"></el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 增加年假 -->
    <el-dialog title="编辑年假" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
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
  name: "leaves",
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
            url:"/server/api/v1/staff/holidaysApply/staffLeaves",
            data:{ typeId:2}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.applyDate = this.$toolFn.timeFormat(item.applyDate).slice(0, 10);
        return item;
      });
    },
    staffInfo() {
      return this.$store.state.staffModule.staffInfo;
    }
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.roleTypeId != 1){
      this.pageInfo.reqParams.data.staffCode = this.staffInfo.code;
    }else{
      this.pageInfo.reqParams.data.staffCode = this.userInfo.staffCode;
    }
    this.pageInfo.reqParams.isReq = true;
    this.$refs.pageInfo.getData(this.pageInfo);
    //this.getData(this.staffCode);
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
        BUCode:this.staffInfo.BUCode,
        applyDay:this.userInfo.applyDay,
        applyDate:this.userInfo.applyDate,
        remarks:this.userInfo.remarks,
        
      };
    },
    // 编辑
    editFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.curInfo.BUCode = this.staffInfo.BUCode;
      this.curInfo.showText = false;
      this.curInfo.applyDate = this.userInfo.applyDate;
      if (this.userInfo.roleTypeId == 1){
        this.curInfo.showText = true;
      }
    },
    // 删除所有
    handleDeleteAll() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/holidaysApply/staffLeaves/deleteByStaffCode", { staffCode:this.staffInfo.code,typeId:2 }).then(res => {
              if (res.data.code == 0){
                this.reload();
                this.$message.success("删除成功！");
              }else{
                this.$message.error("删除失败，请联系管理员。");
              }
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






