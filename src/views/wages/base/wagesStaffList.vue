<template>
  <div class="wagesStaffList">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>员工基本信息</span>
    </div>
    <el-divider></el-divider>
    <div class="addBtn-wrap" >
      <el-button type="primary" v-if="genPayrollSlip_right" @click="createSelectedItem">生成选中项工资单</el-button>
      <el-button type="danger" v-if="genPayrollSlip_right" @click='createAll'>生成所有工资单</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入关键字" v-model="filter.searchKey">
        <el-select
          v-model="BUCode"
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
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe ref="multipleTable" @selection-change="handleSelectionChange" :row-key="getRowKeys" >
      <el-table-column type="selection" width="55" :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="staffNo" label="员工编号"></el-table-column>
      <el-table-column prop="nameChinese" label="名称" width="200"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.photo?scope.row.photo:avatarDefault"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="genderTxt" label="性别"></el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="scope">
          <!-- 缴纳社保/公积金信息 -->
          <el-button
            size="mini"
            icon="el-icon-setting"
            @click="openFun(scope.$index, scope.row, 'staffWagesConfig')"
          >配 置</el-button>
          <!-- 生成员工工资单 -->
          <el-button v-if="scope.row.typeId == 1"
            size="mini"
            icon="el-icon-c-scale-to-original"
            @click="openFun(scope.$index, scope.row, 'salaryDate')"
          >薪水数据</el-button>
          <el-button
          v-if="scope.row.typeId == 1 && genPayrollSlip_right"
            size="mini"
            icon="el-icon-notebook-2"
            @click="genStaffPayroll(scope.$index, scope.row)"
          >生成工资单</el-button>
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
        :current-page="wagesCurPage"
        @current-change="curChange"
      ></el-pagination>
      <p>当前为第 {{wagesCurPage}} 页，共有 {{pageTotal}} 页</p>
    </div>
    <!-- 生成员工工资单 -->
    <el-dialog title="生成工资单" :visible.sync="isShowAddAccess" :close-on-click-modal="false">
      <gen-staff-payroll v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></gen-staff-payroll>
    </el-dialog>
  </div>
</template>
<script>
import genStaffPayroll from './genStaffPayroll.vue';
import {genderTxt}  from "@/lib/staticData.js";
export default {
  name: "wagesStaffList",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      regionBUlist: [], //单位列表
      buSelectedLocationType:1,//当前单位区域类型（对应强制缴纳类型）1，中国社保，2香港mpf
      BUCode: "", //单位类型
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      isShowState: false, //是否显示状态
      avatarDefault:require("@/assets/images/avatar.png"), //默认头像
      hrCode: "",
      userInfo:{},
      filter:{searchKey:'',searchField:['nameChinese','genderTxt']},
      multipleSelection: [],
      genPayrollSlip_right:false
    };
  },
  mounted() {
    
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.access.payrollMain.length > 0){
      this.isShow = true;
    }
    if (this.userInfo.roleTypeId == 2 ){
      this.hrCode = this.userInfo.userCode;
    }
    if (this.userInfo.access.payrollMain.indexOf(2) >= 0){
      this.genPayrollSlip_right = true;
    }
    this.multipleSelection = this.$toolFn.sessionGet("wagesStaffList_multipleSelection");
    this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      this.getRegionBU();
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        this.$toolFn.sessionSet("wagesStaffList_multipleSelection",this.multipleSelection);
      },
    createSelectedItem(){
      this.isShowAddAccess = true;
      this.curInfo.createItems = this.multipleSelection;
      this.curInfo.hrCode = this.hrCode;
      this.curInfo.typeId = 2;
    },
    createAll(){
      this.isShowAddAccess = true;
      //this.curInfo.createItems = this.queryTableDate;
      this.curInfo.createItems = this.tableData;
      this.curInfo.hrCode = this.hrCode;
      this.curInfo.typeId = 2;
    },
    getRowKeys(row) {
      return row.id
    },
    // 获取单位列表
    async getRegionBU() {
      var regionBUs = await this.$myApi.regionBUs({isCache:true});
      if (regionBUs && regionBUs.length > 0) {
          this.regionBUlist = regionBUs;
          this.BUCode = this.$toolFn.sessionGet("staffBUCode")? this.$toolFn.sessionGet("staffBUCode"): this.regionBUlist[0].code;
          this.buSelectedLocationType = this.regionBUlist.filter(f=>{return f.code === this.BUCode})[0].locationType;
          console.log(this.buSelectedLocationType);
          this.getData(this.BUCode);
        }
    },
    //获取项目数据列表
    getData(BUCode) {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollInfoList";
      var myData = { BUCode: BUCode };
      this.isShowLoading = true;
      this.$myApi.http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.map(item => {
              // 性别
              item.genderTxt = genderTxt(item.gender);
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
              if (selectItems){
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
    },
    // 获取当前页数
    curChange(val) {
      this.$store.commit({
        type: "getWagesCurPage",
        wagesCurPage: val
      });
    },
    // 获取单位BUCode
    selectFun(val) {
      this.BUCode = val;
      this.getData(this.BUCode);
      this.buSelectedLocationType = this.regionBUlist.filter(f=>{return f.code === val})[0].locationType;
      this.$toolFn.sessionSet("staffBUCode", val);
    },
    // 打开详细页面
    openFun(index, res, key) {
      res.buSelectedLocationType = this.buSelectedLocationType;
      this.$store.commit({
        type: "getWagesInfo",
        wagesInfo: res,
        wagesKey: key
      });
    },
    // 生成工资单
    genStaffPayroll(index, res){
      this.isShowAddAccess = true;
      this.curInfo = res;
      this.curInfo.createItems = [];
      this.curInfo.hrCode = this.hrCode;
      this.curInfo.typeId = 1;
    },
    // 接收子组件发送信息
    listenIsShowMask() {
      this.isShowAddAccess = false;
    }
  },
  computed: {
    queryTableDate() {
      let tableData = this.tableData;
      if (this.filter.searchKey != ""){
        tableData = this.$toolFn.searchFun(tableData,this.filter);
      }
      this.total = tableData.length;
      var begin = (this.wagesCurPage - 1) * this.pageSize;
      var end = this.wagesCurPage * this.pageSize;
      return tableData.slice(begin, end);
    },
    pageTotal() {
      var pageTotal = Math.ceil(this.total / this.pageSize);
      return pageTotal;
    },
    wagesCurPage(){
      return this.$store.state.wagesModule.wagesCurPage;
    }
  },
  components: {
    genStaffPayroll
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
  box-sizing: border-box;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.payrolllist {
  .photo {
    width: 35px;
    height: 35px;
    border-radius: 5px;
  }
}
</style>






