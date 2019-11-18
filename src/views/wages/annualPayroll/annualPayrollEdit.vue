<template>
  <div class="annualStaffPayroll wrap">
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
        class="selectItem"
        v-model="seachMsg.year"
        type="year"
        placeholder="请选择年份"
        value-format="yyyy"
        format="yyyy"
        @change="selectYear"
      ></el-date-picker>

      <el-autocomplete class="selectItem"
        popper-class="my-autocomplete"
        v-model="seachMsg.staffName"
        :fetch-suggestions="staffList"
        placeholder="请选择员工"
        @select="handleSelect">
        <i
          class="el-icon-user-solid el-input__icon"
          slot="suffix">
        </i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.nameChinese }}({{ item.staffNo }})</div>
        </template>
      </el-autocomplete>
    </div>
    <el-divider></el-divider>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe show-summary >
      <el-table-column prop="month" label="月份"></el-table-column>
      <el-table-column prop="taxableWages" label="应税工资"></el-table-column>
      <el-table-column prop="taxAmount" label="个人所得税"></el-table-column>
      <!-- <el-table-column prop="netAmount" label="税后工资"></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="modifyFun(scope.$index, scope.row)"
          >更 新</el-button>
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

    <!-- 编辑工资单 -->
    <el-dialog title="编辑工资单" :visible.sync="isShowEditLayer" :close-on-click-modal="false">
      <editLayer v-if="isShowEditLayer" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editLayer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
export default {
  name: "annualPayrollEdit",
  inject: ["reload"],
  data() {
    return {
      seachMsg: {
        BUCode: "", //角色类型
        year: "2019", //年份
        staffCode: "",
        staffName:''
      },
      curInfo: {},
      regionBUlist: [], //单位列表
      tableData: [],
      total: 0, //总计
      pageSize: 12, //页面数据多少
      curPage: 1, //当前页数
      isShowLoading: false, //是否显示loading页
      isShowEditLayer:false,
      restaurants: [],
    };
  },
  mounted() {
    this.getregionBU();
    //this.getData(this.staffCode, parseInt(this.year));
    //this.restaurants = this.loadAll();
    
  },
  methods: {
    // 获取单位列表
    async getregionBU() {
      var _this = this;
      var regionBUs = await _this.$myApi.regionBUs(_this,{isCache:true});
      if (regionBUs && regionBUs.length > 0) {
          this.regionBUlist = regionBUs;
          this.seachMsg.BUCode = this.$toolFn.sessionGet("annualPayrollEdit")? this.$toolFn.sessionGet("annualPayrollEdit").BUCode : this.regionBUlist[0].code;
          this.seachMsg.staffName = this.$toolFn.sessionGet("annualPayrollEdit") ? this.$toolFn.sessionGet("annualPayrollEdit").staffName : "";
          this.seachMsg.staffCode = this.$toolFn.sessionGet("annualPayrollEdit") ? this.$toolFn.sessionGet("annualPayrollEdit").staffCode : "";
          this.loadAll(this.seachMsg.BUCode);
        }
    },
    //获取项目数据列表
    getData(staffCode, year) {
      var reqUrl = "/server/api/v1/payroll/staff/staffPayrollMonth";
      var myData = {
        staffCode: staffCode,
        year: parseInt(year)
      };
      this.isShowLoading = true;
      this.$http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data;
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
      this.loadAll(this.seachMsg.BUCode);
      this.$toolFn.sessionSet("annualPayrollEdit", this.seachMsg);
    },
    // 选择年份
    selectYear(val) {
      this.getData(this.seachMsg.staffCode, parseInt(val));
      this.$toolFn.sessionSet("annualPayrollEdit", this.seachMsg);
    },
    staffList(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.nameChinese.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll(BUCode) {
        var reqUrl = "/server/api/v1/payroll/staff/allowPayrollStaffs";
        var myData = {
          BUCode: BUCode
        };
        this.$http.post(reqUrl, myData).then(res => {
          if (res.data.code == 0){
            this.restaurants = res.data.data;
            let staffCode = "",year = 0;
            if (this.$toolFn.sessionGet("annualPayrollEdit") && this.$toolFn.sessionGet("annualPayrollEdit").staffCode != "" && this.$toolFn.sessionGet("annualPayrollEdit").year != 0){
              this.getData(this.$toolFn.sessionGet("annualPayrollEdit").staffCode, this.$toolFn.sessionGet("annualPayrollEdit").year);
            }
          }
          
        })
        .catch(err => {
          console.log(err);
        });
      },
      handleSelect(item) {
        this.seachMsg.staffCode = item.code;
        this.seachMsg.staffName = item.nameChinese;
        console.log(this.seachMsg);
        this.$toolFn.sessionSet("annualPayrollEdit", this.seachMsg);
        this.getData(item.code,this.seachMsg.year);
      },
      // 编辑
      modifyFun(index, res) {
        this.isShowEditLayer = true;
        this.curInfo = res;
        this.curInfo.year = this.seachMsg.year;
        this.curInfo.staffCode = this.seachMsg.staffCode;
        //console.log(this.curInfo);
      },
      // 接收子组件发送信息
      listenIsShowMask(res) {
        this.isShowEditLayer = res;
      }
  },
  computed: {
    queryTableDate() {
      var _this = this;
      let tableData = _this.tableData;
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
    editLayer
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
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
}
</style>






