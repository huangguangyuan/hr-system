<template>
  <div class="staffPayrollInfoList wrap">
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
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column prop="staffNo" label="员工编号"></el-table-column>
      <el-table-column prop="nameChinese" label="第一姓名"></el-table-column>
      <el-table-column prop="nameEnglish" label="第二姓名"></el-table-column>
      <el-table-column prop="nameChinese" label="名称"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.photo?scope.row.photo:AvatarDefault"
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
import { deflate } from "zlib";
export default {
  name: "staffPayrollInfoList",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      regionBUlist: [], //单位列表
      BUCode: "", //角色类型
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      filter:{searchKey:'',searchField:['nameChinese','nameEnglish','salaryAmout']},
    };
  },
  mounted() {
    this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      this.getregionBU();
    },
    // 获取单位列表
    getregionBU() {
      var _this = this;
      var regionBUs = await _this.$myApi.regionBUs({isCache:true});
      if (regionBUs && regionBUs.length > 0) {
          this.regionBUlist = regionBUs;
          this.BUCode = this.$toolFn.sessionGet("staffBUCode")? this.$toolFn.sessionGet("staffBUCode"): this.regionBUlist[0].code;
          this.getData(this.BUCode);
        }
    },
    //获取项目数据列表
    getData(BUCode) {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollInfoList";
      var myData = { BUCode: BUCode };
      this.isShowLoading = true;
      this.$myApi.http
        .post(reqUrl, myData)
        .then(res => {
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
          console.log(this.tableData);
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
      this.BUCode = val;
      this.getData(this.BUCode);
      this.$toolFn.sessionSet("staffBUCode", val);
    },
    // 打开详细页面
    openFun(index, res, key) {
      this.$store.commit({
        type: "getWagesInfo",
        wagesInfo: res,
        wagesKey: key
      });
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






