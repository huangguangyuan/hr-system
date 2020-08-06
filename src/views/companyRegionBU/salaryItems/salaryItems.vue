<template>
  <div class="salaryItems">
    <div class="addBtn-wrap">
      <el-select v-model="salaryItemIds" multiple placeholder="请选择薪资应税模板" class='selectCode'>
        <el-option
          v-for="item in salaryItemTemplateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="addFun">确认添加</el-button>
      <el-button type="primary" @click="newAddFun">新 增</el-button>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe row-key="id">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="薪资项目"></el-table-column>
      <el-table-column prop="taxableTxt" label="是否应税项目"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
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
    <!-- 新增薪资应税项目 -->
    <el-dialog title="新增薪资应税项目" :visible.sync="isShowEdit" :close-on-click-modal="false" width="65%">
      <edit-layer v-if='isShowEdit' v-on:listenIsShowMask="listenIsShowMask" :curInfo="curInfo"></edit-layer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from './editLayer.vue'
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    editLayer,pageInfo
  },
  name: "salaryItems",
  inject: ["reload"],
  data() {
    return {
      pageList: [],
      curInfo: {}, //记录当前内容信息
      salaryItemTemplateList: [], //薪资应税项目列表
      salaryItemIds: [], //薪资应税项目ID列表
      isShowEdit: false, //是否显示新增权限页面
      isShowLoading: false //是否显示loading页
    };
  },
  computed: {
    pageInfo(){
      return {
        reqParams:{
            url:"/server/api/v1/bu/salaryItems",
            data:{BUCode:this.BUInfo.code}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime,"yyyy-MM-dd")
        item.taxableTxt = item.taxable == '1'?'是':'否';
        return item;
      });
    },
    BUInfo() {
      return this.$store.state.BUModule.BUInfo;
    }
  },
  mounted() {
    this.getSalaryItemTemplate();
  },
  methods: {
    // 获取薪资应对项目模板
    getSalaryItemTemplate() {
      var reqUrl = "/server/api/v1/salaryItem/getAll";
      this.$myApi.http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.salaryItemTemplateList = res.data.data;
        } else {
          this.$message.error(res.data.msg || res.data.code);
        }
      });
    },
    // 接收子组件发送信息
    listenIsShowMask() {
      this.isShowEdit = false;
    },
    // 添加薪资应税模板
    addFun() {
      if(this.salaryItemIds.length == 0){
          this.$message.info('请选择薪资应税模板');
          return false;
      }
      var reqUrl = '/server/api/v1/bu/selectedSalaryItems';
      var data = {BUCode:this.BUInfo.code,salaryItemIds:this.salaryItemIds}
      this.$myApi.http.post(reqUrl,data).then(res => {
          if(res.data.code == 0){
              this.reload();
              this.$message.success('添加成功！');
          }else{
              this.$message.error(res.data.msg);
          }
      })
    },
    // 添加
    newAddFun(){
        this.curInfo.type = 'add';
        this.isShowEdit = true;
    },
    // 编辑
    editFun(index, res) {
      this.isShowEdit = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/bu/salaryItemDelete", { code: res.code }).then(() => {
              this.reload();
              this.$message.success("删除成功！");
            });
        })
    }
  },
};
</script>
<style scoped lang="scss">
.selectCode {
  width: 220px;
  margin-right: 10px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.addBtn-wrap {
  margin: 10px auto;
  display: flex;
}
.selectCode{
  width: 600px;
}
</style>






