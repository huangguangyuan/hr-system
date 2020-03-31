<template>
  <div class="wrap taxRateTable">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>税率表</span>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="dataList" stripe border>
      <el-table-column prop="year" label="年份"></el-table-column>
      <el-table-column prop="id" label="级数"></el-table-column>
      <el-table-column prop="txt" label="全年应纳税所得额"></el-table-column>
      <el-table-column prop="taxRate" label="税率"></el-table-column>
      <el-table-column prop="quickDeduct" label="速算扣除数"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { deflate } from 'zlib';
export default {
  name: "taxRateTable",
  inject: ["reload"],
  data() {
    return {
      dataList: [],
      isShowLoading: false,
    };
  },
  mounted() {
    
    this.getData();
  },
  methods: {
    //获取项目数据列表
    getData() {
      
      this.isShowLoading = true;
      var reqUrl = "/server/api/v1/payroll/taxRate";
      var myData = {};
      this.$myApi.http
        .post(reqUrl, myData)
        .then(res => {
          if (res.data.code == 0) {
            this.isShowLoading = false;
            this.dataList = res.data.data.map(item => {
              switch (item.id) {
                case 1:
                  item.txt = `不超过${item.upperLimited}元的部分`;
                  break;
                case 7:
                  item.txt = `超过${item.lowerLimited}元的部分`;
                  break;
                default:
                  item.txt = `超过${item.lowerLimited}元至${item.upperLimited}元的部分`;
              }
              item.taxRate = item.taxRate*100+'%';
              return item;
            });
          } else {
            this.$message("无法获取信息");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {}
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


