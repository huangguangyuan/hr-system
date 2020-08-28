<template>
  <div class="buLeavesSummary wrap">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select v-model="companyCode" placeholder="请选择公司" @change="changeCompanyCode" style="width:200px;" class="selectItem">
          <el-option v-for='(item,index) in companyList' :key='index' :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-select v-model="regionCode" placeholder="请选择区域" @change="changeRegionCode" style="width:200px;" class="selectItem">
          <el-option v-for='(item,index) in regionList' :key='index' :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-select class="selectItem"
        v-model="BUCode"
        placeholder="请选择单位"
        style="width:200px;"
        :loading="BUListLoading"
        loading-text="加载中，请稍后"
        @change="onSelectBU"
      >
        <el-option
          v-for="(item,index) in regionBUlist"
          :key="index"
          :label="item.name"
          :value="item.code"
        ></el-option>
      </el-select>
    </div>
    <div class="search-wrap">
      <el-select multiple collapse-tags v-model="departmentCodeArr" placeholder="请选择部门" style="width:200px;" class="selectItem" :loading="departmentListLoading" loading-text="加载中，请稍后" @change="onSelectDepartment">
          <el-checkbox v-model="departmentSelectAlllChecked" @change='onSelectDepartmentAll'>全选</el-checkbox>
          <el-option v-for='(item,index) in departmentList' :key='index' :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-select multiple collapse-tags v-model="staffCodeArr" placeholder="请选择员工" style="width:240px;" class="selectItem" :loading="staffListLoading" loading-text="加载中，请稍后" @change="onSelectStaff">
          <el-checkbox v-model="staffSelectAlllChecked" @change='onSelectStaffAll'>全选</el-checkbox>
          <el-option v-for='(item,index) in staffList' :key='index' :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-date-picker
        class="selectItem"
        v-model="searchYear"
        type="year"
        placeholder="选择年"
        value-format="yyyy"
        format="yyyy"
        @change="onSelectYear"
      ></el-date-picker>
      <el-button type="primary" @click="onSearchSummary">确定</el-button>
      <el-button type="primary" @click="onExplorSummary">导出文件</el-button>
      <el-button type="primary" @click="onFlash" plain>复位</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <div>
      <el-table v-loading="isShowLoading" :data="dataList" stripe v-if="dataList.length > 0 && showType === 1" height="520" >
          <!-- <el-table-column sortable prop="departmentName" label="部门" width="150" fixed></el-table-column> -->
          <el-table-column sortable prop="staffNo" label="员工编号" width="150" fixed></el-table-column>
          <el-table-column prop="nameChinese" label="第一姓名" width="200" fixed></el-table-column>
          <el-table-column sortable prop="position" label="员工职位" width="120" fixed></el-table-column>
          <el-table-column sortable prop="dateOfJoining" label="入职日期" width="120" fixed></el-table-column>
          <el-table-column sortable prop="dateOfLeaving" label="离职日期" width="120" fixed></el-table-column>
          <el-table-column label="年假">
            <el-table-column sortable prop="annual.adjust" label="调整" width="90"></el-table-column>
            <el-table-column sortable prop="annual.annualYear" label="年假" width="90"></el-table-column>
            <el-table-column sortable prop="annual.total" label="总数" width="90" ></el-table-column>
            <el-table-column sortable prop="annual.taken" label="请假天数" width="120"></el-table-column>
            <el-table-column sortable prop="annual.remarks" label="备注" width="150"></el-table-column>
            <el-table-column sortable prop="annual.bal" label="结余" width="90" >
              <template slot-scope="scope" >
                <span style="color: #ff0000">{{scope.row.annual.bal}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="病假">
              <el-table-column sortable prop="sick.sickYear" label="病假" width="90"></el-table-column>
              <el-table-column sortable prop="sick.taken" label="请假天数" width="120"></el-table-column>
              <el-table-column sortable label="结余" width="90">
                <template slot-scope="scope" >
                  <span style="color: #ff0000">{{scope.row.sick.bal}}</span>
                </template>
              </el-table-column>
          </el-table-column>
          <el-table-column sortable prop="noPay.taken" label="事假" width="90"></el-table-column>
          <el-table-column sortable prop="maternity.taken" label="产假/陪产假" width="150"></el-table-column>
          <el-table-column sortable prop="marriage.taken" label="婚假" width="90"></el-table-column>
          <el-table-column sortable prop="special.taken" label="特别假" width="90"></el-table-column>
      </el-table>
      <el-table v-loading="isShowLoading" :data="dataList" stripe v-if="dataList.length > 0 && showType === 2" height="585"  >
          <el-table-column prop="nameChinese" label="第一姓名" width="200" fixed></el-table-column>
          <!-- <el-table-column sortable prop="applyDate" label="生效时间" width="150" fixed></el-table-column> -->
          <el-table-column sortable prop="createTime" label="申请日期" width="150" fixed></el-table-column>
          <el-table-column sortable prop="startDate" label="开始时间" width="150" fixed></el-table-column>
          <el-table-column sortable prop="endDate" label="结束时间" width="150" fixed></el-table-column>
          <el-table-column label="年假">
            <el-table-column sortable prop="annual.taken" label="请假天数" width="120"></el-table-column>
            <el-table-column sortable prop="annual.total" label="累计" width="90"></el-table-column>
            <el-table-column sortable prop="annual.bal" label="结余" width="90" class="bg-set01">
                <template slot-scope="scope" >
                  <span style="color: #ff0000">{{scope.row.annual.bal}}</span>
                </template>
            </el-table-column>
            <el-table-column sortable prop="annual.remarks" label="备注" width="150"></el-table-column>
          </el-table-column>
          <el-table-column label="病假">
              <el-table-column sortable prop="sick.taken" label="请假天数" width="120"></el-table-column>
              <el-table-column sortable prop="sick.total" label="累计" width="90" ></el-table-column>
              <el-table-column sortable prop="sick.bal" label="结余" width="90">
                <template slot-scope="scope" >
                  <span style="color: #ff0000">{{scope.row.sick.bal}}</span>
                </template>
              </el-table-column>
              <el-table-column sortable prop="sick.remarks" label="备注" width="150"></el-table-column>
          </el-table-column>
          <el-table-column sortable prop="noPay.taken" label="事假" width="90"></el-table-column>
          <el-table-column sortable prop="noPay.remarks" label="备注" width="200"></el-table-column>
          <el-table-column sortable prop="maternity.taken" label="产假/陪产假" width="150"></el-table-column>
          <el-table-column sortable prop="maternity.remarks" label="备注" width="200"></el-table-column>
          <el-table-column sortable prop="marriage.taken" label="婚假" width="90"></el-table-column>
          <el-table-column sortable prop="marriage.remarks" label="备注" width="200"></el-table-column>
          <el-table-column sortable prop="special.taken" label="特别假" width="90"></el-table-column>
          <el-table-column sortable prop="special.remarks" label="备注" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {monthList} from "@/lib/staticData.js";
export default {
  components: {
  },
  name: "buLeavesSummary",
  inject: ["reload"],
  data() {
    return {
      showType:1,
      dataList: [],
      curInfo: {}, //当前内容
      isShowLoading: false, //是否显示loading页
      companyCode:'',//选中公司代号
      companyList:[],//可选择公司列表
      regionCode:'',//选中区域代号
      regionList:[],//可选择区域列表
      BUCode:'',//选中单位代号
      regionBUlist: [], //可选择单位列表
      BUListLoading:false,
      departmentSelectAlllChecked: false,// 部门是否全选
      departmentCodeArr:[],//选中部门代号
      departmentList:[],//可选择部门列表
      departmentListLoading:false,
      staffSelectAlllChecked: false,// 员工是否全选
      staffCodeArr:[],//选中员工代号
      staffList:[],//可选择员工列表
      staffListLoading:false,
      searchDate:[],
      searchYear:'',
      monthSelectAlllChecked: false,// 月份是否全选
      filter:{searchKey:'',searchField:['nameChinese','staffNo']},
      monthList:[]
    };
  },
  mounted() {
    this.InitializationFun();
  },
  methods: {
    // 初始化
     async InitializationFun() {
      this.monthList = monthList();
      this.getCompanyList();
      var date = new Date();
      let buLeavesSummaryData = this.$toolFn.sessionGet("buLeavesSummaryData");// 获取暂存数据
      if (buLeavesSummaryData){
      // this.companyCode = buLeavesSummaryData.companyCode;
        this.regionCode = buLeavesSummaryData.regionCode;
        if (this.regionCode && this.regionCode !== ''){
          await this.changeRegionCode(this.regionCode);
        }
        this.BUCode = buLeavesSummaryData.BUCode;
        if (this.BUCode && this.BUCode !== ''){
          await this.onSelectBU(this.BUCode);
        }
        this.departmentSelectAlllChecked = buLeavesSummaryData.departmentSelectAlllChecked;
        this.departmentCodeArr = buLeavesSummaryData.departmentCodeArr;
        if (this.departmentCodeArr && this.departmentCodeArr.length > 0){
          await this.onSelectDepartment(this.departmentCodeArr);
        }        
        this.staffSelectAlllChecked = buLeavesSummaryData.staffSelectAlllChecked;
        this.staffCodeArr = buLeavesSummaryData.staffCodeArr;
        this.monthSelectAlllChecked = buLeavesSummaryData.monthSelectAlllChecked;
        this.searchMonthArr = buLeavesSummaryData.searchMonthArr;
        this.searchYear = buLeavesSummaryData.searchYear;
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      this.searchYear = year.toString();
      if (this.searchYear > year){
        this.monthList = [];
        this.searchMonth = [];
      }else if (this.searchYear == year){
        this.monthList = monthList().filter(f=>{ return (month >= f.val) });
      }else{
        this.monthList = monthList();
      }
    },
     /**
     * @description: 查询工资汇总
     */
    async onSearchSummary(){
      this.dataList = [];
      if (this.regionCode === ''){
        this.$message.error("请选择区域");
        return;
      }

      if (this.BUCode === ''){
        this.$message.error("请选择单位");
        return;
      }
      if (this.departmentCodeArr.length === 0){
        this.$message.error("请至少选择一个部门");
        return;
      }
      if (this.staffCodeArr.length === 0){
        this.$message.error("请至少选择一个员工");
        return;
      }
      let postData = {
        BUCode:this.BUCode,
        searchYear:Number.parseInt(this.searchYear),
      }
      if (!this.departmentSelectAlllChecked){
        postData.departmentCodeArr = this.departmentCodeArr
      }
      if (!this.staffSelectAlllChecked){
        postData.staffCodeArr = this.staffCodeArr
      }
      this.$toolFn.sessionSet("buLeavesSummaryData",
      {
        regionCode:this.regionCode,
        BUCode:this.BUCode,
        departmentSelectAlllChecked:this.departmentSelectAlllChecked,
        departmentCodeArr:this.departmentCodeArr,
        staffSelectAlllChecked:this.staffSelectAlllChecked,
        staffCodeArr:this.staffCodeArr,
        searchDate:this.searchDate
      });
      
      if(this.staffCodeArr.length > 1){
        this.showType = 1;
        this.dataList = await this.$myApi.post('/server/api/v1/payroll/staff/buLeavesSummary',postData);
      }else {
        this.showType = 2;
        this.dataList = await this.$myApi.post('/server/api/v1/payroll/staff/staffLeavesSummary',postData);
      }
      
    },
     /**
     * @description: 导出假期汇总
     */
    async onExplorSummary(){
      if (this.regionCode === ''){
        this.$message.error("请选择区域");
        return;
      }

      if (this.BUCode === ''){
        this.$message.error("请选择单位");
        return;
      }
      if (this.departmentCodeArr.length === 0){
        this.$message.error("请至少选择一个部门");
        return;
      }
      if (this.staffCodeArr.length === 0){
        this.$message.error("请至少选择一个员工");
        return;
      }
      let postData = {
        BUCode:this.BUCode,
        searchYear:Number.parseInt(this.searchYear),
      }
      if (!this.departmentSelectAlllChecked){
        postData.departmentCodeArr = this.departmentCodeArr
      }
      if (!this.staffSelectAlllChecked){
        postData.staffCodeArr = this.staffCodeArr
      }
      postData.isExport = true;
      this.$message.success("正在生成中，请稍后...");
      let file = "";
      if(this.staffCodeArr.length > 1){
        file = await this.$myApi.post('/server/api/v1/payroll/staff/buLeavesSummary',postData);
      }else {
        file = await this.$myApi.post('/server/api/v1/payroll/staff/staffLeavesSummary',postData);
      }
      if (file !== ""){
        let a = document.createElement('a')
        a.href = file
        a.target = '_blank'
        a.click()
      }
    },
    async onFlash(){
      this.$toolFn.sessionSet("buLeavesSummaryData",
      {
        regionCode:"",
        BUCode:"",
        departmentSelectAlllChecked:"",
        departmentCodeArr:"",
        staffSelectAlllChecked:"",
        staffCodeArr:"",
        searchDate:[],
      });
      this.reload();
    },
    /**
     * @description: 获取公司列表
     */
    async getCompanyList(){
      const companys = await this.$myApi.companys({isCache:true});
      if (companys) {
          this.companyList = companys;
        }
        this.companyCode = this.companyList[0].code;
        if (this.companyCode){
          this.changeCompanyCode(this.companyCode);
        }
    },
    /**
     * @description: 选中公司事件
     */
    async changeCompanyCode(code){
      this.companyCode = code;
      const companyRegions = await this.$myApi.companyRegions({companyCode:this.companyCode,isCache:true});
      if (companyRegions && companyRegions.length > 0){
        //this.regionList.push({name:'选择全部',code:'all'});
        for (let index = 0; index < companyRegions.length; index++) {
          this.regionList.push({name:companyRegions[index].name,code:companyRegions[index].code});
        }
      }
    },

    /**
     * @description: 选中区域事件
     */
    async changeRegionCode(code){
      this.regionCode = code;
      this.BUCode = '';
      this.BUListLoading = true;
      const regionBUs = await this.$myApi.regionBUs({companyRegionCode:this.regionCode});
      this.regionBUlist = [];
      if (regionBUs && regionBUs.length > 0){
        // this.regionBUlist.push({name:'选择全部',code:'all'});
        for (let index = 0; index < regionBUs.length; index++) {
          this.regionBUlist.push({name:regionBUs[index].name,code:regionBUs[index].code});
        }
      }
      this.BUListLoading = false;
    },
    // /**
    //  * @description: 获取单位列表
    //  */
    // async getRegionBU() {
    //   var regionBUs = await this.$myApi.regionBUs({isCache:true});
    //   if (regionBUs && regionBUs.length > 0) {
    //       this.regionBUlist = regionBUs;
    //     }
    // },
    /**
     * @description: 选中单位事件
     */
    async onSelectBU(val) {
      this.BUCode = val;
      this.departmentCodeArr = [];
      this.departmentListLoading = true;
      const buDepartments = await this.$myApi.buDepartments({BUCode:this.BUCode});
      this.departmentList = [];
      if (buDepartments && buDepartments.length > 0){
        for (let index = 0; index < buDepartments.length; index++) {
          this.departmentList.push({name:buDepartments[index].name,code:buDepartments[index].code});
        }
      }
      this.departmentListLoading = false;
    },
    /**
     * @description: 选中部门事件
     */
    async onSelectDepartment(val) {
      if (val.length === this.departmentList.length) {
        this.departmentSelectAlllChecked = true
      } else {
        this.departmentSelectAlllChecked = false
      }
      this.departmentCodeArr = val;
      this.staffList = [];
      this.staffCodeArr = [];
      this.staffSelectAlllChecked = false;
      if (val.length > 0){
        this.staffListLoading = true;
        var reqUrl = "/server/api/v1/staff/departmentStaffs";
        var data = {departmentCode:this.departmentCodeArr};
        let departmentStaffs = await this.$myApi.post(reqUrl,data);
        for (let index = 0; index < departmentStaffs.length; index++) {
          this.staffList.push({name:departmentStaffs[index].nameChinese  + (departmentStaffs[index].staffAlias && departmentStaffs[index].staffAlias != '' ? '(' + departmentStaffs[index].staffAlias + ' )': ''),code:departmentStaffs[index].code});
        }
        this.staffListLoading = false;
      }
    },
    /**
     * @description: 部门选择器选中选择所有事件
     */
    onSelectDepartmentAll() {
      this.departmentCodeArr = []
      if (this.departmentSelectAlllChecked) {
        this.departmentList.map((item) => {
          this.departmentCodeArr.push(item.code)
        })
      } else {
        this.departmentCodeArr = []
      }
      this.onSelectDepartment(this.departmentCodeArr)
    },
    /**
     * @description: 选中员工事件
     */
    async onSelectStaff(val) {
      this.staffCodeArr = val;
      if (val.length === this.staffList.length) {
        this.staffSelectAlllChecked = true
      } else {
        this.staffSelectAlllChecked = false
      }
    },
    /**
     * @description: 部门选择器选中选择所有事件
     */
    onSelectStaffAll() {
      this.staffCodeArr = []
      if (this.staffSelectAlllChecked) {
        this.staffList.map((item) => {
          this.staffCodeArr.push(item.code)
        })
      } else {
        this.staffCodeArr = []
      }
      this.onSelectStaff(this.staffCodeArr)
    },
    /**
     * @description: 月份选择器选中选择所有事件
     */
    onSelectMonthAll() {
      this.searchMonthArr = []
      if (this.monthSelectAlllChecked) {
        this.monthList.map((item) => {
          this.searchMonthArr.push(item.val.toString())
        })
      }
    },

    // 选择年份
    onSelectYear(val) {
      this.searchYear = val;
      const myDate = new Date();
      const year = myDate.getFullYear();
      const month = myDate.getMonth() + 1;
      if (val > year){
        this.monthList = [];
        this.searchMonth = [];
      }else if (val == year){
        this.monthList = monthList().filter(f=>{ return (month >= f.val) });
      }else{
        this.monthList = monthList();

      }
    },

    // 选择月份
    onSelectMonth(val) {
      this.searchMonth = val;
      if (val.length === this.monthList.length) {
        this.monthSelectAlllChecked = true
      } else {
        this.monthSelectAlllChecked = false
      }
    },
  },
  watch: {
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
  .selectItem {
    display: flex;
    min-width: 250px;
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
.el-checkbox {
    padding-left: 20px;
  }
.el-table__row td{
  white-space:nowrap
}
.el-table /deep/ .cell{
  text-align: center;
}

/deep/ .el-table__body .el-table__row:last-child{
  background: #F5F7FA !important;
  font-size: 14px;
  border: 0;
}
</style>






