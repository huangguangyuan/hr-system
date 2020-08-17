<template>
  <div class="approvalHolidaysDetails" v-loading="isShowLoading">
    <el-collapse >
      <el-collapse-item>
         <template slot="title" >
           <div style="padding:0 10px;text-align:right;width:100%"><i class="header-icon el-icon-info"></i> 查看员工假期汇总</div>
        </template>
        <div style="width:95%;margin:10px auto;">
          <staff-holiday-stat :staffCode_props="this.curInfo.staffCode" ></staff-holiday-stat>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-divider content-position="left">请假明细</el-divider>
    <div class="view-detail" v-if="isShow" >
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">申请人：{{holidayItem.staff.nameChinese}}</el-card>
        </el-col>
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
    <br />
    <el-divider content-position="left">相关人员</el-divider>
    <div class="view-detail" v-if="isShow" >
      <el-row :gutter="12">
        <el-col :span="24">
          <el-card shadow="always" v-show="holidayItem.approveOfficerNameArr != ''">审批人员：{{holidayItem.approveOfficerNameArr}}</el-card>
        </el-col>
        <!-- <el-col :span="24">
          <el-card shadow="always" v-show="holidayItem.balanceOfficerNameArr != ''">结算人员：{{holidayItem.balanceOfficerNameArr}}</el-card>
        </el-col> -->
        <el-col :span="24">
          <el-card shadow="always" v-show="holidayItem.noticeOfficerNameArr != ''">抄送人员：{{holidayItem.noticeOfficerNameArr}}</el-card>
        </el-col>
      </el-row>
    </div><br />
    <el-divider content-position="left">审批流程</el-divider>
    <el-timeline :reverse="true">
      <el-timeline-item v-for='(item,key) in approveHisList' :key='key' placement="top" :timestamp="item.creatorTime">
        <el-card class="my-card">
          <p>操作员：{{item.operatorUser.name}}{{item.operatorUser.roleName?" ( "+item.operatorUser.roleName+" ) ":""}}</p>
          <p>操作行为：{{item.operatorUser.tip}}</p>
          <p>状态：{{item.typeIdTxt}}</p>
          <p>是否完结：{{item.finishFlagTxt}}</p>
          <p v-show="item.remarks !== ''">备注：{{item.remarks}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <!-- 审批 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      v-if="!isFinish && canApprove"
    >
      <el-form-item label="是否批准：" prop="approve">
        <el-radio-group v-model="ruleForm.approve">
          <el-radio label="1">批准</el-radio>
          <el-radio label="2">不批准</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {approveHisTypeTxt} from "@/lib/staticData.js";
import staffHolidayStat from "../staffApply/staffHolidayStat/staffHolidayStat.vue";
export default {
  components: {
    staffHolidayStat
  },
  name: "approvalHolidaysDetails",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isShow:false,
      isShowLoading:true,
      holidayItem:{},
      holidayTypes:[],
      tableData: [],
      getClaimList: [],
      approveHisList:[],//审批流程
      fileList:[],
      ruleForm: {
        approve: "",
        remarks: ""
      },
      isFinish:false,
      canApprove:false,
      rules: {
        approve: [
          { required: true, message: "请选择是否批准", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.init();
    this.canApprove = this.curInfo.canApprove;
  },
  methods: {
    async init(){
      this.holidayItem = await this.$myApi.staffHolidays({holidaysApplyCode:this.curInfo.code});
      this.holidayTypes = await this.$myApi.getHolidaysTypeId();
      if (this.holidayItem.fileSrc && this.holidayItem.fileSrc != ''){
        this.fileList = this.holidayItem.fileSrc.split(',');
      }
      this.holidayItem.createTime = this.$toolFn.timeFormat(this.holidayItem.createTime,"yyyy-MM-dd hh:mm");
      this.holidayItem.isWithpayTxt = this.holidayItem.isWithpay == 1?'是':'否';
      this.tableData = this.holidayItem.details.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate,"yyyy-MM-dd hh:mm");
        item.endDate = this.$toolFn.timeFormat(item.endDate,"yyyy-MM-dd hh:mm");
        item.typeIdTxt = this.holidayTypes.filter(child => {
              return child.typeId == item.typeId;
          })[0].val;
        return item;
      });
      // 审批流程
      this.approveHisList = this.holidayItem.approveHis.map(item => {
        item.creatorTime = this.$toolFn.timeFormat(item.creatorTime);
        item.finishFlagTxt = item.finishFlag == 0 ? "否" : "是";
        if (item.finishFlag == 1){
          this.isFinish = true;
        }
        item.typeIdTxt = approveHisTypeTxt(item.typeId);
        if (item.typeId == 100){
          item.typeIdTxt +=  '( 结算月份 '+ this.holidayItem.balanceMon + " 月 " + (this.holidayItem.totalAmount != 0?"， 总金额 ： " + this.holidayItem.totalAmount + " 元 ":"" ) + " )"; 
        }
        return item;
      });
      this.isShow = true;
      this.isShowLoading = false;
    },
    openFile(item){
        let a = document.createElement('a')
          a.href = item;
          a.target = '_blank';
          a.click();
    },
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.approveFun();
        } else {
          return false;
        }
      });
    },
    // 审批
    approveFun(){
      var reqUrl = '/server/api/v1/staff/holidaysApply/approve';
      var data = {
        hrCode:this.curInfo.hrCode,
        holidaysApplyCode:this.curInfo.code,
        approve:parseInt(this.ruleForm.approve),
        remarks:this.ruleForm.remarks
      }
      
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('操作成功！');
        }else{
          this.reload();
          this.$message.error(res.data.msg);
        }
      })
    }
  }
};
</script>
<style scoped lang="scss">
.approvalHolidaysDetails{
  .view-detail{
    width: 95%;
    margin: 0 auto;
    .el-card{
      margin-top:20px;
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
  /deep/ .el-timeline-item:last-child .el-timeline-item__node{
        background: #E4E7ED !important;
  }
  /deep/ .el-timeline-item:first-child .el-timeline-item__node{
        background: #ff6600 !important;
  }
  .el-collapse{
    border: 0;
  }
 /deep/ .el-collapse-item__header{
    border-bottom: 0;
  }
}
</style>


