<template>
  <div class="wrap MPFtemplate">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>香港MPF模板</span>
      <el-button type="primary" size="small" @click="isShowAdd = true;curInfo.type='add'">添加模板</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="queryTableDate" stripe style="width: 100%" border>
      <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
      <el-table-column prop="baseLower" label="基数下限"></el-table-column>
      <el-table-column prop="paymentRatio1" label="缴纳比例"></el-table-column>
      <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {paymentIdTxt} from "@/lib/staticData.js";
export default {
  name: "MPFtemplate",
  inject: ["reload"],
  data() {
    return {
      tableData: [], //列表数据
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      curInfo: {}, //传值给子组件
      cityCode: "" //城市代号
    };
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    // 获取所有城市数据列表
    getAllData(){
      var reqUrl = "/server/api/v1/cityMPF/getAll";
      var myData = {
        cityCode: 'c4900a00-a7a4-11e9-bb56-837dd7ac904b'
      };
      this.isShowLoading = true;
      this.$myApi.http.post(reqUrl, myData).then(res => {
          this.isShowLoading = false;
          this.tableData = res.data.data
            .filter(item => {
              if (item.paymentId == 2){
              item.paymentRatio1 = (item.paymentRatio *100) + "%";
              item.paymentIdTxt = paymentIdTxt(item.paymentId);
              item.createTime = this.$toolFn.timeFormat(item.createTime);
              item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
              return item;
              }
            })
          this.total = this.tableData.length;
        })
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
    }
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
.el-table{
    margin: 30px auto 0;
}
</style>