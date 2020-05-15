<template>
  <div class="staffPayrollSummary wrap">
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
      <el-select multiple collapse-tags v-model="departmentCodeArr" placeholder="请选择部门" style="width:200px;" class="selectItem" :loading="departmentListLoading" loading-text="加载中，请稍后" @change="onSelectDepartment">
          <el-checkbox v-model="departmentSelectAlllChecked" @change='onSelectDepartmentAll'>全选</el-checkbox>
          <el-option v-for='(item,index) in departmentList' :key='index' :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-select multiple collapse-tags v-model="staffCode" placeholder="请选择员工" style="width:200px;" class="selectItem" :loading="staffListLoading" loading-text="加载中，请稍后" @change="onSelectStaff">
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
      <el-select
        multiple collapse-tags
        class="selectItem"
        style="width:200px;"
        v-model="searchMonthArr"
        placeholder="请选择月份"
        @change="onSelectMonth"
      >
        <el-checkbox v-model="monthSelectAlllChecked" @change='onSelectMonthAll'>全选</el-checkbox>
        <el-option v-for="(item,key) in monthList" :key="key" :label="item.txt" :value="item.val.toString()"></el-option>
        
      </el-select>
      <el-button type="primary" @click="onSearchSummary">确定</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="dataList" stripe>
      <el-table-column sortable prop="idNum" label="序号" width="100"></el-table-column>
      <el-table-column sortable prop="companyName" label="公司" width="100"></el-table-column>
      <el-table-column sortable prop="regionName" label="区域" width="100"></el-table-column>
      <el-table-column sortable prop="buName" label="单位" width="100"></el-table-column>
      <el-table-column sortable prop="departmentName" label="部门" width="100"></el-table-column>
      <el-table-column sortable prop="year" label="年份" width="100"></el-table-column>
      <el-table-column sortable prop="monthSet" label="月份" width="100"></el-table-column>
      <el-table-column sortable prop="staffNo" label="员工编号" width="100"></el-table-column>
      <el-table-column prop="nameChinese" label="第一姓名" width="100" ></el-table-column>
      <el-table-column sortable prop="position" label="员工职位" width="100"></el-table-column>
      <el-table-column sortable prop="dateOfJoining" label="入职日期" width="100"></el-table-column>
      <el-table-column sortable prop="dateOfLeaving" label="离职日期" width="100"></el-table-column>
      <el-table-column sortable prop="salary" label="基本工资" width="100" fixed></el-table-column>
      <el-table-column sortable prop="grossPay" label="税前工资" width="100"></el-table-column>
      <el-table-column sortable prop="taxableWages" label="应税金额" width="100"></el-table-column>
      <el-table-column sortable prop="taxableItemsAmount" label="应税收入合计" width="140"></el-table-column>
      <el-table-column sortable prop="SHAmount" label="社保扣除/公积金" width="100"></el-table-column>
      <el-table-column sortable label="个人调整" width="130"></el-table-column>
      <el-table-column sortable prop="taxAmount" label="应缴个税" width="130"></el-table-column>
      <el-table-column sortable prop="netAmount" label="未含报销的税后收入" width="130"></el-table-column>
      <el-table-column sortable prop="totalAmount" label="收入总额" width="100"></el-table-column>
      <el-table-column sortable prop="SIAmount" label="社保扣除" width="100"></el-table-column>
      <el-table-column sortable prop="HCAmount" label="公积金扣除" width="130"></el-table-column>
      <el-table-column sortable prop="specialDeductionAmount" label="专项附加扣除" width="140"></el-table-column>
      <el-table-column sortable prop="threshold" label="个税起征点扣除" width="160"></el-table-column>
      <!-- <el-table-column sortable prop="notTaxableAmount" label="不应税金额" width="130"></el-table-column> -->
      <el-table-column sortable prop="adjAmount" label="调整金额" width="100"></el-table-column>
      <el-table-column sortable prop="claimAmount" label="不应税报销合计" width="140"></el-table-column>
      <el-table-column sortable prop="reallyAmount" label="实发金额" width="100"></el-table-column>
      <el-table-column sortable prop="typeTxt" label="工资单状态" width="130"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {monthList} from "@/lib/staticData.js";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    pageInfo
  },
  name: "staffPayrollSummary",
  inject: ["reload"],
  data() {
    return {
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
      staffCode:[],//选中员工代号
      staffList:[],//可选择员工列表
      staffListLoading:false,
      searchMonthArr:[],
      searchYear:0,
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
    InitializationFun() {
      this.monthList = monthList();
      this.getCompanyList();
      var date = new Date();
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
      let matchMonth = '1,2,3,4,5,6,7,8,9,10,11,12';
      if (matchMonth.indexOf(this.searchMonthArr.sort().join(',')) < 0){
        this.$message.error("请确保月份是连续的");
        return;
      }
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
      if (this.staffCode.length === 0){
        this.$message.error("请至少选择一个员工");
        return;
      }
      if (this.searchMonthArr.length === 0){
        this.$message.error("请至少选择一个月份");
        return;
      }
      let postData = {
        BUCode:this.BUCode,
        //searchMonthArr:this.searchMonthArr.map(Number),
        //staffCodeArr:this.staffCode,
        searchYear:Number.parseInt(this.searchYear),
        //departmentCodeArr:this.departmentCodeArr,
      }
      if (!this.staffSelectAlllChecked){
        postData.departmentCodeArr = this.departmentCodeArr
      }
      if (!this.departmentSelectAlllChecked){
        postData.staffCodeArr = this.staffCode
      }
      if (!this.monthSelectAlllChecked){
        postData.searchMonthArr = this.searchMonthArr.map(Number)
      }
      this.dataList = await this.$myApi.post('/server/api/v1/payroll/staff/staffPayrollSummaryV2',postData);
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
    /**
     * @description: 获取单位列表
     */
    async getRegionBU() {
      var regionBUs = await this.$myApi.regionBUs({isCache:true});
      if (regionBUs && regionBUs.length > 0) {
          this.regionBUlist = regionBUs;
        }
    },
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
        if (val.length > 0){
        this.staffListLoading = true;
        var reqUrl = "/server/api/v1/staff/departmentStaffs";
        var data = {departmentCode:this.departmentCodeArr};
        let departmentStaffs = await this.$myApi.post(reqUrl,data);
        for (let index = 0; index < departmentStaffs.length; index++) {
          this.staffList.push({name:departmentStaffs[index].nameChinese,code:departmentStaffs[index].code});
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
      this.staffCode = val;
      if (val.length === this.departmentList.length) {
        this.departmentSelectAlllChecked = true
      } else {
        this.departmentSelectAlllChecked = false
      }
    },
    /**
     * @description: 部门选择器选中选择所有事件
     */
    onSelectStaffAll() {
      this.staffCode = []
      if (this.staffSelectAlllChecked) {
        this.staffList.map((item) => {
          this.staffCode.push(item.code)
        })
      } else {
        this.staffCode = []
      }
      this.onSelectStaff(this.staffCode)
    }, 
    /**
     * @description: 部门选择器选中选择所有事件
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
.el-checkbox {
    padding-left: 20px;
  }
</style>






