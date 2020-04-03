<template>
  <div class="approvalHolidaysDetails" v-loading="isShowLoading">
    <el-table :data="tableData" stripe>
      <el-table-column prop="num" label="序号" width="50"></el-table-column>
      <el-table-column prop="days" label="天数" width="50"></el-table-column>
      <el-table-column prop="startDate" label="开始时间" width="180"></el-table-column>
      <el-table-column prop="endDate" label="结束时间" width="180"></el-table-column>
      <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
      <el-table-column prop="remarks" label="备 注"></el-table-column>
    </el-table>
    <el-divider></el-divider>
    <el-timeline>
      <el-timeline-item v-for='item in approveHisList' :key='item.id' :timestamp="item.creatorTime" placement="top">
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
    >
      <el-form-item label="结算月份：" prop="balanceMon">
        <el-select v-model="ruleForm.balanceMon" placeholder="请选择月份">
          <el-option v-for="(item,key) in monthList" :key="key" :label="item.txt" :value="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扣除金额：" v-if='curInfo.isWithpay == 0'>
        <el-input type="text" v-model="ruleForm.totalAmount"></el-input>
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
import {approveHisTypeTxt,monthList} from "@/lib/staticData.js";
export default {
  name: "approvalHolidaysDetails",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isShowLoading:true,
      monthList:[],
      holidayItem:{},
      tableData: [],
      getClaimList: [],
      approveHisList:[],//审批流程
      ruleForm: {
        balanceMon: "",
        totalAmount:0,
        remarks: ""
      },
      rules: {
        balanceMon: [
          { required: true, message: "请选择结算月份", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.monthList = monthList();
    this.init();
  },
  methods: {
    async init(){
      this.holidayItem = await this.$myApi.staffHolidays({holidaysApplyCode:this.curInfo.code});
      this.holidayTypes = await this.$myApi.getHolidaysTypeId();

      this.holidayItem.createTime = this.$toolFn.timeFormat(this.holidayItem.createTime);
      this.tableData = this.holidayItem.details.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate);
        item.endDate = this.$toolFn.timeFormat(item.endDate);
        return item;
      });
      // 审批流程
      this.approveHisList = this.holidayItem.approveHis.map(item => {
        item.creatorTime = this.$toolFn.timeFormat(item.creatorTime);
        item.finishFlagTxt = item.finishFlag == 0?'否':'是';
        item.typeIdTxt = approveHisTypeTxt(item.typeId);
        return item;
      });
      this.isShowLoading = false;
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
    // 结算
    approveFun(){
      var reqUrl = '/server/api/v1/staff/holidaysApply/holidaysApplyBalance';
      var data = {
        hrCode:this.curInfo.hrCode,
        holidaysApplyCode:this.curInfo.code,
        balanceMon:parseInt(this.ruleForm.balanceMon),
        totalAmount:parseFloat(this.ruleForm.totalAmount),
        remarks:this.ruleForm.remarks
      }
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('操作成功！');
        }else{
          this.$message.error(res.data.msg);
        }
      })
    }
  }
};
</script>
<style scoped lang="scss">
.approvalHolidaysDetails{
  .my-card{
    p{
      margin-top: 10px;
    }
  }
}
</style>


