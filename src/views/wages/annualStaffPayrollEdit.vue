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
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe show-summary >
      <el-table-column prop="month" label="月份"></el-table-column>
      <el-table-column prop="salary" label="基础工资"></el-table-column>
      <el-table-column prop="grossPay" label="税后工资"></el-table-column>
      <el-table-column prop="claimAmount" label="报销金额"></el-table-column>
      <el-table-column prop="taxableWages" label="应税金额"></el-table-column>
      <el-table-column prop="taxAmount" label="个人所得税"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="openFun(scope.$index, scope.row)"
          >更 新</el-button>
        </template>
      </el-table-column>
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
      this.$http
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
      var _this = this;
      let tableData = _this.tableData;
      _this.total = tableData.length;
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






