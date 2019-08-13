<template>
  <div class="claimDetails">
    <el-table :data="tableData" stripe>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="报销项目名称"></el-table-column>
      <el-table-column prop="amount" label="报销金额"></el-table-column>
      <el-table-column prop="typeIdTxt" label="报销类型"></el-table-column>
      <el-table-column prop="remarks" label="备 注"></el-table-column>
    </el-table>
    <el-divider></el-divider>
    <el-timeline>
      <el-timeline-item v-for='item in approveHisList' :key='item.id' :timestamp="item.createTime" placement="top">
        <el-card class="my-card">
          <p>下一级审批：{{item.nextOperatorName}}</p>
          <p>审批员等级：{{item.nextOperatorLev}}</p>
          <p>审批类型：{{item.typeIdTxt}}</p>
          <p>是否完结：{{item.finishFlagTxt}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  name: "claimDetails",
  props: ["curInfo"],
  data() {
    return {
      tableData: [],//数据列表
      getClaimList: [],//审批类型
      approveHisList:[],//审批流程
    };
  },
  mounted() {
    this.dataConvert().then(res => {
      this.curInfo.details.map(item => {
        item.typeIdTxt = res.filter(child => {
          return child.typeId == item.typeId;
        })[0].val;
        return item;
      });
      this.tableData = this.curInfo.details;
    });

    // 审批流程
    this.approveHisList = this.curInfo.approveHis.map(item => {
      item.createTime = this.$toolFn.timeFormat(item.createTime);
      item.nextOperatorName = item.nextOperator == null?'审批主管':item.nextOperator.name;
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
    // 数据转换,用于把类型转换成对应的文字
    dataConvert() {
      var _this = this;
      var p = new Promise(function(resolve, reject) {
        var reqUrl = "/server/api/v1/staff/claim/getClaimTypeId";
        _this.$http.post(reqUrl, {}).then(res => {
          if (res.data.code == 0) {
            _this.getClaimList = res.data.data;
            resolve(_this.getClaimList);
          }
        });
      });
      return p;
    }
  }
};
</script>
<style scoped lang="scss">
.claimDetails{
  .my-card{
    p{
      margin-top: 10px;
    }
  }
}
</style>


