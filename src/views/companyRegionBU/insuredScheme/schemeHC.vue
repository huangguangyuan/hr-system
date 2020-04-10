<template>
  <div class="schemeHC">
    <!-- 头部内容 -->
    <div class="my-top">
      <el-button type="primary" size="small" @click="handleAdd(curInfo.code)">添加模板</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe style="width: 100%" border>
      <el-table-column prop="id" label="ID"></el-table-column>
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
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 添加公积金 -->
    <el-dialog title="添加公积金" append-to-body :visible.sync="isShowAdd" :close-on-click-modal="false">
      <schemeHCAdd v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfoNode" v-if="isShowAdd"></schemeHCAdd>
    </el-dialog>
  </div>
</template>
<script>
import schemeHCAdd from './schemeHCAdd.vue';
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    schemeHCAdd,pageInfo
  },
  name: "schemeHC",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      pageList: [],
      isShowAdd: false, //是否显示增加项目表单
      isShowLoading: false, //是否显示loading页
      curInfoNode: {}, //传值给子组件
      cityCode: "" //城市代号
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/bu/insuredScheme/hc/list",
            data:{schemeCode: this.curInfo.code}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.paymentIdTxt = item.paymentId == '1'?'公司':'个人';
        return item;
      });
    },
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  },
  mounted() {
    //this.getAllData();
  },
  methods: {
    // 监听子组件发过的触发函数
    listenIsShowMask(res) {
      this.isShowAdd = res;
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
      //this.getAllData();
    },
    // 添加模板
    handleAdd(res){
      this.curInfoNode = {
        type:'add',
        schemeCode:res
      }
      this.isShowAdd = true;
    },
    // 编辑
    handleEdit(index, res) {
      this.curInfoNode = res;
      this.curInfoNode.type = 'modify';
      this.curInfoNode.cityCode = this.curInfo.cityCode;
      this.isShowAdd = true;
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$myApi.http.post("/server/api/v1/bu/insuredScheme/hc/delete", { id: res.id }).then(res => {
              //this.getAllData();
              this.$refs.pageInfo.getData(this.pageInfo);
              this.$message.success("删除成功~");
            });
        })
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
.search {
  margin: 20px auto;
}
.el-table {
  margin: 30px auto 0;
}
</style>






