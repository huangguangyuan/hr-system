<template>
  <div class="staffPayrollList wrap" v-if="isShow">
    <!-- 搜索 -->
    <div class="addBtn-wrap">
      <el-button type="primary" v-if="deletePayrollSlip_right" @click="deleteSelectedFun">删除选中项工资单</el-button>
      <el-button type="primary" v-if="approvePayrollSlip_right" @click="approveSelectedFun">审核选中项工资单</el-button>
      <el-button
        type="primary"
        class="buPayrollConfirmBtn"
        @click="buPayrollConfirmFun"
        v-if="approveBUPayroll_right"
      >确认单位薪水数据</el-button>
    </div>
    <div class="search-wrap">
      <!-- 选择单位 -->
      <el-select v-model="BUCode" slot="prepend" placeholder="请选择" style="width:200px;" @change="selectBU" class="selectItem">
        <el-option v-for="(item,index) in regionBUlist" :key="index" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <!-- 选择年份 -->
      <el-date-picker v-model="seachMsg.year" type="year" placeholder="选择年" value-format="yyyy" format="yyyy" @change="selectYear" class="selectItem" ></el-date-picker>
      <!-- 选择月份 -->
      <el-select style="width:200px;" v-model="seachMsg.month" placeholder="请选择月份" @change="selectMonth" class="selectItem">
        <el-option v-for="(item,key) in monthList" :key="key" :label="item.txt" :value="item.val"></el-option>
      </el-select>
      <!-- 选择出粮方式 -->
      <el-select style="width:200px;" v-if="buSelectedLocationType === 2" v-model="seachMsg.payrollTimesType" placeholder="选择出粮方式" @change="selectPayrollTimesType" class="selectItem">
         <el-option v-for="(item,key) in payrollTimesTypes" :key="key" :label="item.txt" :value="item.val"></el-option>
      </el-select>
      <el-input class="selectItem" placeholder="请输入关键字" v-model="filter.searchKey"></el-input>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-if="!isShowLoading && buSelectedLocationType === 1"  :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" :row-key="getRowKeys" heigth="200" @row-click="openRowFun">
      <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
      <el-table-column sortable prop="staffNo" label="员工编号" width="100" fixed></el-table-column>
      <el-table-column prop="nameChinese" label="姓名" width="200" fixed></el-table-column>
      <el-table-column sortable prop="position" label="员工职位" width="200"></el-table-column>
      <el-table-column sortable prop="dateOfJoining" label="入职日期" width="100"></el-table-column>
      <el-table-column sortable prop="dateOfLeaving" label="离职日期" width="100"></el-table-column>
      <el-table-column sortable prop="salary" label="基本工资" width="100"></el-table-column>
      <el-table-column sortable prop="taxableItemsAmount" label="应税项目总额" width="140"></el-table-column>
      <el-table-column sortable prop="holidayAmount" label="请假应扣总额" width="140"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="收入总额" width="100"></el-table-column>
      <el-table-column sortable prop="SIAmount" label="社保扣除" width="100"></el-table-column>
      <el-table-column sortable prop="HCAmount" label="公积金扣除" width="130"></el-table-column>
      <el-table-column sortable prop="grossPay" label="整个税前收入的总和" width="200"></el-table-column>
      <el-table-column sortable prop="specialDeductionAmount" label="专项附加扣除" width="140"></el-table-column>
      <el-table-column sortable prop="threshold" label="个税起征点扣除" width="160"></el-table-column>
      <el-table-column sortable prop="taxableWages" label="应税金额" width="100"></el-table-column>
      <el-table-column sortable prop="taxAmount" label="个人所得税" width="130"></el-table-column>
      <el-table-column sortable prop="claimAmount" label="报销总额" width="140"></el-table-column>
      <el-table-column sortable prop="notTaxableAmount" label="不应税金额" width="130"></el-table-column>
      <el-table-column sortable prop="adjAmount" label="调整金额" width="100"></el-table-column>
      <el-table-column sortable prop="reallyAmount" label="实发金额" width="100"></el-table-column>
      <el-table-column sortable prop="typeTxt" label="工资单状态" width="130"></el-table-column>
      <el-table-column label="操作" width="560">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-view"
            @click.stop="openFun(scope.$index, scope.row)"
          >详 细</el-button>
          <el-button
            size="mini"
            icon="el-icon-document-add"
            @click.stop="adjAmountFun(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >调整金额</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click.stop="confirmFun(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >审核工资单</el-button>
          <el-button
            size="mini"
            icon="el-icon-brush"
            @click.stop="rebuildStaffPayroll(scope.$index, scope.row)"
            v-if="fun_right && genPayrollSlip_right && scope.row.typeId == 2"
          >重新生成工资单</el-button>
          <el-button
            size="mini"
            icon="el-icon-document-add"
            @click.stop="openShowPayrollUpdate(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >重算薪资</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click.stop="deleteFun(scope.$index, scope.row)"
            v-if="fun_right && deletePayrollSlip_right && scope.row.typeId != 1"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-table v-if="!isShowLoading && buSelectedLocationType === 2"  :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" :row-key="getRowKeys" heigth="200" @row-click="openRowFun">
      <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
      <el-table-column sortable prop="staffNo" label="员工编号" width="100" fixed></el-table-column>
      <el-table-column prop="nameChinese" label="姓名" width="200" fixed></el-table-column>
      <el-table-column sortable prop="position" label="员工职位" width="100"></el-table-column>
      <el-table-column sortable prop="dateOfJoining" label="入职日期" width="100"></el-table-column>
      <el-table-column sortable prop="dateOfLeaving" label="离职日期" width="100"></el-table-column>
      <el-table-column sortable prop="salary" label="基本工资" width="100"></el-table-column>
      <el-table-column sortable prop="taxableItemsAmount" label="应税项目总额" width="140"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="收入总额" width="100"></el-table-column>
      <el-table-column sortable prop="MPFAmount" label="MPF扣除" width="120"></el-table-column>
      <el-table-column sortable prop="holidayAmount" label="请假应扣除" width="120"></el-table-column>
      <el-table-column sortable prop="grossPay" label="整个税前收入的总和" width="200"></el-table-column>
      <el-table-column sortable prop="claimAmount" label="报销总额" width="140"></el-table-column>
      <el-table-column sortable prop="notTaxableAmount" label="不应税金额" width="130"></el-table-column>
      <el-table-column sortable prop="adjAmount" label="调整金额" width="100"></el-table-column>
      <el-table-column sortable prop="reallyAmount" label="实发金额" width="100"></el-table-column>
      <el-table-column sortable prop="typeTxt" label="工资单状态" width="130"></el-table-column>
      <el-table-column label="操作" width="750">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-view"
            @click.stop="openFun(scope.$index, scope.row)"
          >详 细</el-button>
          <el-button
            size="mini"
            icon="el-icon-more-outline"
            @click.stop="openPayrollTimes(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >多次出粮</el-button>
          <!-- <el-button
            size="mini"
            icon="el-icon-s-operation"
            @click.stop="openSetMPFKey(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >调整MPF</el-button> -->
          <el-button
            size="mini"
            icon="el-icon-document-add"
            @click.stop="openShowPayrollUpdate(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >重算薪资</el-button>
          <el-button
            size="mini"
            icon="el-icon-document-add"
            @click.stop="adjAmountFun(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >调整金额</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click.stop="confirmFun(scope.$index, scope.row)"
            v-if="fun_right && approvePayrollSlip_right && scope.row.typeId != 1"
          >审核工资单</el-button>
          <el-button
            size="mini"
            icon="el-icon-brush"
            @click.stop="rebuildStaffPayroll(scope.$index, scope.row)"
            v-if="fun_right && genPayrollSlip_right && scope.row.typeId == 2"
          >重新生成工资单</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click.stop="deleteFun(scope.$index, scope.row)"
            v-if="fun_right && deletePayrollSlip_right && scope.row.typeId != 1"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
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
    <!-- MPF缴纳编辑 -->
    <el-dialog
      title="MPF缴纳编辑"
      :visible.sync="isShowMPFEdit"
      :close-on-click-modal="false"
      width="80%"
    >
      <payrollTimEditMPF
        v-if="isShowMPFEdit"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></payrollTimEditMPF>
    </el-dialog>
    <!-- 重算薪资窗口 -->
    <el-dialog
      title="重算薪资窗口"
      :visible.sync="isShowPayrollUpdate"
      :close-on-click-modal="false"
      width="80%"
    >
      <payrollUpdate
        v-if="isShowPayrollUpdate"
        :curInfo="curInfo"
        v-on:listenIsShowMask="listenIsShowMask"
      ></payrollUpdate>
    </el-dialog>    
  </div>
</template>
<script>
import staffPayrollDetail from "./staffPayrollDetail.vue";
import staffPayrollConfirm from "./staffPayrollConfirm.vue";
import buPayrollConfirm from "./buPayrollConfirm.vue";
import adjAmountEdit from "./adjAmountEdit.vue";
import payrollTimEditMPF from "./payrollTimEditMPF.vue";
import payrollUpdate from "./payrollUpdate.vue";
import {monthList,payrollTimesTypes,payrollListTypeTxt} from "@/lib/staticData.js";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    staffPayrollDetail,staffPayrollConfirm,buPayrollConfirm,adjAmountEdit,payrollTimEditMPF,payrollUpdate,pageInfo
  },
  name: "staffPayrollList",
  inject: ["reload"],
  data() {
    return {
      isShow: false,
      showList:false,
      payrollTimesTypes:[],
      insuredTypes:[],
      pageList:[],
      curInfo: {}, //当前内容
      regionBUlist: [], //单位列表
      buSelectedLocationType:1,//当前单位区域类型（对应强制缴纳类型）1，中国社保，2香港mpf
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      isShowConfirm: false, //是否显示确认工资单
      isShowbuConfirm: false, //是否显示单位确认工资
      isShowAdjAmountRemarks: false, //是否显示调整金额
      isShowMPFEdit: false, //是否显示mpf调整窗口
      isShowPayrollUpdate: false, //是否显示重算薪资窗口
      BUCode:'',
      seachMsg: {
        BUCode:"",
        year: "", //年份
        month: "", //月份
        insuredType:1,//缴纳类型1中国社保，2香港MPF
        payrollTimesType:1//是否允许多次出粮 1一次，2多次
      },
      hrCode: "",
      userInfo: {},
      filter: { searchKey: "", searchField: ["nameChinese", "staffNo", "position", "typeTxt"] },
      multipleSelection: [],//多选项目
      approvePayrollSlip_right: false, //审批工资单权限
      deletePayrollSlip_right: false, //删除工资单权限
      genPayrollSlip_right: false, //重新生成工资单
      approveBUPayroll_right: false, //确认单位工资单
      fun_right: false, //功能按钮
      monthList:[]
    };
  },
  computed:{
    pageInfo(){
      return {
        pageSize:8,
        reqParams:{
            isReq:false,
            url:"/server/api/v1/payroll/staff/staffPayrollList",
            data:{pageSize:8,BUCode:this.BUCode,year: parseInt(this.seachMsg.year),month: parseInt(this.seachMsg.month),payrollTimesType:this.seachMsg.payrollTimesType }
          }
        }
    },
    tableData(){
      this.showList = true;
      return this.pageList.map(item => {
        item.typeTxt = payrollListTypeTxt(item.typeId);
        item.dateOfJoining = this.$toolFn.timeFormat(item.dateOfJoining,"yyyy-MM-dd");
        item.dateOfLeaving = this.$toolFn.timeFormat(item.dateOfLeaving,"yyyy-MM-dd");
        item.netAmount = parseFloat(item.grossPay - item.taxAmount).toFixed(2);
        item.reallyAmount = parseFloat(item.grossPay - item.taxAmount + item.notTaxableItemsAmount + item.claimAmount + item.adjAmount).toFixed(2);
        this.$nextTick(function() {
            var selectItems = this.multipleSelection;
            if (selectItems && selectItems.length > 0) {
              this.tableData.forEach(row => {
                selectItems.find(s => {
                  if (s.id === row.id) {
                    this.$refs.multipleTable.toggleRowSelection(row);
                  }
                });
              });
            }
          });
        return item;
      });
    }
  },
  beforeMount() {
    this.monthList = monthList();
    this.payrollTimesTypes = payrollTimesTypes();
    // this.insuredTypes = insuredTypes();
    this.userInfo = this.$toolFn.curUser;
    let access = this.userInfo.access;
    if (access.payrollMain.length > 0) {
      this.isShow = true;
      this.fun_right = true;
    }
    if (this.userInfo.roleTypeId == 2) {
      this.hrCode = this.userInfo.userCode;
    }
    if (access.payrollMain.indexOf(4) >= 0) {
      this.approveBUPayroll_right = true;
    }
    if (access.payrollMain.indexOf(2) >= 0) {
      this.approvePayrollSlip_right = true;
    }
    if (access.payrollMain.indexOf(3) >= 0) {
      this.genPayrollSlip_right = true;
      this.deletePayrollSlip_right = true;
    }
    this.multipleSelection = this.$toolFn.sessionGet("staffPayrollList_multipleSelection");
    if (this.buSelectedLocationType === 1){
      this.seachMsg.payrollTimesType = 1
    }
    this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      var date = new Date();
      this.seachMsg.year = date.getFullYear().toString();
      this.seachMsg.month = (date.getMonth()+1);
      if (this.$toolFn.sessionGet("staffPayrollListSearch")) {
          this.BUCode = this.$toolFn.sessionGet("staffPayrollListSearch").BUCode || this.BUCode;
          this.seachMsg.year = this.$toolFn.sessionGet("staffPayrollListSearch").year || this.seachMsg.year;
          this.seachMsg.month = this.$toolFn.sessionGet("staffPayrollListSearch").month || this.seachMsg.month;
      }
      this.getRegionBU();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$toolFn.sessionSet("staffPayrollList_multipleSelection",this.multipleSelection);
    },
    getRowKeys(row) {
      return row.id;
    },
    // 获取单位列表
    async getRegionBU() {
      var regionBUs = await this.$myApi.regionBUs({ isCache: true });
      if (regionBUs && regionBUs.length > 0) {
        this.regionBUlist = regionBUs;
        this.BUCode = this.BUCode != '' ? this.BUCode : this.regionBUlist[0].code;
        this.buSelectedLocationType = this.regionBUlist.filter(f=>{return f.code === this.BUCode })[0].locationType;
        if (this.buSelectedLocationType === 2){
            this.seachMsg.payrollTimesType = this.$toolFn.sessionGet("staffPayrollListSearch").payrollTimesType || this.seachMsg.payrollTimesType;
        }
        this.pageInfo.reqParams.isReq = true;
        this.$refs.pageInfo.getData(this.pageInfo);
      }
    },
    //0未审核1通过2有疑问，需重新审查
    typeIdTxt(typeId) {
      let r = "未审核";
      if (typeId == 1) {
        r = "已确认";
      } else if (typeId == 2) {
        r = "退回";
      }
      return r;
    },
    // 获取单位BUCode
    selectBU(val) {
      this.BUCode = val;
      this.seachMsg.BUCode = val;
      this.seachMsg.payrollTimesType = 1;
      this.buSelectedLocationType = this.regionBUlist.filter(f=>{return f.code === val})[0].locationType;
      if (this.buSelectedLocationType === 2){
        this.seachMsg.payrollTimesType = 1;
      }
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
      this.$toolFn.sessionSet("staffPayrollList_multipleSelection",'');
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
      
    },
    // 选择年份
    selectYear(val) {
      this.seachMsg.year = val;
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
      this.$toolFn.sessionSet("staffPayrollList_multipleSelection",'');
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
    },
    // 选择月份
    selectMonth(val) {
      this.seachMsg.month = val;
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
      this.$toolFn.sessionSet("staffPayrollList_multipleSelection",'');
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
    },
    //选择强制缴纳类型
    selectInsuredType(val){
      this.seachMsg.insuredType = val;
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
      this.$toolFn.sessionSet("staffPayrollList_multipleSelection",'');
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
    },
    //选择出粮方式
    selectPayrollTimesType(val){
      this.seachMsg.payrollTimesType = val;
      this.$toolFn.sessionSet("staffPayrollListSearch", this.seachMsg);
      this.$toolFn.sessionSet("staffPayrollList_multipleSelection",'');
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
    },
    openRowFun(row) {
      this.openFun(0, row);
    },
    // 打开多次出粮页面
    openPayrollTimes(index, res) {
      this.$store.commit({
        type: "setPayrollMainKey",
        payrollMainKey: "payrollTimes",
        payrollMainInfo: res
      });
    },
    /**
     * @description: 打开编辑MPF缴纳窗口
     */    
    openSetMPFKey(index, res) {
      this.curInfo = res;
      this.curInfo.hrCode = this.hrCode
      this.isShowMPFEdit = true;
    },
    /**
     * @description: 打开重新薪资窗口
     */    
    openShowPayrollUpdate(index, res) {
      this.curInfo = res
      this.curInfo.hrCode = this.hrCode
      this.curInfo.buSelectedLocationType = this.buSelectedLocationType
      this.isShowPayrollUpdate = true
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
        this.$myApi.http.post("/server/api/v1/payroll/staff/staffPayrollListDelete", data).then(res => {
            if (res.data.code == 0) {
              this.reload();
              this.$message.success("操作成功");
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
          promiseList.push(
            Promise.resolve(
              this.$myApi.http.post(
                  "/server/api/v1/payroll/staff/staffPayrollListDelete",
                  data
                ).then(res => {
                  if (res.data.code == 0) {
                    this.$message.success(
                      element.nameChinese + "工资单删除成功！"
                    );
                  } else {
                    this.$message.warning(element.nameChinese + res.data.msg);
                  }
                })
            )
          );
        }
        Promise.all(promiseList).then(() => {
          this.$message.success("删除成功！");
          this.reload();
        });
      });
    },
    // 审核选中项工资单
    async approveSelectedFun() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择项目");
        return;
      }
      this.curInfo = {
        hrCode: this.hrCode,
        typeId: 1,
        codeArr: this.multipleSelection.map(m => {
          return m.code;
        })
      };
      this.isShowConfirm = true;
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
        adjAmount: res.adjAmount,
        adjAmountRemarks: res.adjAmountRemarks
      };
      this.isShowAdjAmountRemarks = true;
    },
    // 重新生成工资单
    rebuildStaffPayroll(index, res) {
      var data = {
        code: res.code,
        hrCode: this.hrCode,
        staffCode: res.staffCode,
        year: res.year,
        month: res.month
      };
      this.$message("正在生成，请稍候!");
      this.$myApi.http.post("/server/api/v1/payroll/staff/rebuildStaffPayroll", data).then(res => {
          if (res.data.code == 0) {
            this.reload();
            this.$message.success("操作成功");
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    },
    // 确认单位出粮信息
    buPayrollConfirmFun(res) {
      this.curInfo = {
        BUCode: this.BUCode,
        hrCode: this.hrCode,
        year: this.seachMsg.year,
        month: this.seachMsg.month,
        payrollPeriod: res.payrollPeriod
      };
      this.isShowbuConfirm = true;
    },
    // 接收子组件发送信息
    listenIsShowMask() {
      this.isShowAddAccess = false;
      this.isShowConfirm = false;
      this.isShowbuConfirm = false;
      this.isShowAdjAmountRemarks = false;
      this.isShowMPFEdit = false;
      this.isShowPayrollUpdate = false;
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
  watch: {
    "BUCode":{
      handler: function(newVal) {
        if (newVal && newVal !=""){
          this.pageInfo.reqParams.isReq = true;
          console.log(this.seachMsg.payrollTimesType);
          this.pageInfo.reqParams.data.payrollTimesType = this.seachMsg.payrollTimesType;
          // this.$refs.pageInfo.getData(this.pageInfo);
        }
      }
    },
    "filter.searchKey":{
      handler: function() {
        this.$refs.pageInfo.searchKey(this.filter);
      }
    }
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