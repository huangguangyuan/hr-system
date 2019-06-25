<template>
  <div class="wrap staffMain">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="教育资历" name="1">
          <staff-information></staff-information>
      </el-tab-pane>
      <el-tab-pane label="工作经历" name="2">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="3">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="4">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import staffInformation from './staffInformation.vue'
export default {
  name: "staffMain",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      activeName: "1"
    };
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  computed: {},
  components: {
    staffInformation
  }
};
</script>
<style scoped lang="scss">
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
</style>






