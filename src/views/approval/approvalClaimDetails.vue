<template>
  <div class="approvalClaimDetails" v-if="isShow">
    <el-divider content-position="left">报销明细</el-divider>
    <div class="view-detail" v-loading="isShowLoading">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">申请人：{{claimItem.staff.nameChinese}}</el-card>
        </el-col>
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
        <el-table :data="tableData" stripe  >
        <el-table-column prop="title" label="项目名称"></el-table-column>
        <el-table-column prop="amount" label="报销金额"></el-table-column>
        <el-table-column prop="typeIdTxt" label="报销类型"></el-table-column>
        <el-table-column prop="remarks" label="备 注"></el-table-column>
      </el-table>
    </div>
    <br />
    <el-divider content-position="left">相关人员</el-divider>
    <div class="view-detail" v-if="isShow" >
      <el-row :gutter="12">
        <el-col :span="24" v-show="claimItem.approveOfficerNameArr != ''">
          <el-card shadow="always">审批人员：{{claimItem.approveOfficerNameArr}}</el-card>
        </el-col>
        <!-- <el-col :span="24" v-show="claimItem.balanceOfficerNameArr != ''">
          <el-card shadow="always">结算人员：{{claimItem.balanceOfficerNameArr}}</el-card>
        </el-col> -->
        <el-col :span="24" v-show="claimItem.noticeOfficerNameArr != ''">
          <el-card shadow="always">抄送人员：{{claimItem.noticeOfficerNameArr}}</el-card>
        </el-col>
      </el-row>
    </div><br />
    <el-divider content-position="left" >审批流程</el-divider>
    <el-timeline :reverse="true">
      <el-timeline-item
        v-for="item in approveHisList"
        :key="item.id"
        :timestamp="item.createTime"
        placement="top"
      >
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
export default {
  name: "approvalClaimDetails",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isShow:false,
      isShowLoading:true,
      claimItem:{},
      claimTypes:[],
      tableData: [], //数据列表
      approveHisList: [], //审批流程
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
      },
    };
  },
  mounted() {
    this.init();
    this.canApprove = this.curInfo.canApprove;
  },
  methods: {
    async init(){
      this.claimItem = await this.$myApi.staffClaim({claimCode:this.curInfo.code});
      this.claimTypes = await this.$myApi.getBUClaimType();
      this.claimItem.details.map(item => {
        let filterResult = this.claimTypes.filter(child => {
          return child.id == item.typeId;
        });
        item.typeIdTxt = filterResult.length>0?filterResult[0].name:'';
        return item;
      });
      if (this.claimItem.fileSrc && this.claimItem.fileSrc != ''){
        this.fileList = this.claimItem.fileSrc.split(',');
      }
      this.claimItem.createTime = this.$toolFn.timeFormat(this.claimItem.createTime,"yyyy-MM-dd hh:mm");
      this.tableData = this.claimItem.details;
      // 审批流程
      this.approveHisList = this.claimItem.approveHis.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.finishFlagTxt = item.finishFlag == 0 ? "否" : "是";
        if (item.finishFlag == 1){
          this.isFinish = true;
        }
        item.typeIdTxt = approveHisTypeTxt(item.typeId);
        if (item.typeId == 100){
          item.typeIdTxt +=  '( 结算月份 '+ this.claimItem.balanceMon + " 月 " + (this.claimItem.totalAmount != 0?"， 总金额 ： " + this.claimItem.totalAmount + " 元 ":"" ) + " )"; 
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
      var reqUrl = '/server/api/v1/staff/claim/approve';
      var data = {
        hrCode:this.curInfo.hrCode,
        claimCode:this.curInfo.code,
        approve:parseInt(this.ruleForm.approve),
        remarks:this.ruleForm.remarks
      }
      
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('审批成功');
        }else{
          this.$message.error(res.data.msg);
        }
      })
    }

  }
};
</script>
<style scoped lang="scss">
.approvalClaimDetails {
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
  .my-card {
    p {
      margin-top: 10px;
    }
  }
  /deep/ .el-timeline-item:last-child .el-timeline-item__node{
        background: #E4E7ED !important;
  }
  /deep/ .el-timeline-item:first-child .el-timeline-item__node{
        background: #ff6600 !important;
  }
}
</style>


