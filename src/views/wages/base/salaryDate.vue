<template>
  <div class="salaryDate" v-loading="loading" element-loading-text="加载中...">
    <el-page-header @back="goBack" content="薪资数据"></el-page-header>
    <div class="header-info">
      <el-avatar :size="130" :src="circleUrl"></el-avatar>
      <div class="message">
        <h5>{{msg.nameChinese}}</h5>
        <h4>{{msg.nameEnglish || null}}</h4>
        <el-divider></el-divider>
      </div>
    </div>
    <div class="container" >
      <el-divider  v-if="staffInsuredInfo">社保信息</el-divider>
      <el-row :gutter="12" v-if="staffInsuredInfo">
        <el-col :span="8">
          <el-card shadow="always">社保账户：{{staffInsuredInfo.SIAccount}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">社保基数：{{staffInsuredInfo.SIBase}}</el-card>
        </el-col>
        <el-col :span="8" v-if="staffInsuredInfo.SISchemeDetail && staffInsuredInfo.SISchemeDetail.city">
          <el-card shadow="always">社保城市方案：{{staffInsuredInfo.SISchemeDetail.city.name}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">住房公积金账户：{{staffInsuredInfo.HCAccount}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">公积金基数：{{staffInsuredInfo.HCRealityAoumt}}</el-card>
        </el-col>
        <el-col :span="8"  v-if="staffInsuredInfo.SISchemeDetail && staffInsuredInfo.HCSchemeDetail.city">
          <el-card shadow="always">公积金城市方案：{{staffInsuredInfo.HCSchemeDetail.city.name}}</el-card>
        </el-col>
 
      </el-row>
      <el-divider>基础信息</el-divider>
      <el-row :gutter="12">
        <el-col :span="12">
            <el-card shadow="always">基本工资：{{msg.salaryAmout}}</el-card>
          </el-col>
          <el-col :span="12" v-if="msg.taxThreshold != 0">
            <el-card shadow="always">个税起征点：{{msg.taxThreshold}}</el-card>
          </el-col>
        <!-- <el-col :span="12" >
          <el-card shadow="always">津贴总额：{{arrSum(msg.allowanceList,'amount')}}</el-card>
        </el-col> -->
        <el-col :span="12" >
          <el-card shadow="always">应税项目总额：{{arrSum(msg.salaryItemsNeedTax,'amount')}}</el-card>
        </el-col>
        <el-col :span="12" >
          <el-card shadow="always">非应税项目总额：{{arrSum(msg.salaryItemsNotNeedTax,'amount')}}</el-card>
        </el-col>
      </el-row>
      <el-divider  v-if="staffInsuredInfoMPF">MPF数据</el-divider>
      <el-row :gutter="12" v-if="staffInsuredInfoMPF">
        <el-col :span="8">
          <el-card shadow="always">社保账号：{{staffInsuredInfoMPF.account}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">缴纳信息：{{staffInsuredInfoMPF.mpfVoluntarily > 1?staffInsuredInfoMPF.mpfVoluntarily + " 港元":staffInsuredInfoMPF.mpfVoluntarily * 100 + " %"}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">状态：{{staffInsuredInfoMPF.status == 1?"生效":"未生效"}}</el-card>
        </el-col>
        <el-col :span="24">
          <el-card shadow="always">服务商名称：{{staffInsuredInfoMPF.serviceProviderName}}</el-card>
        </el-col>
      </el-row>
      <!-- <el-divider>津贴清单</el-divider>
      <el-table :data="msg.allowanceList" stripe border show-summary style="width: 100%">
        <el-table-column prop="name" label="津贴项目名称"></el-table-column>
        <el-table-column prop="amount" label="津贴金额（元）"></el-table-column>
      </el-table> -->
      <el-divider>应税项目</el-divider>
      <el-table :data="msg.salaryItemsNeedTax" stripe border show-summary style="width: 100%">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="statusTxt" label="是否生效"></el-table-column>
        <el-table-column prop="amount" label="金 额"></el-table-column>
      </el-table>
      <el-divider>非应税项目</el-divider>
      <el-table :data="msg.salaryItemsNotNeedTax" stripe border show-summary style="width: 100%">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        
        <el-table-column prop="statusTxt" label="是否生效"></el-table-column>
        <el-table-column prop="amount" label="金 额"></el-table-column>
      </el-table>      
      <el-divider v-if="msg.payrollSpecialDeductionList">专项扣除清单</el-divider>
      <el-table v-if="msg.payrollSpecialDeductionList" :data="msg.payrollSpecialDeductionList" stripe border show-summary style="width: 100%">
        <el-table-column prop="typeIdTxt" label="专项扣除类型"></el-table-column>
        <el-table-column prop="statusTxt" label="是否生效"></el-table-column>
        <el-table-column prop="amount" label="专项扣除金额"></el-table-column>
      </el-table>
      <el-divider v-if="msg.expensesClaimList && msg.expensesClaimList.length > 0">费用报销清单</el-divider>
      <el-table :data="msg.expensesClaimList" v-if="msg.expensesClaimList  && msg.expensesClaimList.length > 0" stripe border show-summary style="width: 100%">
        <el-table-column prop="balanceMonTxt" label="结算月份"></el-table-column>
        <el-table-column prop="createTime" label="申请时间"></el-table-column>
        <!-- <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column> -->
        <el-table-column prop="totalAmount" label="报销金额（元）"></el-table-column>
        
      </el-table>
      <el-divider v-if="msg.holidaysApplyList && msg.holidaysApplyList.length > 0">请假清单</el-divider>
      <el-table :data="msg.holidaysApplyList" v-if="msg.holidaysApplyList  && msg.holidaysApplyList.length > 0" stripe border show-summary style="width: 100%">
        <el-table-column prop="balanceMonTxt" label="结算月份"></el-table-column>
        <el-table-column prop="createTime" label="申请时间"></el-table-column>
        <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
        <el-table-column prop="totalDay" label="请假天数"></el-table-column>
        <el-table-column prop="totalAmount" label="扣除金额"></el-table-column>
        <!-- <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column> -->
      </el-table>
        </div>
  </div>
</template>
<script>
import {deductionTypeTxt} from "@/lib/staticData.js";
export default {
  name: "salaryDate",
  inject: ["reload"],
  data() {
    return {
      loading:true,
      circleUrl: "",
      msg: {}, //员工薪资信息
      staffInsuredInfo: {}, //员工社保、公积金信息
      staffInsuredInfoMPF:{}//mpf
    };
  },
  beforeMount() {
    this.circleUrl = this.staffInfo.photo || require("@/assets/images/avatar.png");;
    this.getData();
  },
  methods: {
    arrSum(list,val){
      if (!list || !val){
        return 0;
      }
      var n = 0;
      
      list.map(m=>{
        n += parseFloat(m[val]);
      })
      return parseFloat(n)
    },
    // 返回
    goBack() {
      this.$store.commit({
        type: "getWagesInfo",
        wagesKey: "wagesStaffList"
      });
    },
    // 获取数据
    getData() {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollInfo";
      var data = { staffCode: this.staffInfo.code };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.msg = res.data.data;
          this.msg.expensesClaimList.map(item => {
            item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
            item.balanceMonTxt= item.balanceMon + "月";
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            return item;
          });
          if(this.msg.payrollSpecialDeductionList){
            this.msg.payrollSpecialDeductionList.map(item => {
              item.statusTxt = item.status == 1 ? "生效" : "未生效";
              item.typeIdTxt = deductionTypeTxt(item.typeId);
            });
          }

          this.msg.salaryItemsNeedTax.map(item => {
            item.statusTxt = item.status == 1 ? "生效" : "未生效";
          });
          this.msg.salaryItemsNotNeedTax.map(item => {
            item.statusTxt = item.status == 1 ? "生效" : "未生效";
          });          
          this.msg.holidaysApplyList.map(item => {
            item.typeIdTxt = item.details[0].typeId == 1 ? "生效" : "未生效";
            item.balanceMonTxt= item.balanceMon + "月";
            item.createTime = this.$toolFn.timeFormat(item.createTime);
            item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
            
          });
          this.staffInsuredInfo = res.data.data.staffInsuredInfo;
          this.staffInsuredInfoMPF = res.data.data.staffInsuredInfoMPF;
          this.loading = false;
        }
        
      });
    }
  },
  computed: {
    staffInfo() {
      return this.$store.state.wagesModule.wagesInfo;
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
.salaryDate {
  .header-info {
    margin: 20px auto 0;
    box-sizing: border-box;
    padding: 30px 50px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    color: #ffffff;
    background-color: #439145;
    .message {
      flex: 1;
      box-sizing: border-box;
      padding: 0 0 0 30px;
      h5 {
        font-size: 22px;
      }
      h4 {
        font-size: 14px;
        font-weight: 500;
      }
      p {
        font-size: 14px;
        margin: 8px auto 0;
        span {
          margin-left: 10px;
        }
        i {
          font-weight: 500;
          font-size: 15px;
        }
      }
    }
  }
  .el-tabs {
    padding: 0 50px;
    margin: 20px auto 0;
  }
  .container {
    margin: 20px auto 0;
    .el-card {
      margin-top: 12px;
    }
    .el-divider {
      margin-top: 35px;
    }
  }
}
</style>






