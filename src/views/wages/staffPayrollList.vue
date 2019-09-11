<template>
  <div class="staffPayrollList wrap">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select
        v-model="seachMsg.BUCode"
        slot="prepend"
        placeholder="请选择"
        style="width:200px;"
        @change="selectFun"
        class="selectItem"
      >
        <el-option
          v-for="(item,index) in regionBUlist"
          :key="index"
          :label="item.name"
          :value="item.code"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="seachMsg.year"
        type="year"
        placeholder="选择年"
        value-format="yyyy"
        format="yyyy"
        @change="selectYear"
        class="selectItem"
      ></el-date-picker>
      <el-select
        style="width:200px;"
        v-model="seachMsg.month"
        placeholder="请选择月份"
        @change="selectMonth"
        class="selectItem"
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
      <el-input class="selectItem" placeholder="请输入关键字" v-model="filter.searchKey"></el-input>
      <el-button
        type="primary"
        class="buPayrollConfirmBtn"
        @click="buPayrollConfirmFun(seachMsg.BUCode)"
      >确认单位薪水数据</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column sortable prop="staffNo" label="员工编号"></el-table-column>
      <el-table-column prop="nameChinese" label="姓名"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="收入总额"></el-table-column>
      <el-table-column sortable prop="grossPay" label="税前金额"></el-table-column>
      <el-table-column sortable prop="taxableWages" label="应税金额"></el-table-column>
      <el-table-column sortable prop="taxAmount" label="个人所得税"></el-table-column>
      <el-table-column sortable prop="notTaxableAmount" label="不应税金额"></el-table-column>
      <el-table-column sortable prop="typeIdTxt" label="工资单状态"></el-table-column>
      <el-table-column label="操作" width="470">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="openFun(scope.$index, scope.row)"
          >详 细</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="deleteFun(scope.$index, scope.row)"
          >删 除</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="confirmFun(scope.$index, scope.row)"
            v-if="scope.row.typeId == 0"
          >确认工资单</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="staffPayrollYearFun(scope.$index, scope.row)"
          >全年工资单</el-button>
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
    <!-- 工资单明细 -->
    <el-dialog
      title="工资单明细"
      :visible.sync="isShowAddAccess"
      :close-on-click-modal="false"
      width="70%"
    >
      <staff-payroll-detail
        v-if="isShowAddAccess"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></staff-payroll-detail>
    </el-dialog>
    <!-- 确认工资单 -->
    <el-dialog title="确认工资单" :visible.sync="isShowConfirm" :close-on-click-modal="false">
      <staff-payroll-confirm
        v-if="isShowConfirm"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></staff-payroll-confirm>
    </el-dialog>
    <!-- 单位确认工资 -->
    <el-dialog title="确认单位薪水数据" :visible.sync="isShowbuConfirm" :close-on-click-modal="false">
      <bu-payroll-confirm
        v-if="isShowbuConfirm"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></bu-payroll-confirm>
    </el-dialog>
    <!-- 全年工资单 -->
    <el-dialog title="全年工资单" :visible.sync="isShowPayrollYear" :close-on-click-modal="false" width="70%">
      <staff-payroll-year
        v-if="isShowPayrollYear"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></staff-payroll-year>
    </el-dialog>
  </div>
</template>
<script>
import staffPayrollDetail from "./staffPayrollDetail.vue";
import staffPayrollConfirm from "./staffPayrollConfirm.vue";
import buPayrollConfirm from "./buPayrollConfirm.vue";
import staffPayrollYear from "./staffPayrollYear.vue";
export default {
  name: "staffPayrollList",
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
      isShowAddAccess: false, //是否显示新增页面
      isShowConfirm: false, //是否显示确认工资单
      isShowbuConfirm: false, //是否显示单位确认工资
      isShowPayrollYear: false, //是否显示全年工资单
      seachMsg: {
        BUCode: "", //角色类型
        year: "", //年份
        month: "" //月份
      },
      hrCode: "",
      filter: { searchKey: "", searchField: ["nameChinese", "staffNo"] }
    };
  },
  mounted() {
    this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      var date = new Date();
      this.seachMsg = {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString()
      };
      if (this.$toolFn.sessionGet("staffPayrollListSearch")) {
        this.seachMsg = {
          year: this.$toolFn
            .sessionGet("staffPayrollListSearch")
            .year.toString(),
          month: this.$toolFn
            .sessionGet("staffPayrollListSearch")
            .month.toString()
        };
      }
      this.getregionBU();
    },
    // 获取单位列表
    async getregionBU() {
      var regionBUs = await _this.$myApi.regionBUs(_this,{isCache:true});
      if (regionBUs) {
          this.regionBUlist = regionBUs;
          this.seachMsg.BUCode = this.$toolFn.sessionGet("staffPayrollListSearch")? this.$toolFn.sessionGet("staffPayrollListSearch").BUCode : this.regionBUlist[0].code;
          this.getData(
            this.seachMsg.BUCode,
            parseInt(this.seachMsg.year),
            parseInt(this.seachMsg.month)
          );
        }
    },
    //获取项目数据列表
    getData(BUCode, year, month) {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollList";
      var myData = {
        BUCode: BUCode,
        year: year,
        month: month
      };
      this.isShowLoading = true;
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
              item.typeIdTxt = item.typeId == 1 ? "已确认" : "未确认";
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
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
    },
    // 选择年份
    selectYear(val) {
      this.seachMsg.year = val;
      this.getData(
        this.seachMsg.BUCode,
        parseInt(this.seachMsg.year),
        parseInt(this.seachMsg.month)
      );
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
    },
    // 选择月份
    selectMonth(val) {
      this.seachMsg.month = val;
      this.getData(
        this.seachMsg.BUCode,
        parseInt(this.seachMsg.year),
        parseInt(this.seachMsg.month)
      );
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
    },
    // 打开详细页面
    openFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo.code = res.code;
    },
    // 确认工资单
    deleteFun(index, res) {
      this.$confirm("确定删除此工资单吗", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var data = {
          code: res.code,
          hrCode: this.hrCode
        };
        this.$http
          .post("/server/api/v1/payroll/staff/staffPayrollListDelete", data)
          .then(res => {
            if (res.data.code == 0) {
              this.reload();
              this.$message.success("操作成功~");
            } else {
              this.$message.warning(res.data.msg);
            }
          });
      });
    },
    // 确认工资单
    confirmFun(index, res) {
      this.curInfo = {
        code: res.code,
        hrCode: this.hrCode
      };
      this.isShowConfirm = true;
    },
    // 确认单位出粮信息
    buPayrollConfirmFun(res) {
      this.curInfo = {
        BUCode: res,
        hrCode: this.hrCode,
        year: this.seachMsg.year,
        month: this.seachMsg.month,
        payrollPeriod: res.payrollPeriod
      };
      this.isShowbuConfirm = true;
    },
    // 获取全年工资信息
    staffPayrollYearFun(index, res){
      this.curInfo = {
        code: res.staffCode
      };
      this.isShowPayrollYear = true;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
      this.isShowConfirm = false;
      this.isShowbuConfirm = false;
      this.isShowPayrollYear = false;
    },
    searchFun(list, search) {
      let newList = [];
      for (let i = 0; i < list.length; i++) {
        for (let key in list[i]) {
          if (search.searchField.indexOf(key) >= 0) {
            if (
              list[i][key] != undefined &&
              list[i][key] != "" &&
              list[i][key].toString().includes(search.searchKey)
            ) {
              newList.push(list[i]);
              break;
            }
          }
        }
      }
      return newList;
    }
  },
  computed: {
    queryTableDate() {
      var _this = this;
      let tableData = _this.tableData;
      if (_this.filter.searchKey != "") {
        tableData = _this.searchFun(tableData, _this.filter);
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
  components: {
    staffPayrollDetail,
    staffPayrollConfirm,
    buPayrollConfirm,
    staffPayrollYear
  }
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
  justify-content: space-between;
  .selectItem {
    display: flex;
    min-width: 200px;
    align-items: center;
    font-size: 14px;
    color: rgb(237, 137, 55);
    margin-right: 15px;
  }
  .el-date-editor {
    margin-left: 15px;
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
</style>






