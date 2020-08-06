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
import {SITxt,paymentIdTxt} from "@/lib/staticData.js";
export default {
  name: "SItemplate",
  inject: ["reload"],
  data() {
    return {
      tableData: [], //列表数据
      tableDataHC: [], //列表数据
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      curInfo: {}, //传值给子组件
      cityList: [], //城市列表
      cityCode: "b39f8ec0-676f-11e9-93b3-31525099b521" //城市代号
    };
  },
  mounted() {
    this.getCityList();
    this.getData();
  },
  methods: {
    //获取城市数据列表
    getData() {
      var reqUrl = "/server/api/v1/citySI/getAll";
      var myData = {
        cityCode: this.cityCode
      };
      this.isShowLoading = true;
      this.$myApi.http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data.filter(item => {
              if (item.paymentId == 2){
                item.paymentRatio1 = (item.paymentRatio *100) + "%";
                item.typeIdTxt = SITxt(item.typeId);
                item.paymentIdTxt = paymentIdTxt(item.paymentId);
                item.createTime = this.$toolFn.timeFormat(item.createTime);
                item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
                return item;
              }
            })
        })
        reqUrl = "/server/api/v1/cityHC/getAll";
        this.$myApi.http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableDataHC = res.data.data.filter(item => {
              if (item.paymentId == 2){
                item.paymentRatio1 = (item.paymentRatio *100) + "%";
                item.paymentIdTxt = paymentIdTxt(item.paymentId);
                item.createTime = this.$toolFn.timeFormat(item.createTime);
                item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
                return item;
              }
            })
        })
    },
    // 获取城市列表
    getCityList() {
      var reqUrl = "/server/api/v1/city/getAll";
      var data = {};
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.cityList = res.data.data;
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
      this.isShowAdd = res;
    },
    // 编辑
    handleEdit(index, res) {
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.isShowAdd = true;
    },
  },
  computed: {
    queryTableDate() {
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return this.tableData.slice(begin, end);
    },
    queryTableDateHC() {
      var begin = (this.curPage - 1) * this.pageSize;
      var end = this.curPage * this.pageSize;
      return this.tableDataHC.slice(begin, end);
    },
    pageTotal() {
      var pageTotal = Math.ceil(this.total / this.pageSize);
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
</style>
