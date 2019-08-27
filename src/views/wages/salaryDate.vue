<template>
  <div class="salaryDate">
    <el-page-header @back="goBack" content="个人详情页面"></el-page-header>
    <div class="header-info">
      <el-avatar :size="130" :src="circleUrl"></el-avatar>
      <div class="message">
        <h5>{{msg.nameChinese}}</h5>
        <h4>{{msg.nameEnglish || null}}</h4>
        <el-divider></el-divider>
      </div>
    </div>
    <div class="container">
      <el-divider>基础信息</el-divider>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">工资总额：{{msg.salaryAmout}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">税款起征点：{{msg.taxThreshold}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">银行卡类型：{{msg.bankName || '暂无信息'}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">银行卡号：{{msg.bankAccountName || '暂无信息'}}</el-card>
        </el-col>
      </el-row>
      <el-divider>社保信息</el-divider>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">社保账号：{{staffInsuredInfo.SIAccount}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">社保基数：{{staffInsuredInfo.SIBase}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">社保城市方案：{{staffInsuredInfo.SICity}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">住房公积金账户：{{staffInsuredInfo.HCAccount}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">公积金实际金额：{{staffInsuredInfo.HCRealityAoumt}}</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always">基本医疗保险卡号：{{staffInsuredInfo.medicalSchemeAccount || '暂无信息'}}</el-card>
        </el-col>
      </el-row>
      <el-divider>津贴清单</el-divider>
      <el-table :data="msg.allowanceList" stripe border style="width: 100%">
        <el-table-column prop="name" label="津贴项目名称"></el-table-column>
        <el-table-column prop="amount" label="津贴金额（元）"></el-table-column>
      </el-table>
      <el-divider>费用报销清单</el-divider>
      <el-table :data="msg.expensesClaimList" stripe border style="width: 100%">
        <el-table-column prop="totalAmount" label="报销金额（元）"></el-table-column>
        <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
        <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      </el-table>
      <el-divider>请假清单</el-divider>
      <el-table :data="msg.holidaysApplyList" stripe border style="width: 100%">
        <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
        <el-table-column prop="totalDay" label="请假天数"></el-table-column>
        <el-table-column prop="totalAmount" label="扣除金额"></el-table-column>
        <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
        <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
      </el-table>
      <el-divider>专项扣除清单</el-divider>
      <el-table :data="msg.payrollSpecialDeductionList" stripe border style="width: 100%">
        <el-table-column prop="amount" label="专项扣除金额"></el-table-column>
        <el-table-column prop="statusTxt" label="是否生效"></el-table-column>
        <el-table-column prop="typeIdTxt" label="专项扣除类型"></el-table-column>
      </el-table>
      <el-divider>应税项目</el-divider>
      <el-table :data="msg.salaryItems" stripe border style="width: 100%">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="amount" label="金 额"></el-table-column>
        <el-table-column prop="statusTxt" label="是否生效"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "salaryDate",
  inject: ["reload"],
  data() {
    return {
      circleUrl: "",
      msg: {}, //员工薪资信息
      staffInsuredInfo: {} //员工社保、公积金信息
    };
  },
  mounted() {
    this.circleUrl =
      this.staffInfo.photo ||
      "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
    this.getData();
  },
  methods: {
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
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          console.log(res.data.data);
          this.msg = res.data.data;
          this.msg.expensesClaimList.map(item => {
            item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
            return item;
          });
          this.msg.payrollSpecialDeductionList.map(item => {
            item.statusTxt = item.status == 1 ? "生效" : "未生效";
            switch (item.typeId) {
              case 1:
                item.typeIdTxt = "赡养老人";
                break;
              case 2:
                item.typeIdTxt = "子女教育";
                break;
              case 3:
                item.typeIdTxt = "房贷利息";
                break;
              case 4:
                item.typeIdTxt = "住房租金";
                break;
              case 5:
                item.typeIdTxt = "继续教育";
                break;
              case 6:
                item.typeIdTxt = "大病医疗";
                break;
            }
          });
          this.msg.salaryItems.map(item => {
            item.statusTxt = item.status == 1 ? "生效" : "未生效";
          });
          this.msg.holidaysApplyList.map(item => {
            item.typeIdTxt = item.details[0].typeId == 1 ? "生效" : "未生效";
            switch(item.details[0].typeId){
                case 1:
                    item.typeIdTxt = '事假';
                    break;
                case 2:
                    item.typeIdTxt = '年假';
                    break;
                case 3:
                    item.typeIdTxt = '病假';
                    break;
                case 4:
                    item.typeIdTxt = '婚假';
                    break;
                case 5:
                    item.typeIdTxt = '产假/陪产假';
                    break;
                case 6:
                    item.typeIdTxt = '丧假';
                    break;
                case 50:
                    item.typeIdTxt = '其他';
                    break;
            };
            item.isBalanceTxt = item.isBalance == 1 ? "已结算" : "未结算";
          });
          this.staffInsuredInfo = res.data.data.staffInsuredInfo;
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






