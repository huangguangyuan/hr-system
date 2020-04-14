<template>
  <div class="cityTemplate">
    <div class="addBtn-wrap">
      <el-select v-model="cityCode" placeholder="请选择城市模板" class="selectCityCode"  v-if='!isContent'>
        <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-button type="primary" @click="selectCity" v-if='!isContent'>确认添加</el-button>
      <el-button type="primary" @click="editTemplageFun(tableData)" v-if='isContent'>修 改</el-button>
      <el-button type="danger" @click="handleDelete" v-if='isContent'>删 除</el-button>
    </div>
    <el-row :gutter="20" v-if='isContent'>
      <!-- <el-col :span="6">
        <div class="grid-content">id：{{tableData.id}}</div>
      </el-col> -->
      <el-col :span="6">
        <div class="grid-content">所在城市：<span>{{tableData.name}}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">创建时间：<span>{{tableData.createTime}}</span></div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content">备注：<span>{{tableData.remarks}}</span></div>
      </el-col>
    </el-row>
    <div class="noContent" v-else>
      暂无城市模板
    </div>
    <!-- 修改 -->
    <el-dialog title="修改城市模板信息" :visible.sync="isShowEdit" :close-on-click-modal="false" width="65%">
      <edit-city-template v-if='isShowEdit' v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></edit-city-template>
    </el-dialog>
  </div>
</template>
<script>
import editCityTemplate from './editCityTemplate.vue';
export default {
  name: "cityTemplate",
  inject: ["reload"],
  data() {
    return {
      tableData: {},
      cityCode: "", //城市code
      cityList: [], //城市模板列表
      curInfo: {},
      isShowEdit: false, //是否显示修改编辑页面
      isContent:false//是否有内容
    };
  },
  mounted() {
    this.getData(this.BUInfo.code);
    this.getCityCode();
  },
  methods: {
    //获取数据列表
    getData(BUCode) {
      var reqUrl = "/server/api/v1/bu/cityByBUCode";
      var myData = { BUCode: BUCode };
      this.$myApi.http.post(reqUrl, myData).then(res => {
          if(res.data.code == 0){
            this.tableData = res.data.data;
            this.tableData.createTime = this.$toolFn.timeFormat(this.tableData.createTime,"yyyy-MM-dd")
            this.isContent = true;
          }else{
            this.isContent = false;
          }
        })
    },
    // 获取城市模板
    getCityCode() {
      var reqUrl = "/server/api/v1/city/getAll";
      this.$myApi.http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.cityList = res.data.data;
        }
      });
    },
    // 选择城市模板
    selectCity() {
      if (this.cityCode == "") {
        this.$message.info("请选择城市模板");
        return false;
      } else {
        var reqUrl = "/server/api/v1/bu/selectedCity";
        var data = { cityCode: this.cityCode, BUCode: this.BUInfo.code };
        this.$myApi.http.post(reqUrl, data).then(res => {
          if (res.data.code == 0) {
            this.$message.success("添加成功！");
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    // 编辑城市模板
    editTemplageFun(res){
      this.curInfo = res;
      this.isShowEdit = true;
    },
    // 删除城市模板
    handleDelete() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示").then(() => {
          var reqUrl = "/server/api/v1/bu/cityDelete";
          var data = { code: this.tableData.code };
          this.$myApi.http.post(reqUrl, data).then(res => {
            if (res.data.code == 0) {
              this.reload();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info('取消操作');
        });
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowEdit = false;
    }
  },
  computed: {
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  },
  components: {
    editCityTemplate
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






