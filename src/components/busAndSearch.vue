<template>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入关键字" v-model="filter.searchKey" >
        <el-select v-model="BUCodeSelected" slot="prepend" placeholder="请选择" style="width:200px;" @change="changeBu">
          <el-option v-for='(item,index) in buList' :key='index' :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-input>
    </div>
</template>
<script>
export default {
  name: "busAndSearch",
  props: ["busAndSearch_props"],
  data() {
    return {
      filter:{searchKey:'',searchField:[]},//搜索关键词及搜索字段
      BUCodeSelected:'',
      buList:[]
    };
  },
  computed: {

  },
  mounted() {
    this.filter = this.busAndSearch_props.filter;
    this.init();
  },
  methods:{
    async init(){
      this.buList = await this.getRegionBUList();
      if (this.buList.length > 0){
        //获取缓存默认选定bu
        this.BUCodeSelected = this.$toolFn.sessionGet('BUCodeSelected')?this.$toolFn.sessionGet('BUCodeSelected'):this.buList[0].code;
        //如果选中bu不存在，则获取第一个bu
        if (this.buList.filter(f => {return (this.BUCodeSelected == f)}).length > 0){
          this.BUCodeSelected = this.buList[0].code;
        }
        this.$emit('update:BUCodeSelected',this.BUCodeSelected);
      }
    },
    // 获取单位列表
    async getRegionBUList(){
      return await this.$myApi.regionBUs({isCache:true});
    },
    changeBu(val) {
      this.BUCodeSelected = val;
      this.$toolFn.sessionSet('BUCodeSelected',this.BUCodeSelected);
      this.$emit('update:BUCodeSelected',this.BUCodeSelected);
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
}
</style>






