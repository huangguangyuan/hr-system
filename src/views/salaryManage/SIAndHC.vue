<template>
  <div class="wrap SItemplate">
    <!-- 头部内容 -->

    <!-- 搜索 -->
    <div class="search-wrap">
        <el-select
          v-model="cityCode"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="changeCity"
        >
          <el-option
            v-for="item in cityList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
    </div>
    <div class="my-top">
      <span>社保缴纳标准参考</span>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="queryTableDate" stripe style="width: 100%" border>
      <el-table-column prop="typeIdTxt" label="类型"></el-table-column>
      <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
      <el-table-column prop="baseLower" label="基数下限"></el-table-column>
      <el-table-column prop="paymentRatio1" label="缴纳比例"></el-table-column>
      <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
    </el-table>
    <br />
    <br />
     <div class="my-top">
      <span>公积金缴纳标准参考</span>
    </div>   
    <el-table v-loading='isShowLoading' :data="queryTableDateHC" stripe style="width: 100%" border>
      <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
      <el-table-column prop="baseLower" label="基数下限"></el-table-column>
      <el-table-column prop="paymentRatio1" label="缴纳比例"></el-table-column>
      <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "SItemplate",
  inject: ["reload"],
  data() {
    return {
      tableData: [], //列表数据
      tableDataHC: [], //列表数据
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      searchInner: "", //搜索关键字
      curInfo: {}, //传值给子组件
      cityList: [], //城市列表
      cityCode: "b39f8ec0-676f-11e9-93b3-31525099b521" //城市代号
    };
  },
  mounted() {
    var _this = this;
    _this.getCityList();
    _this.getData();
  },
  methods: {
    //获取城市数据列表
    getData() {
      var _this = this;
      var reqUrl = "/server/api/v1/citySI/getAll";
      var myData = {
        cityCode: _this.cityCode
      };
      _this.isShowLoading = true;
      _this.$http.post(reqUrl, myData).then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data.filter(item => {
              if (item.paymentId == 2){
                item.paymentRatio1 = (item.paymentRatio *100) + "%"
              switch (item.typeId) {
                case 1:
                  item.typeIdTxt = "养老";
                  break;
                case 2:
                  item.typeIdTxt = "医疗";
                  break;
                case 3:
                  item.typeIdTxt = "工伤";
                  break;
                case 4:
                  item.typeIdTxt = "生育";
                  break;
                case 5:
                  item.typeIdTxt = "失业";
                  break;
                case 6:
                  item.typeIdTxt = "大病";
                  break;
                default:
                  item.typeIdTxt = "未知";
              }
              switch (item.paymentId) {
                case 1:
                  item.paymentIdTxt = "公司";
                  break;
                case 2:
                  item.paymentIdTxt = "个人";
                  break;
                default:
                  item.typeIdTxt = "未知";
              }
              
              item.createTime = _this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
              return item;
              }
            }).sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
            });
        })

        reqUrl = "/server/api/v1/cityHC/getAll";
        _this.$http.post(reqUrl, myData).then(res => {
          _this.isShowLoading = false;
          _this.tableDataHC = res.data.data.filter(item => {
              if (item.paymentId == 2){
                item.paymentRatio1 = (item.paymentRatio *100) + "%"
              switch (item.paymentId) {
                case 1:
                  item.paymentIdTxt = "公司";
                  break;
                case 2:
                  item.paymentIdTxt = "个人";
                  break;
                default:
                  item.typeIdTxt = "未知";
              }
              
              item.createTime = _this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
              return item;
              }
            }).sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
            });
        })
    },
    // 获取当前页数
    curChange(val) {
      var _this = this;
      _this.curPage = val;
    },
    // 获取城市列表
    getCityList() {
      var _this = this;
      var reqUrl = "/server/api/v1/city/getAll";
      var data = {};
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.cityList = res.data.data;
        }
      });
    },
    // 选择城市
    changeCity(val) {
      this.cityCode = val;
      this.getData();
    },
    // 检测是否关闭表单
    listenIsShowMask(res) {
      var _this = this;
      _this.isShowAdd = res;
    },
    // 编辑
    handleEdit(index, res) {
      var _this = this;
      _this.curInfo = res;
      _this.curInfo.type = "modify";
      _this.isShowAdd = true;
    },
  },
  computed: {
    queryTableDate() {
      var _this = this;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return _this.tableData.slice(begin, end);
    },
    queryTableDateHC() {
      var _this = this;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return _this.tableDataHC.slice(begin, end);
    },
    pageTotal() {
      var _this = this;
      var pageTotal = Math.ceil(_this.total / _this.pageSize);
      return pageTotal;
    }
  },
  components: {
  }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
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
.search {
  margin: 20px auto;
}
</style>
