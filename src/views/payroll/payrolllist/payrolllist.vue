<template>
  <div class="payrolllist">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>员工薪酬信息</span>
    </div>
    <el-divider></el-divider>
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe>
      <el-table-column sortable prop="staffNo" label="员工编号"></el-table-column>
      <el-table-column sortable prop="nameChinese" label="名称"></el-table-column>
      <el-table-column sortable prop="staffAlias" label="别名"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.photo?scope.row.photo:avatarDefault"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column sortable prop="genderTxt" label="性别"></el-table-column>
      <el-table-column label="操作" width="700px">
        <template slot-scope="scope">
          <!-- 缴纳社保/公积金信息 -->
          <el-button
            v-if="buSelectedLocationType === 1"
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="openFun(scope.$index, scope.row, 'insured')"
          >社保/公积金</el-button>
          <!-- MPF信息（香港） -->
          <el-button v-if="buSelectedLocationType === 2" size="mini" icon="hr-icon-shebaogongjijin" @click="openFun(scope.$index, scope.row, 'MPFinfo')">MPF信息</el-button>
          <!-- 专项扣除 -->
          <el-button
          v-if="buSelectedLocationType === 1"
            size="mini"
            icon="hr-icon-zhuanxiangkouchu"
            @click="openFun(scope.$index, scope.row, 'deduction')"
          >专项扣除</el-button>
          <!-- 津贴 -->
          <!-- <el-button
            size="mini"
            icon="hr-icon-gangweijintie"
            @click="openFun(scope.$index, scope.row, 'allowance')"
          >津 贴</el-button> -->
          <!-- 应税项目 -->
          <el-button
            size="mini"
            icon="hr-icon-yingshui"
            @click="openFun(scope.$index, scope.row, 'salaryItem')"
          >应税项目</el-button>
          <el-button
            size="mini"
            icon="hr-icon-yingshui"
            @click="openFun(scope.$index, scope.row, 'salaryItem2')"
          >非应税项目</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
  </div>
</template>
<script>
import {genderTxt} from "@/lib/staticData.js";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    pageInfo,busAndSearch
  },
  name: "payrolllist",
  inject: ["reload"],
  data() {
    return {
      pageList:[],
      searchInner: "", //搜索内容
      regionBUlist: [], //单位列表
      BUCodeSelected: "", //单位code
      buSelectedLocationType:'',// 当前单位区域类型（对应强制缴纳类型）1，中国社保，2香港mpf
      staffState: "", //员工状态
      staffID: "", //员工ID
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      isShowState: false, //是否显示状态
      avatarDefault:require("@/assets/images/avatar.png"), //默认头像
      filter:{searchKey:'',searchField:['account','staffNo','nameChinese','nameEnglish','staffAlias']}
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/staff/getAll",
            data:{ BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter};
    },
    tableData(){
      return this.pageList.map(item => {
        item.genderTxt = genderTxt(item.gender);
        return item;
      });
    },
    payrollCurPage(){
      return this.$store.state.payrollModule.payrollCurPage;
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    if ([2].indexOf(this.userInfo.roleTypeId) >= 0){//hr管理员
      this.isShow = true;
    }
    this.getRegionBU();
  },
  methods: {
    // 获取单位列表
    async getRegionBU() {
      var regionBUs = await this.$myApi.regionBUs({ isCache: true });
      if (regionBUs && regionBUs.length > 0) {
        this.regionBUlist = regionBUs;
        this.buSelectedLocationType = this.regionBUlist.find(f=>{return f.code === this.BUCodeSelected }).locationType;
      }
    },
    // 打开详细页面
    openFun(index, res, key) {
      this.$store.commit({
        type: "getPayrollInfo",
        payrollInfo: res,
        payrollKey: key
      });
    }
  },
  watch: {
    BUCodeSelected: {
      handler: function(newVal) {
        this.pageInfo.reqParams.isReq = true;
        this.$refs.pageInfo.getData(this.pageInfo);
        if (this.regionBUlist.length > 0){
          this.buSelectedLocationType = this.regionBUlist.find(f=>{return f.code === newVal }).locationType;
        }
        
      }
    },
    "filter.searchKey":{
      handler: function() {
        this.$refs.pageInfo.searchKey(this.busAndSearch.filter);
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






