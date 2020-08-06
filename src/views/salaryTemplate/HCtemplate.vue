<template>
  <div class="wrap HCtemplate" v-if="isShow">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>公积金模板</span>
      <el-button type="primary" size="small" @click="isShowAdd = true;curInfo.type='add'">添加模板</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select
        v-model="cityCode"
        slot="prepend"
        placeholder="请选择"
        style="width:200px;"
        @change="changeCity"
      >
        <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading='isShowLoading' :data="tableData" stripe style="width: 100%" border>
      <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
      <el-table-column prop="baseLower" label="基数下限"></el-table-column>
      <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
      <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 添加公积金模板 -->
    <el-dialog title="添加公积金模板" :visible.sync="isShowAdd" :close-on-click-modal="false">
      <addHCtemplate v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo" v-if="isShowAdd"></addHCtemplate>
    </el-dialog>
  </div>
</template>
<script>
import addHCtemplate from "./addHCtemplate.vue";
import {paymentIdTxt} from "@/lib/staticData.js";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    addHCtemplate,pageInfo
  },
  name: "HCtemplate",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      pageList: [],
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      curInfo: {}, //传值给子组件
      cityList: [], //城市列表
      cityCode:''
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/cityHC/getAll",
            data:{cityCode:this.cityCode}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.paymentIdTxt = paymentIdTxt(item.paymentId);
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.modifyTime = this.$toolFn.timeFormat(item.modifyTime);
        return item;
      });
    }
  },
  mounted() {
    if ([3].indexOf(this.$toolFn.curUser.roleTypeId) >= 0){//如果是平台管理员和用户管理员
      this.isShow = true;
    }
    this.getCityList();
  },
  methods: {
    // 获取城市列表
    getCityList() {
      var reqUrl = "/server/api/v1/city/getAll";
      var data = {};
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.cityList = res.data.data;
          if (this.cityList.length > 0){
            this.cityCode = this.cityList[0].code;
            this.pageInfo.reqParams.isReq = true;
            this.$refs.pageInfo.getData(this.pageInfo);
          }
        }
      });
    },
    // 选择城市
    changeCity(val) {
      this.cityCode = val;
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
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
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/cityHC/delete", { id: res.id }).then(() => {
              this.reload();
              this.$message("取消成功");
            });
        })
    },
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






