<template>
  <div class="staffInfo">
    <el-row :gutter="20" v-if='isContent'>
      <el-col :span="7">
        <div class="grid-content">应税及社保月份：<span>{{tableData.forMonthTxt}}</span></div>
        <!-- 0表示与当前出粮月份一致，其他为对应增减。例如（1：下月社保，-2上上月社保） -->
      </el-col>
      <el-col :span="7">
        <div class="grid-content">计粮周期起始日：<span>{{tableData.startDate}}号</span></div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content">计粮周期截止日：<span>{{tableData.endDateTxt}}</span></div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content">薪水发放日：<span>{{tableData.payDayTxt}}</span></div>
      </el-col>      
      <el-col :span="21">
        <div class="grid-content">备注：<span>{{tableData.remarks}}</span></div>
      </el-col>
    </el-row>
    <div class="noContent" v-else>
      暂无数据
    </div>
  </div>
</template>
<script>
export default {
  name: "staffInfo",
  inject: ["reload"],
  data() {
    return {
      tableData: {},
      isContent:false//是否有内容
    };
  },
  mounted() {
    this.getStaffInfo();
  },
  methods: {
    // 获取出粮周期
    getStaffInfo() {
      var reqUrl = "/server/api/v1/staff/getByCode";
      this.$myApi.http.post(reqUrl, {code:this.$toolFn.curUser.userCode}).then(res => {
        if (res.data.code == 0) {
          console.log(res.data)
        }
      });
    }
  },
  computed: {
  }
};
</script>
<style scoped lang="scss">
.grid-content {
  padding: 10px 20px;
  background-color: #d3dce6;
  margin-bottom: 15px;
  border-radius: 8px;
  font-size: 14px;
  color: #909399;
  span{
    font-size: 14px;
    font-weight: bold;
    color: #666;
  }
}
.selectCityCode {
  width: 220px;
  margin-right: 10px;
}
.noContent{
  line-height: 200px;text-align: center;color: #d3dce6;
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
  display: flex;
  justify-content: space-between;
  .el-input-group {
    width: 500px;
  }
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.addBtn-wrap {
  margin: 10px auto 30px;
  display: flex;
  justify-content: flex-start;
}
</style>