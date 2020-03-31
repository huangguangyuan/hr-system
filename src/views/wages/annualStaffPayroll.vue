<template>
  <div class="annualStaffPayroll wrap">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-date-picker
        class="selectItem"
        v-model="year"
        type="year"
        placeholder="选择年"
        value-format="yyyy"
        format="yyyy"
        @change="selectYear"
      ></el-date-picker>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-divider>住房公积金清单</el-divider>
          <el-table :data="props.row.HCList" border show-summary size="mini">
            <el-table-column prop="paymentTxt" label="缴纳对象"></el-table-column>
            <el-table-column prop="typeTxt" label="缴纳类型"></el-table-column>
            <el-table-column prop="payment" label="金额（元）"></el-table-column>
          </el-table>

          <el-divider>社保清单</el-divider>
          <el-table :data="props.row.SIList" stripe border show-summary size="mini">
            <el-table-column prop="paymentTxt" label="付款对象"></el-table-column>
            <el-table-column prop="typeTxt" label="类型"></el-table-column>
            <el-table-column prop="payment" label="金额(元)"></el-table-column>
          </el-table>

          <!-- <el-divider>津贴清单</el-divider>
          <el-table :data="props.row.allowanceList" stripe border show-summary size="mini">
            <el-table-column prop="name" label="名 称"></el-table-column>
            <el-table-column prop="amount" label="金额(元)"></el-table-column>
          </el-table> -->

          <el-divider>报销清单</el-divider>
          <el-table :data="props.row.claimList" stripe border show-summary size="mini">
            <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
            <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
            <el-table-column prop="totalAmount" label="报销金额(元)"></el-table-column>
          </el-table>

          <el-divider>请假清单</el-divider>
          <el-table :data="props.row.holidayList" stripe border show-summary size="mini">
            <el-table-column prop="balanceMon" label="结算月份"></el-table-column>
            <el-table-column prop="isBalanceTxt" label="是否结算"></el-table-column>
            <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
            <el-table-column prop="totalDay" label="请假天数"></el-table-column>
            <el-table-column prop="totalAmount" label="扣除金额(元)"></el-table-column>
          </el-table>

          <el-divider>专项扣除清单</el-divider>
          <el-table :data="props.row.specialDeductionList" stripe border show-summary size="mini">
            <el-table-column prop="statusTxt" label="是否生效"></el-table-column>
            <el-table-column prop="typeIdTxt" label="专项扣除类型"></el-table-column>
            <el-table-column prop="amount" label="专项扣除金额"></el-table-column>
          </el-table>

          <el-divider>应税项目清单</el-divider>
          <el-table :data="props.row.taxableItemsList" stripe border show-summary size="mini">
            <el-table-column prop="name" label="项目名称"></el-table-column>
            <el-table-column prop="amount" label="金额(元)"></el-table-column>
          </el-table>

          <el-divider>MPF清单</el-divider>
          <el-table :data="props.row.MPFList" stripe border show-summary size="mini">
            <el-table-column prop="paymentTxt" label="缴费对象"></el-table-column>
            <el-table-column prop="typeTxt" label="类 型"></el-table-column>
            <el-table-column prop="payment" label="金额(元)"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="month" label="月份"></el-table-column>
      <el-table-column prop="buName" label="所在单位"></el-table-column>
      <el-table-column prop="grossPay" label="税后工资"></el-table-column>
      <el-table-column prop="claimAmount" label="报销金额"></el-table-column>
      <el-table-column prop="taxableWages" label="应税金额"></el-table-column>
      <el-table-column prop="taxAmount" label="个人所得税"></el-table-column>
      <el-table-column prop="salary" label="基础工资"></el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <div class="pageInfo">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="curChange"
      ></el-pagination>
      <p>当前为第 {{curPage}} 页，共有 {{pageTotal}} 页</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "annualStaffPayroll",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowLoading: false, //是否显示loading页
      year: "2019",
      staffCode:''
    };
  },
  mounted() {
    this.getData(this.staffCode, parseInt(this.year));
  },
  methods: {
    //获取项目数据列表
    getData(staffCode, year) {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollYear";
      var myData = {
        staffCode: staffCode,
        year: year
      };
      this.isShowLoading = true;
      this.$myApi.http
        .post(reqUrl, myData)
        .then(res => {
          console.log(res);
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
              item.claimList.map(nodes => {
                nodes.isBalanceTxt = nodes.isBalance == 1 ? "已结算" : "未结算";
                return nodes;
              });
              item.holidayList.map(nodes => {
                nodes.typeIdTxt =
                  nodes.details[0].typeId == 1 ? "生效" : "未生效";
                switch (nodes.details[0].typeId) {
                  case 1:
                    nodes.typeIdTxt = "事假";
                    break;
                  case 2:
                    nodes.typeIdTxt = "年假";
                    break;
                  case 3:
                    nodes.typeIdTxt = "病假";
                    break;
                  case 4:
                    nodes.typeIdTxt = "婚假";
                    break;
                  case 5:
                    nodes.typeIdTxt = "产假/陪产假";
                    break;
                  case 6:
                    nodes.typeIdTxt = "丧假";
                    break;
                  case 50:
                    nodes.typeIdTxt = "其他";
                    break;
                }
                nodes.isBalanceTxt = nodes.isBalance == 1 ? "已结算" : "未结算";
                return nodes;
              });
              item.specialDeductionList.map(nodes => {
                nodes.statusTxt = nodes.status == 1 ? "生效" : "未生效";
                switch (nodes.typeId) {
                  case 1:
                    nodes.typeIdTxt = "赡养老人";
                    break;
                  case 2:
                    nodes.typeIdTxt = "子女教育";
                    break;
                  case 3:
                    nodes.typeIdTxt = "房贷利息";
                    break;
                  case 4:
                    nodes.typeIdTxt = "住房租金";
                    break;
                  case 5:
                    nodes.typeIdTxt = "继续教育";
                    break;
                  case 6:
                    nodes.typeIdTxt = "大病医疗";
                    break;
                }
                return nodes;
              });
              item.MPFList = item.MPFList || '';
              return item;
            })
            .sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
            });
          this.total = this.tableData.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前页数
    curChange(val) {
      this.curPage = val;
    },
    // 选择年份
    selectYear(val) {
      this.getData(this.staffCode, parseInt(val));
      this.$toolFn.sessionSet("staffPayrollYear", parseInt(val));
    }
  },
  computed: {
    queryTableDate() {
      
      let tableData = this.tableData;
      this.total = tableData.length;
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return tableData.slice(begin, end);
    },
    pageTotal() {
      var pageTotal = Math.ceil(this.total / this.pageSize);
      return pageTotal;
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }
}
.search-wrap {
  margin: 20px auto;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  .selectItem {
    display: flex;
    min-width: 200px;
    align-items: center;
    font-size: 14px;
    color: rgb(237, 137, 55);
    margin-right: 15px;
  }
  .el-date-editor {
    margin-right: 15px;
  }
}
</style>






