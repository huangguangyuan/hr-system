<template>
  <div class="staffPayrollList wrap">
    <!-- 搜索 -->
    <div class="addBtn-wrap" >
      <el-button type="primary" v-if="deletePayrollSlip_right" @click="deleteSelectedFun">删除选中项工资单</el-button>
    </div>
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
        v-if="fun_right && approveBUPayrollS_right"
      >确认单位薪水数据</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe ref="multipleTable" @selection-change="handleSelectionChange" :row-key="getRowKeys" heigth="200" @row-click="openRowFun">
      <el-table-column type="selection" width="55" :reserve-selection="true" ></el-table-column>
      <el-table-column sortable prop="staffNo" label="员工编号" width="100" ></el-table-column>
      <el-table-column prop="nameChinese" label="姓名" width="100" fixed></el-table-column>
      <el-table-column sortable prop="position" label="员工职位" width="100"></el-table-column>
      <el-table-column sortable prop="dateOfJoining" label="入职日期" width="100"></el-table-column>
      <el-table-column sortable prop="salary" label="基本工资" width="100"></el-table-column>
      <el-table-column sortable prop="taxableItemsAmount" label="应税项目总额" width="140"></el-table-column>
      <el-table-column sortable prop="claimAmount" label="请假应扣总额" width="140"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="收入总额" width="100"></el-table-column>
      <el-table-column sortable prop="SIAmount" label="社保扣除" width="100"></el-table-column>
      <el-table-column sortable prop="HCAmount" label="公积金扣除" width="130"></el-table-column>
      <!-- <el-table-column sortable prop="MPFAmount" label="MPF扣除" width="120"></el-table-column> -->
      <el-table-column sortable prop="grossPay" label="税前金额" width="100"></el-table-column>
      <el-table-column sortable prop="specialDeductionAmount" label="专项附加扣除" width="140"></el-table-column>
      <el-table-column sortable prop="threshold" label="个税起征点扣除" width="160"></el-table-column>
      <el-table-column sortable prop="taxableWages" label="应税金额" width="100"></el-table-column>
      <el-table-column sortable prop="taxAmount" label="个人所得税" width="130"></el-table-column>
      <el-table-column sortable prop="notTaxableAmount" label="不应税金额" width="130"></el-table-column>
      <el-table-column sortable prop="adjAmount" label="调整金额" width="100"></el-table-column>
      <el-table-column sortable prop="typeIdTxt" label="工资单状态" width="130"></el-table-column>
      <el-table-column label="操作" width="560">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click.stop="openFun(scope.$index, scope.row)"
          >详 细</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click.stop="staffPayrollYearFun(scope.$index, scope.row)"
          >全年工资单</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click.stop="adjAmountFun(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >调整金额</el-button>          
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click.stop="confirmFun(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >审核工资单</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click.stop="rebuildStaffPayroll(scope.$index, scope.row)"
            v-if="fun_right && genPayrollSlip_right && scope.row.typeId == 2"
          >重新生成工资单</el-button>
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click.stop="deleteFun(scope.$index, scope.row)"
            v-if="fun_right && deletePayrollSlip_right"
          >删 除</el-button>
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
    <!-- 调整金额 -->
    <el-dialog title="调整金额" :visible.sync="isShowAdjAmountRemarks" :close-on-click-modal="false">
      <adj-amount-edit
        v-if="isShowAdjAmountRemarks"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></adj-amount-edit>
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
    <el-dialog title="全年工资单" :visible.sync="isShowPayrollYear" :close-on-click-modal="false" width="80%">
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
import adjAmountEdit from "./adjAmountEdit.vue";
import { promises } from 'fs';
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
      isShowAdjAmountRemarks: false, //是否显示调整金额
      seachMsg: {
        BUCode: "", //角色类型
        year: "", //年份
        month: "" //月份
      },
      hrCode: "",
      userInfo:{},
      filter: { searchKey: "", searchField: ["nameChinese", "staffNo"] },
      multipleSelection: [],
      approvePayrollSlip_right:false, //审批工资单权限
      deletePayrollSlip_right:false, //删除工资单权限
      genPayrollSlip_right:false,//重新生成工资单
      approveBUPayrollS_right:false,//确认单位工资单
      fun_right:true //功能按钮
    };
  },
  mounted() {
    var _this = this;
    _this.userInfo = _this.$toolFn.localGet("userInfo");
    if (_this.userInfo.roleTypeId == 2 ){
      _this.hrCode = _this.userInfo.userCode;
    }
    if ([301,801].indexOf(_this.userInfo.lev) >= 0){
      this.approvePayrollSlip_right = true;
    };
    if ([301,401,411].indexOf(_this.userInfo.lev) >= 0){
      this.approveBUPayrollS_right = true;
      this.genPayrollSlip_right = true;
      this.deletePayrollSlip_right = true;
    };
    // if ([301,601,611].indexOf(_this.userInfo.lev) >= 0){
    //   this.genPayrollSlip_right = true;
    //   this.deletePayrollSlip_right = true;
    // };
    if ([701].indexOf(_this.userInfo.lev) >= 0){
      this.fun_right = false;
    };
    this.multipleSelection = this.$toolFn.sessionGet("staffPayrollList_multipleSelection");
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
          year: this.$toolFn.sessionGet("staffPayrollListSearch").year.toString(),
          month: this.$toolFn.sessionGet("staffPayrollListSearch").month.toString()
        };
      }
      this.getregionBU();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$toolFn.sessionSet("staffPayrollList_multipleSelection",this.multipleSelection);
    },
    getRowKeys(row) {
      return row.id
    },
    // 获取单位列表
    async getregionBU() {
      var _this = this;
      var regionBUs = await _this.$myApi.regionBUs(_this,{isCache:true});
      if (regionBUs && regionBUs.length > 0) {
          this.regionBUlist = regionBUs;
          this.seachMsg.BUCode = this.$toolFn.sessionGet("staffPayrollListSearch")? this.$toolFn.sessionGet("staffPayrollListSearch").BUCode : this.regionBUlist[0].code;
          this.getData(
            this.seachMsg.BUCode,
            parseInt(this.seachMsg.year),
            parseInt(this.seachMsg.month)
          );
        }
    },
    //0未审核1通过2有疑问，需重新审查
    typeIdTxt(typeId){
      let r = '未审核';
      if (typeId == 1){
        r = '已确认';
      }else if (typeId == 2){
        r = '退回'
      }
      return r;
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
      this.$http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data
            .map(item => {
              item.typeIdTxt = this.typeIdTxt(item.typeId);
              item.dateOfJoining = this.$toolFn.timeFormat(item.dateOfJoining,'yyyy-MM-dd');
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
          this.$nextTick(function(){
            var selectItems = this.multipleSelection;
            if (selectItems && selectItems.length > 0){
              this.tableData.forEach(row => {
                selectItems.find(s => {if (s.id === row.id){
                  this.$refs.multipleTable.toggleRowSelection(row);
                  }
                })
              });
            }

          })
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
    openRowFun(row,event){
      this.openFun(0,row)
    },
    // 打开详细页面
    openFun(index, res) {
      this.isShowAddAccess = true;
      this.curInfo.code = res.code;
    },
    // 删除工资单
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
    // 删除选中项工资单
    async deleteSelectedFun() {
      this.$confirm("确定删除吗", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message.success("正在删除，请稍候！");
        var deleteItems = this.multipleSelection;
        var promiseList = [];
        for (let index = 0; index < deleteItems.length; index++) {
          const element = deleteItems[index];
          var data = {
            code: element.code,
            hrCode: this.hrCode
          };
          promiseList.push(Promise.resolve(
              this.$http.post("/server/api/v1/payroll/staff/staffPayrollListDelete", data).then(res => {
                if (res.data.code == 0) {
                  this.$message.success(element.nameChinese + "工资单删除成功！");
                } else {
                  this.$message.warning(element.nameChinese + res.data.msg);
                }
              })
          ));
        }
        Promise.all(
            promiseList
          ).then((all) => {
            this.$message.success("删除成功！");
            console.log(all);
            this.reload();
        })
        
      });
    },
    // 确认工资单
    confirmFun(index, res) {
      this.curInfo = {
        code: res.code,
        hrCode: this.hrCode,
        typeId: res.typeId,
        remarks: res.remarks
      };
      this.isShowConfirm = true;
    },
    // 调整金额
    adjAmountFun(index, res) {
      this.curInfo = {
        code: res.code,
        hrCode: this.hrCode,
        adjAmount:res.adjAmount,
        adjAmountRemarks: res.adjAmountRemarks
      };
      this.isShowAdjAmountRemarks = true;
    },
    // 重新生成工资单
    rebuildStaffPayroll(index, res) {
        var data = {
            code:res.code,
            hrCode:this.hrCode,
            staffCode:res.staffCode,
            year: res.year,
            month:res.month
        };
        this.$message('正在生成，请稍候!');
        this.$http.post("/server/api/v1/payroll/staff/rebuildStaffPayroll", data).then(res => {
            if (res.data.code == 0) {
              this.reload();
              this.$message.success("操作成功~");
            } else {
              this.$message.warning(res.data.msg);
            }
          });
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
      this.isShowAdjAmountRemarks = false;
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
    staffPayrollYear,
    adjAmountEdit
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






