<template>
  <div class="holidaysApplyDetails">
    <el-table :data="tableData" stripe>
      <el-table-column prop="startDate" label="开始时间" width="200"></el-table-column>
      <el-table-column prop="endDate" label="结束时间" width="200"></el-table-column>
      <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
      <el-table-column prop="remarks" label="备 注"></el-table-column>
    </el-table>
    <div class="stepSet">
      <el-divider content-position="left">审批流程</el-divider>
        <el-steps :active="step" align-center >
          <el-step title="申请"></el-step>
          <el-step title="主管审批"></el-step>
          <el-step title="人事审批"></el-step>
          <el-step title="结算（完成）"></el-step>
        </el-steps>
    </div>
    <el-timeline>
      <el-timeline-item v-for='item in approveHisList' :key='item.id' :timestamp="item.creatorTime" placement="top">
        <el-card class="my-card">
          <p>操作员：{{item.operatorUser.name}}</p>
          <p>操作行为：{{item.operatorUser.tip}}</p>
          <p>审批类型：{{item.typeIdTxt}}</p>
          <p>是否完结：{{item.finishFlagTxt}}</p>
          <p v-if="item.remarks != ''">备注：{{item.remarks}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  name: "holidaysApplyDetails",
  props: ["curInfo"],
  data() {
    return {
      tableData: [],
      getClaimList: [],
      approveHisList:[],//审批流程
      step:1,
    };
  },
  mounted() {
    this.dataConvert().then(res => {
      this.curInfo.details.map(item => {
          item.typeIdTxt = res.filter(child => {
              return child.typeId == item.typeId;
          })[0].val;
          return item;
      })
      this.tableData = this.curInfo.details.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate);
        item.endDate = this.$toolFn.timeFormat(item.endDate);
        return item;
      });
      this.step = this.curInfo.status > 5?5:this.curInfo.status;
      if(this.curInfo.status == 999){
        this.step = 0;
      }
    });
    // 审批流程
    this.approveHisList = this.curInfo.approveHis.map(item => {
      item.creatorTime = this.$toolFn.timeFormat(item.creatorTime);
      item.finishFlagTxt = item.finishFlag == 0?'否':'是';
      switch(item.typeId){
        case 1:
          item.typeIdTxt = '批准';
          break;
        case 2:
          item.typeIdTxt = '不批准';
          break;
        case 3:
          item.typeIdTxt = '转派';
          break;
        case 90:
          item.typeIdTxt = '撤回';
          break;
        case 99:
          item.typeIdTxt = '新建';
          break;
        case 100:
          item.typeIdTxt = '结算';
          break;
        default:
          item.typeIdTxt = '未知';
      }
      return item;
    });
  },
  methods: {
    // 数据转换
    dataConvert() {
      var _this = this;
      var p = new Promise(function(resolve, reject) {
        var reqUrl = "/server/api/v1/staff/holidaysApply/getHolidaysApplyTypeId";
        _this.$http.post(reqUrl, {}).then(res => {
          if (res.data.code == 0) {
            _this.getClaimList = res.data.data;
            resolve(_this.getClaimList);
          }
        });
      });
      return p;
    },
  }
};
</script>
<style scoped lang="scss">
.holidaysApplyDetails{
  .my-card{
    p{
      margin-top: 10px;
    }
  }
    .stepSet{
    width: 100%;margin: 50px auto 30px;

  }
  .el-step__title{
      font-size: 14px;
      font-weight: normal;
  }
}
</style>


