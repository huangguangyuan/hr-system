<template>
  <div class="holidaysApplyDetails">
    <el-divider content-position="left">请假明细</el-divider>
    <div class="view-detail">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">申请时间：{{holidayItem.createTime}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">请假天数：{{holidayItem.totalDay}}</el-card>
        </el-col>
        <el-col :span="8" v-if="holidayItem.totalAmount != 0">
          <el-card shadow="always">扣除金额：{{holidayItem.totalAmount}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">是否带薪：{{holidayItem.isWithpayTxt}}</el-card>
        </el-col>        
        <el-col :span="8" v-if="fileList.length > 0">
          <el-card shadow="always">文件：
            <el-link class="margin" icon="el-icon-download"  v-for="(item,key) in fileList" :key="key" @click="openFile(item)">文件{{key+1}}</el-link> 
          </el-card>
        </el-col>
      </el-row>
      <br />
      <el-table :data="tableData" stripe>
        <el-table-column prop="startDate" label="开始时间" width="200"></el-table-column>
        <el-table-column prop="endDate" label="结束时间" width="200"></el-table-column>
        <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
        <el-table-column prop="remarks" label="备 注"></el-table-column>
      </el-table>
    </div>

    <div class="stepSet">
      <el-divider content-position="left">审批流程</el-divider>
        <el-steps :active="step" align-center >
          <el-step title="申请"></el-step>
          <el-step title="审批"></el-step>
          <!-- <el-step title="人事审批"></el-step> -->
          <el-step title="结算（完成）"></el-step>
        </el-steps>
    </div>
    <el-timeline :reverse="true">
      <el-timeline-item v-for='item in approveHisList' :key='item.id' :timestamp="item.creatorTime" placement="top">
        <el-card class="my-card">
          <p>操作员：{{item.operatorUser.name}}{{item.operatorUser.roleName?" ( "+item.operatorUser.roleName+" ) ":""}}</p>
          <p>操作行为：{{item.operatorUser.tip}}</p>
          <p>状态：{{item.typeIdTxt}}</p>
          <!-- <p>是否完结：{{item.finishFlagTxt}}</p> -->
          <p v-if="item.remarks != ''">备注：{{item.remarks}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import {approveHisTypeTxt} from "@/lib/staticData.js";
export default {
  name: "holidaysApplyDetails",
  props: ["curInfo"],
  data() {
    return {
      holidayItem:{},
      tableData: [],
      getClaimList: [],
      approveHisList:[],//审批流程
      step:1,
      fileList:[],
      holidayTypes:[],
      
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    openFile(item){
        let a = document.createElement('a')
          a.href = item;
          a.target = '_blank';
          a.click();
    },
    async init(){
      this.holidayTypes = await this.$myApi.getHolidaysTypeId();
      this.curInfo.details.map(item => {
        item.typeIdTxt = this.holidayTypes.filter(child => {
            return child.typeId == item.typeId;
        })[0].val;
        return item;
      })
      this.holidayItem = this.curInfo;
      this.holidayItem.creatorTime = this.$toolFn.timeFormat(this.holidayItem.creatorTime,"yyyy-MM-dd hh:mm");;
      if (this.holidayItem.fileSrc && this.holidayItem.fileSrc != ''){
        this.fileList = this.holidayItem.fileSrc.split(',');
      }
      this.tableData = this.curInfo.details.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate,"yyyy-MM-dd hh:mm");
        item.endDate = this.$toolFn.timeFormat(item.endDate,"yyyy-MM-dd hh:mm");
        return item;
      });
      this.step = this.curInfo.status > 5?5:this.curInfo.status;
      if(this.curInfo.status == 999){
        this.step = 0;
      }
      // 审批流程
      this.approveHisList = this.curInfo.approveHis.map(item => {
        item.creatorTime = this.$toolFn.timeFormat(item.creatorTime);
        item.finishFlagTxt = item.finishFlag == 0?'否':'是';
        item.typeIdTxt = approveHisTypeTxt(item.typeId);
        if (item.typeId == 100){
          item.typeIdTxt +=  '( 结算月份 '+ this.holidayItem.balanceMon + " 月 " + (this.holidayItem.totalAmount != 0?"， 总金额 ： " + this.holidayItem.totalAmount + " 元 ":"" ) + " )"; 
        }
        return item;
      });
    },
  }
};
</script>
<style scoped lang="scss">
.holidaysApplyDetails{
  .view-detail{
    width: 95%;
    margin: 0 auto;
    .el-card{
      margin-top:15px;
      height: 60px;
      overflow: hidden;
      .margin{
        margin:0 15px
      }
    }
  }
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
  /deep/ .el-timeline-item:last-child .el-timeline-item__node{
        background: #E4E7ED !important;
  }
  /deep/ .el-timeline-item:first-child .el-timeline-item__node{
        background: #ff6600 !important;
  }
}
</style>


