<template>
  <div class="schemeList">
    <div class="addBtn-wrap">
      <el-select v-model="typeId" placeholder="请选择" class="typeId" @change='changeType'>
        <el-option label="社保" value="1" v-if="BUInfo.locationType === 1"></el-option>
        <el-option label="公积金" value="2" v-if="BUInfo.locationType === 1"></el-option>
        <el-option label="香港MPF" value="3" v-if="BUInfo.locationType === 2"></el-option>
      </el-select>
      <el-button type="primary" @click="newAddFun">新 增</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="方案名称"></el-table-column>
      <el-table-column prop="typeIdTxt" label="类型"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" fixed="right" width="600px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="schemeSIFun(scope.$index, scope.row)"
            v-if="scope.row.typeId == '1'"
          >编辑社保缴纳明细</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="schemeHCFun(scope.$index, scope.row)"
            v-if="scope.row.typeId == '2'"
          >编辑公积金缴纳明细</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="isShowSchemeMPFFun(scope.$index, scope.row)"
            v-if="scope.row.typeId == '3'"
          >编辑香港MPF缴纳明细</el-button>
          <el-button size="mini" icon="el-icon-edit" @click="editFun(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 新增/编辑 -->
    <el-dialog title="新增/编辑方案" :visible.sync="isShowEdit" :close-on-click-modal="false" width="65%">
      <scheme-edit v-if="isShowEdit" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></scheme-edit>
    </el-dialog>
    <!-- 编辑社保 -->
    <el-dialog
      title="编辑社保"
      :visible.sync="isShowSchemeSI"
      :close-on-click-modal="false"
      width="65%"
    >
      <schemeSI v-if="isShowSchemeSI" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></schemeSI>
    </el-dialog>
    <!-- 编辑公积金 -->
    <el-dialog
      title="编辑公积金"
      :visible.sync="isShowSchemeHC"
      :close-on-click-modal="false"
      width="65%"
    >
      <schemeHC v-if="isShowSchemeHC" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></schemeHC>
    </el-dialog>
    <!-- 香港MPF -->
    <el-dialog
      title="香港MPF"
      :visible.sync="isShowSchemeMPF"
      :close-on-click-modal="false"
      width="65%"
    >
      <schemeMPF v-if="isShowSchemeMPF" v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></schemeMPF>
    </el-dialog>
  </div>
</template>
<script>
import schemeEdit from "./schemeEdit.vue";
import schemeSI from "./schemeSI.vue";
import schemeHC from "./schemeHC.vue";
import schemeMPF from "./schemeMPF.vue";
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    schemeEdit,schemeSI,schemeHC,schemeMPF,pageInfo
  },
  name: "schemeList",
  inject: ["reload"],
  data() {
    return {
      pageList: [],
      curInfo: {}, //记录当前内容信息
      typeId:'1',//方案类型
      isShowEdit: false, //是否显示新增
      isShowSchemeHC: false, //是否显示编辑公积金
      isShowSchemeSI: false, //是否显示编辑社保
      isShowSchemeMPF: false, //是否显示编辑香港MPF
      isShowLoading: false //是否显示loading页
    };
  },
  computed: {
    pageInfo(){
      if (this.BUInfo.locationType === 2){
        this.typeId = "3";
      }
      return {
        reqParams:{
            url:"/server/api/v1/insuredScheme/getAll",
            data:{BUCode:this.BUInfo.code,typeId:this.typeId}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        switch (item.typeId) {
          case 1:
            item.typeIdTxt = "社保";
            break;
          case 2:
            item.typeIdTxt = "公积金";
            break;
          case 3:
            item.typeIdTxt = "香港MPF";
            break;
        }
        item.createTime = this.$toolFn.timeFormat(item.createTime,"yyyy-MM-dd")
        return item;
      });
    },
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  },
  mounted() {
    if (this.BUInfo.locationType === 2){
      this.typeId = "3";
    }
  },
  methods: {
    // 接收子组件发送信息
    listenIsShowMask() {
      this.isShowEdit = false;
      this.isShowSchemeSI = false;
      this.isShowSchemeHC = false;
      this.isShowSchemeMPF = false;
    },
    // 添加
    newAddFun() {
      this.curInfo.type = "add";
      this.isShowEdit = true;
    },
    // 编辑
    editFun(index, res) {
      this.isShowEdit = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除
    handleDelete(index, item) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/insuredScheme/staffByInsuredScheme", { code: item.code }).then(res => {
              if (res.data.code == 0){
                  let staffs = res.data.data;
                  if (staffs.length > 0){
                    this.$confirm("此方案已有员工正在使用，删除会影响薪资计算，是否继续", "提 示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      this.$myApi.http.post("/server/api/v1/insuredScheme/delete", { id: item.id }).then(res => {
                        if (res.data.code == 0){
                          this.reload();
                          this.$message.success("删除成功！");
                        }else{
                          this.$message.error(res.msg);
                        }
                      });
                    })
                  }else{
                    this.$myApi.http.post("/server/api/v1/insuredScheme/delete", { id: item.id }).then(res => {
                        if (res.data.code == 0){
                          this.reload();
                          this.$message.success("删除成功！");
                        }else{
                          this.$message.error(res.msg);
                        }
                      });
                  }
              }else{
                this.$message.error(res.msg);
              }
            });
        })
    },
    // 选择方案类型
    changeType(res){
      this.typeId = res;
      this.$refs.pageInfo.getData(this.pageInfo);
    },
    // 编辑社保
    schemeSIFun(index, res) {
      this.curInfo = res;
      this.isShowSchemeSI = true;
    },
    // 编辑公积金
    schemeHCFun(index, res) {
      this.curInfo = res;
      this.isShowSchemeHC = true;
    },
    // 编辑香港MPF
    isShowSchemeMPFFun(index, res) {
      this.curInfo = res;
      this.isShowSchemeMPF = true;
    }
  }
};
</script>
<style scoped lang="scss">
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.addBtn-wrap {
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
}
.typeId{width: 200px;margin-right: 10px;}
</style>






