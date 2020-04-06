<template>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select class="BUCodeOptions" :class="searchKeyInpShow?'hasRight':''" v-model="BUCodeSelected" placeholder="请选择" style="width:200px;" @change="changeBu" v-if="BUCodeOptionsShow">
        <el-option v-for='(item,index) in buList' :key='index' :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-input class="searchKeyInp" placeholder="请输入关键字" v-model="filter.searchKey" v-if="searchKeyInpShow"></el-input>
    </div>
</template>
<script>
export default {
  name: "busAndSearch",
  props: ["busAndSearch_props"],
  data() {
    return {
      BUCodeOptionsShow:true,
      searchKeyInpShow:true,
      filter:{searchKey:'',searchField:[]},//搜索关键词及搜索字段
      BUCodeSelected:'',
      buList:[]
    };
  },
  computed: {
  },
  mounted() {
    this.init(this.busAndSearch_props);
  },
  methods:{
    setParam(p){
      this.filter = this.busAndSearch_props.filter;
      this.BUCodeOptionsShow = this.busAndSearch_props.BUCodeOptionsShow != undefined ? this.busAndSearch_props.BUCodeOptionsShow : this.BUCodeOptionsShow;
      this.searchKeyInpShow = this.busAndSearch_props.searchKeyInpShow != undefined ? this.busAndSearch_props.searchKeyInpShow : this.searchKeyInpShow;
      //获取输入bucode或缓存
      this.BUCodeSelected = (this.busAndSearch_props.BUCodeSelected && this.busAndSearch_props.BUCodeSelected != '') ? this.busAndSearch_props.BUCodeSelected :this.$toolFn.sessionGet('BUCodeSelected');
    },
    async init(p){
      if (p){this.setParam(p);}
      this.buList = await this.getRegionBUList();
      if (this.buList.length > 0){
        //如果选中bu不存在，则获取列表第一个bu
        if (this.buList.filter(f => {return (this.BUCodeSelected == f.code)}).length == 0){
          this.BUCodeSelected = this.buList[0].code;
        }
      }
    },
    // 获取单位列表
    async getRegionBUList(){
      return await this.$myApi.regionBUs({isCache:true});
    },
    changeBu(val) {
      this.BUCodeSelected = val;
    },
  },
  watch: {
    BUCodeSelected: {
      handler: function(newVal) {
        if (newVal != undefined){
          this.$toolFn.sessionSet('BUCodeSelected',newVal);
          this.$emit('update:BUCodeSelected',newVal);
        }

      }
    },
  }
};
</script>
<style scoped lang="scss">
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  /deep/ .hasRight .el-input__inner{
    background-color: #F5F7FA;
    color: #909399;
    border: 1px solid #DCDFE6;
    border-right: 0;
    border-radius: 4px;
    border-top-right-radius: 0;border-bottom-right-radius: 0;
  }
  /deep/ .searchKeyInp .el-input__inner{
        border-top-left-radius: 0;border-bottom-left-radius: 0;
  }
  
}
</style>






