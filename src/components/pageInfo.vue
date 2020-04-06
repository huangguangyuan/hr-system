<template>
    <div class="pageInfo" >
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="curChange"></el-pagination>
      <slot name="pageSolt"></slot>
      <p>当前为第 {{curPage}} 页，共有 {{pageTotal}} 页</p>
    </div>
</template>
<script>
export default {
  name: "pageInfo",
  props: ["pageInfo_props"],
  data() {
    return {
      total: 0, //总计
      pageSize: 9, //页面数据条数
      curPage: 1, //当前页数
      pageType:1,//分页类型，1为前端分页，2为后端分页
      pageList:[],//页面显示列表
      list:[],//请求返回列表
      reqUrl:'',//请求地址
      reqData:{},//请求参数
      filter:{},//请求过滤
      isReq:true,//是否请求，用于组件加载后不需要请求的情况
      refresh:false,//刷新组件
      isLoading:false,//是否请求中
    };
  },
  computed: {
    pageTotal() {
      let pageTotal = Math.ceil(this.total / this.pageSize);
      return pageTotal;
    }
  },
  mounted() {
    this.getData(this.pageInfo_props);
  },
  methods:{
    setParam(p){
      this.pageInfo = p;
      this.total = this.pageInfo.total || this.total;
      this.refresh = this.pageInfo.refresh || this.refresh;
      this.pageSize = this.pageInfo.pageSize || this.pageSize;
      this.curPage = this.pageInfo.curPage || this.curPage;
      this.pageType = this.pageInfo.pageType || this.pageType;
      this.reqUrl = this.pageInfo.reqParams.url || this.reqUrl;
      this.reqData = this.pageInfo.reqParams.data || this.reqData;
      this.filter = this.pageInfo.reqParams.filter || this.filter;
      this.isReq = this.pageInfo.reqParams.isReq != undefined ? this.pageInfo.reqParams.isReq : this.isReq;
    },
    // 获取当前页数据
    curChange(val) {
      this.curPage = val;
      if (this.pageType == 2){
        this.getData();
      }else{
        this.pageList = this.pageFun(this.list);
      }
    },
    // 搜索关键字
    searchKey(filter) {
      if (this.pageType == 2){
        this.getData();
      }else{
        
      }
      if (filter.searchKey != ""){
        if (this.pageType == 2){
          this.getData();
        }else{
          let pageList = this.$toolFn.searchFun(this.list,filter);
          this.total = pageList.length;
          this.pageList = this.pageFun(pageList);
        }
      }else{
        if (this.pageType == 2){
          this.getData();
        }else{
          this.pageList = this.pageFun(this.list);
        }
      }
    },
    pageFun(list){
      let begin = (this.curPage - 1) * this.pageSize;
      let end = this.curPage * this.pageSize;
      return list.slice(begin, end);
    },
    //获取数据列表
    async getData(p) {
      if (p){this.setParam(p);}
      if (!this.isReq){return}
      if (this.pageType == 2){
        this.reqData.pageNo = this.curPage;
        this.reqData.pageSize = this.pageSize;
        this.reqData.searchKey = this.filter.searchKey;
      }
      this.isLoading = true;
      let res = await this.$myApi.post(this.reqUrl,this.reqData);
      this.isLoading = false;
      if (this.pageType == 2){
        this.pageList = res.list;
        this.total = res.total;
      }else{
        this.total = res.length;
        this.list = res;
        this.pageList = this.pageFun(this.list);
      }
    }
  },
  watch: {
    pageList: {
      handler: function(newVal) {
        this.$emit('update:pageList',newVal);
      }
    },
    isLoading: {
      handler: function(newVal) {
        this.$emit('update:isShowLoading',newVal);
      }
    },
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
</style>






