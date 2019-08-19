<template>
  <div class="payrolllist">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>员工基本信息</span>
    </div>
    <el-divider></el-divider>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入员工姓名" v-model="searchInner" @blur="searchFun">
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
        <el-button slot="append" icon="el-icon-search" @click="searchFun">搜 索</el-button>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
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
      <el-table-column prop="genderTxt" label="性别"></el-table-column>
      <el-table-column label="操作" width="600px">
        <template slot-scope="scope">
          <!-- 缴纳社保/公积金信息 -->
          <el-button
            size="mini"
            icon="hr-icon-gongjijinjiaoyimingxi"
            @click="openFun(scope.$index, scope.row, 'insured')"
          >社保/公积金</el-button>
          <!-- MPF信息（香港） -->
          <el-button size="mini" icon="hr-icon-shebaogongjijin" @click="openFun(scope.$index, scope.row, 'MPFinfo')">MPF信息</el-button>
          <!-- 专项扣除 -->
          <el-button
            size="mini"
            icon="hr-icon-zhuanxiangkouchu"
            @click="openFun(scope.$index, scope.row, 'deduction')"
          >专项扣除</el-button>
          <!-- 津贴 -->
          <el-button
            size="mini"
            icon="hr-icon-gangweijintie"
            @click="openFun(scope.$index, scope.row, 'allowance')"
          >津 贴</el-button>
          <!-- 应税项目 -->
          <el-button
            size="mini"
            icon="hr-icon-yingshui"
            @click="openFun(scope.$index, scope.row, 'salaryItem')"
          >应税项目</el-button>
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
  name: "payrolllist",
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
      staffState: "", //员工状态
      staffID: "", //员工ID
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      isShowState: false, //是否显示状态
      AvatarDefault:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" //默认头像
    };
  },
  mounted() {
    var _this = this;
    _this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      var _this = this;
      _this.getregionBU();
    },
    // 获取单位列表
    getregionBU() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUs";
      _this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          _this.regionBUlist = res.data.data;
          _this.BUCode = this.$toolFn.sessionGet("staffBUCode")
            ? this.$toolFn.sessionGet("staffBUCode")
            : res.data.data[0].code;
          _this.getData(this.BUCode);
        }
      });
    },
    //获取项目数据列表
    getData(BUCode) {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/getAll";
      var myData = { BUCode: BUCode };
      _this.isShowLoading = true;
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              // 性别
              switch (item.gender) {
                case "M":
                  item.genderTxt = "男";
                  break;
                case "F":
                  item.genderTxt = "女";
                  break;
                default:
                  item.genderTxt = "未知";
              }
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
          _this.total = _this.tableData.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前页数
    curChange(val) {
      var _this = this;
      _this.curPage = val;
    },
    // 获取单位BUCode
    selectFun(val) {
      this.BUCode = val;
      this.getData(this.BUCode);
      this.$toolFn.sessionSet("staffBUCode", val);
    },
    // 根据name字段查找数据
    searchFun() {
      var _this = this;
      if (_this.searchInner != "") {
        var reqUrl = "/server/api/v1/staff/getByOptions";
        var data = { nameChinese: _this.searchInner };
        _this.$http.post(reqUrl, data).then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              // 性别
              switch (item.gender) {
                case "M":
                  item.genderTxt = "男";
                  break;
                case "F":
                  item.genderTxt = "女";
                  break;
                default:
                  item.genderTxt = "未知";
              }
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
          _this.total = _this.tableData.length;
        });
      } else {
        _this.getData(this.BUCode);
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
  computed: {
    queryTableDate() {
      var _this = this;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return _this.tableData.slice(begin, end);
    },
    pageTotal() {
      var _this = this;
      var pageTotal = Math.ceil(_this.total / _this.pageSize);
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






