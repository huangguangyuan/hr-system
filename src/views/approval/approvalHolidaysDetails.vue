<template>
  <div class="approvalHolidaysDetails" v-loading="isShowLoading">
    <el-divider content-position="left">请假明细</el-divider>
    <div class="view-detail">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">申请人：{{holidayItem.nameChinese}}</el-card>
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
    <el-divider content-position="left">审批流程</el-divider>
    <el-timeline>
      <el-timeline-item v-for='(item,key) in approveHisList' :key='key' placement="top">
        <el-card class="my-card">
          <p>操作员：{{item.operatorUser.name}}{{item.operatorUser.roleName?" ( "+item.operatorUser.roleName+" ) ":""}}</p>
          <p>操作行为：{{item.operatorUser.tip}}</p>
          <p>审批类型：{{item.typeIdTxt}}</p>
          <p>是否完结：{{item.finishFlagTxt}}</p>
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
export default {
  name: "approvalHolidaysDetails",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
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
      this.holidayItem = await this.staffHolidays();
      this.holidayTypes = await this.getHolidaysTypeId();
      if (this.holidayItem.fileSrc && this.holidayItem.fileSrc != ''){
        this.fileList = this.holidayItem.fileSrc.split(',');
      }
      this.holidayItem.createTime = this.$toolFn.timeFormat(this.holidayItem.createTime);
      this.tableData = this.holidayItem.details.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate);
        item.endDate = this.$toolFn.timeFormat(item.endDate);
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
      this.isShowLoading = false;
    },
    async staffHolidays(){
      var reqUrl = "/server/api/v1/staff/holidaysApply/staffHolidaysApply";
      return await this.$myApi.post(reqUrl, {holidaysApplyCode:this.curInfo.code});
    },
    async getHolidaysTypeId(){
      var reqUrl = "/server/api/v1/staff/holidaysApply/getHolidaysApplyTypeId";
      return await this.$myApi.post(reqUrl);
    },
    openFile(item){
        let a = document.createElement('a')
          a.href = item;
          a.target = '_blank';
          a.click();
    },
    // 提交表单
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
}
</style>


