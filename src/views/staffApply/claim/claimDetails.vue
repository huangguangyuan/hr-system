<template>
  <div class="claimDetails">
    <el-divider content-position="left">报销明细</el-divider>
    <div class="view-detail">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">申请时间：{{claimItem.createTime}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">结算金额：{{claimItem.totalAmount}}</el-card>
        </el-col>
        <el-col :span="8" v-if="fileList.length > 0">
          <el-card shadow="always">文件：
            <el-link class="margin" icon="el-icon-download"  v-for="(item,key) in fileList" :key="key" @click="openFile(item)">文件{{key+1}}</el-link> 
          </el-card>
        </el-col>
      </el-row>
      <br />
        <el-table :data="tableData" stripe>
        <el-table-column prop="title" label="项目名称"></el-table-column>
        <el-table-column prop="amount" label="报销金额"></el-table-column>
        <el-table-column prop="typeIdTxt" label="报销类型"></el-table-column>
        <el-table-column prop="remarks" label="备 注"></el-table-column>
      </el-table>
    </div>
    <br />
<el-divider content-position="left">审批流程</el-divider>
    <div class="stepSet">
        <el-steps :active="step" align-center >
          <el-step title="申请"></el-step>
          <el-step title="主管审批"></el-step>
          <!-- <el-step title="人事审批"></el-step>
          <el-step title="财务审批"></el-step> -->
          <el-step title="结算（完成）"></el-step>
        </el-steps>
    </div>

    <el-timeline>
      <el-timeline-item v-for='item in approveHisList' :key='item.id' :timestamp="item.createTime" placement="top">
        <el-card class="my-card">
          <p>操作员：{{item.operatorUser.name}}{{item.operatorUser.roleName?" ( "+item.operatorUser.roleName+" ) ":""}}</p>
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
  name: "claimDetails",
  props: ["curInfo"],
  data() {
    return {
      claimItem:{},
      tableData: [],//数据列表
      getClaimList: [],//审批类型
      approveHisList:[],//审批流程
      fileList:[],
      step:1
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
      this.claimItem = this.curInfo;
      if (this.claimItem.fileSrc && this.claimItem.fileSrc != ''){
        this.fileList = this.claimItem.fileSrc.split(',');
      }
      
      this.tableData = this.curInfo.details;
      this.step = this.curInfo.status > 5?5:this.curInfo.status;
      if(this.curInfo.status == 999){
        this.step = 0;
      }
      // 审批流程
      this.approveHisList = this.curInfo.approveHis.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
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
            item.typeIdTxt = '结算 ( 结算月份 '+ this.claimItem.balanceMon + " 月 " + (this.claimItem.totalAmount != 0?"， 总金额 ： " + this.claimItem.totalAmount + " 元 ":"" ) + " )" ;
            break;
          default:
            item.typeIdTxt = '未知';
        }
        return item;
      });
    });


  },
  methods: {
    openFile(item){
        let a = document.createElement('a')
          a.href = item;
          a.target = '_blank';
          a.click();
    },
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
<style lang="scss">
.claimDetails{
  .view-detail{
    width: 95%;
    margin: 0 auto;
    .el-card{
      margin-top:15px;
      .margin{
        margin:0 15px
      }
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


