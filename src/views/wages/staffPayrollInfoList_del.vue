<template>
  <div class="staffPayrollInfoList wrap">
    <!-- 搜索 -->
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe>
      <el-table-column prop="staffNo" label="员工编号"></el-table-column>
      <el-table-column prop="nameChinese" label="第一姓名"></el-table-column>
      <el-table-column prop="nameEnglish" label="第二姓名"></el-table-column>
      <el-table-column prop="nameChinese" label="名称"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.photo?scope.row.photo:avatarDefault"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="salaryAmout" label="工资总额"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="openFun(scope.$index, scope.row, 'staffWagesConfig')"
          >详 细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
  </div>
</template>
<script>
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
export default {
  components: {
    approvalClaimDetails,pageInfo,busAndSearch
  },
  name: "staffPayrollInfoList",
  inject: ["reload"],
  data() {
    return {
      pageList:[],
      curInfo: {}, //当前内容
      regionBUlist: [], //单位列表
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      filter:{searchKey:'',searchField:['nameChinese','nameEnglish','salaryAmout']},
    };
  },
  mounted() {
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{//请求分页参数
            isReq:false,
            url:"/server/api/v1/payroll/staff/staffPayrollInfoList",
            data:{BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter};
    },
    tableData(){
      return this.pageList.map(item => {
        return item;
      });
    }
  },
  methods: {
    // 打开详细页面
    openFun(index, res, key) {
      this.$store.commit({
        type: "getWagesInfo",
        wagesInfo: res,
        wagesKey: key
      });
    },
  },
  watch: {
    BUCodeSelected: {
      handler: function(newVal) {
        this.pageInfo.reqParams.isReq = true;
        this.$refs.pageInfo.getData(this.pageInfo);
      }
    },
    "filter.searchKey":{
      handler: function(newVal) {
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






