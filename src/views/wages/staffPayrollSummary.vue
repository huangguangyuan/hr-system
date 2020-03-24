<template>
  <div class="staffPayrollSummary wrap">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select
        class="selectItem"
        v-model="seachMsg.BUCode"
        slot="prepend"
        placeholder="请选择"
        style="width:200px;"
        @change="selectFun"
      >
        <el-option
          v-for="(item,index) in regionBUlist"
          :key="index"
          :label="item.name"
          :value="item.code"
        ></el-option>
      </el-select>
      <el-date-picker
        class="selectItem"
        v-model="seachMsg.year"
        type="year"
        placeholder="选择年"
        value-format="yyyy"
        format="yyyy"
        @change="selectYear"
      ></el-date-picker>
      <el-select
         class="selectItem"
        style="width:200px;"
        v-model="seachMsg.month"
        placeholder="请选择月份"
        @change="selectMonth"
      >
        <el-option label="1月" value="1"></el-option>
        <el-option label="2月" value="2"></el-option>
        <el-option label="3月" value="3"></el-option>
        <el-option label="4月" value="4"></el-option>
        <el-option label="5月" value="5"></el-option>
        <el-option label="6月" value="6"></el-option>
        <el-option label="7月" value="7"></el-option>
        <el-option label="8月" value="8"></el-option>
        <el-option label="9月" value="9"></el-option>
        <el-option label="10月" value="10"></el-option>
        <el-option label="11月" value="11"></el-option>
        <el-option label="12月" value="12"></el-option>
      </el-select>
      <!-- <el-input class="selectItem" placeholder="请输入关键字" v-model="filter.searchKey"></el-input> -->
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item :label="props.row.reallyAmount.title+'：'">
              <span>{{ props.row.reallyAmount.val || '实发工资' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.name.title+'：'">
              <span>{{ props.row.name.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.buName.title+'：'">
              <span>{{ props.row.buName.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.year.title+'：'">
              <span>{{ props.row.year.va || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.month.title+'：'">
              <span>{{ props.row.month.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.staffNo.title+'：'">
              <span>{{ props.row.staffNo.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.payrollPeriod.title+'：'">
              <span>{{ props.row.payrollPeriod.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.basicSalary.title+'：'">
              <span>{{ props.row.basicSalary.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.IDNo.title+'：'">
              <span>{{ props.row.IDNo.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.departmentName.title+'：'">
              <span>{{ props.row.departmentName.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.position.title+'：'">
              <span>{{ props.row.position.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.bankName.title+'：'">
              <span>{{ props.row.bankName.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.bankAccountNo.title+'：'">
              <span>{{ props.row.bankAccountNo.val || '暂无信息' }}</span>
            </el-form-item>
            <!-- <el-form-item :label="props.row.allowance.title+'：'">
              <span>{{ props.row.allowance.val || '暂无信息' }}</span>
            </el-form-item> -->
            <el-form-item :label="props.row.payDay.title+'：'">
              <span>{{ props.row.payDay.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item v-for="(item,index) in props.row.buSalaryItemTaxableCount" :key="index" :label="props.row['staffSalaryItemTaxable' + item].title+'：'">
              <span>{{ props.row['staffSalaryItemTaxable' + item].val || '暂无信息' }}</span>
            </el-form-item>

            <!-- <el-form-item :label="props.row.staffSalaryItemTaxable1.title+'：'">
              <span>{{ props.row.staffSalaryItemTaxable1.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.staffSalaryItemTaxable2.title+'：'">
              <span>{{ props.row.staffSalaryItemTaxable2.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.staffSalaryItemTaxable3.title+'：'">
              <span>{{ props.row.staffSalaryItemTaxable3.val || '暂无信息' }}</span>
            </el-form-item> -->

            <el-form-item :label="props.row.holiday.title+'：'">
              <span>{{ props.row.holiday.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.grossPay.title+'：'">
              <span>{{ props.row.grossPay.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.taxableWages.title+'：'">
              <span>{{ props.row.taxableWages.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.taxAmount.title+'：'">
              <span>{{ props.row.taxAmount.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.claim.title+'：'">
              <span>{{ props.row.claim.val || '暂无信息' }}</span>
            </el-form-item>
            <el-form-item :label="props.row.adjAmount.title+'：'">
              <span>{{ props.row.adjAmount.val || 0 }}</span>
            </el-form-item>            
            <el-form-item :label="props.row.staffSalaryItemNotTaxable1.title+'：'">
              <span>{{ props.row.staffSalaryItemNotTaxable1.val || '暂无信息' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name.val" label="姓名"></el-table-column>
      <!-- <el-table-column prop="IDNo.val" label="身份证号"></el-table-column>
      <el-table-column prop="buName.val" label="单位名称"></el-table-column> -->
      <el-table-column prop="year.val" label="出粮年份"></el-table-column>
      <el-table-column prop="month.val" label="出粮月份"></el-table-column>
      <el-table-column prop="payrollPeriod.val" label="计粮周期"></el-table-column>
      <el-table-column prop="reallyAmount.val" label="实发工资"></el-table-column>
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
  name: "staffPayrollSummary",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前内容
      regionBUlist: [], //单位列表
      isShowLoading: false, //是否显示loading页
      seachMsg: {
        BUCode: "", //角色类型
        year: "", //年份
        month: "" //月份
      },
      filter:{searchKey:'',searchField:['nameChinese','staffNo']},
    };
  },
  mounted() {
    this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
    this.getregionBU();
    var date = new Date();
    this.seachMsg = {
              year: date.getFullYear().toString(),
              month: (date.getMonth()+1).toString()
            };     
      if (this.$toolFn.sessionGet("staffPayrollSummary")) {
        this.seachMsg = {
          year: this.$toolFn.sessionGet("staffPayrollSummary").year,
          month: this.$toolFn.sessionGet("staffPayrollSummary").month
        };
      }
      
    },
    // 获取单位列表
    async getregionBU() {
      var _this = this;
      var regionBUs = await _this.$myApi.regionBUs({isCache:true});
      if (regionBUs && regionBUs.length > 0) {
          this.regionBUlist = regionBUs;
          this.seachMsg.BUCode = this.$toolFn.sessionGet("staffPayrollSummary")? this.$toolFn.sessionGet("staffPayrollSummary").BUCode: this.regionBUlist[0].code;
          this.getData(
            this.seachMsg.BUCode,
            parseInt(this.seachMsg.year),
            parseInt(this.seachMsg.month)
          );
        }
    },
    //获取项目数据列表
    getData(BUCode, year, month) {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollSummary";
      var myData = {
        BUCode: BUCode,
        year: year,
        month: month
      };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          console.log(res);
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
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
    // 获取单位BUCode
    selectFun(val) {
      this.seachMsg.BUCode = val;
      this.getData(
        this.seachMsg.BUCode,
        parseInt(this.seachMsg.year),
        parseInt(this.seachMsg.month)
      );
      this.$toolFn.sessionSet("staffPayrollSummary", this.seachMsg);
    },
    // 选择年份
    selectYear(val) {
      this.seachMsg.year = val;
      this.getData(
        this.seachMsg.BUCode,
        parseInt(this.seachMsg.year),
        parseInt(this.seachMsg.month)
      );
      this.$toolFn.sessionSet("staffPayrollSummary", this.seachMsg);
    },
    // 选择月份
    selectMonth(val) {
      this.seachMsg.month = val;
      this.getData(
        this.seachMsg.BUCode,
        parseInt(this.seachMsg.year),
        parseInt(this.seachMsg.month)
      );
      this.$toolFn.sessionSet("staffPayrollSummary", this.seachMsg);
    },
  },
  computed: {
    queryTableDate() {
      var _this = this;
      let tableData = _this.tableData;
      if (_this.filter.searchKey != ""){
        tableData = _this.$toolFn.searchFun(tableData,_this.filter);
      }
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
  .buPayrollConfirmBtn {
    float: right;
  }
}
.payrolllist {
  .photo {
    width: 35px;
    height: 35px;
    border-radius: 5px;
  }
}
.table-expand{
    display: flex;flex-wrap: wrap;
    .el-form-item{
        width: 23%;box-sizing: border-box;border-bottom:1px #99a9bf solid;padding:0 10px;
        box-shadow: darkgrey 0px 2px 15px 1px;border-radius: 8px;
    }
}

</style>






