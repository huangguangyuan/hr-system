<template>
    <!-- 分页编码 -->
    <div class="pageInfo">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="curChange"
      ></el-pagination>
      <p>当前为第 {{curPage}} 页，共有 {{pageTotal}} 页</p>
    </div>
</template>
<script>
export default {
  name: "pageInfo",
  props: ["pageInfo_props"],
  data() {
    return {
      isShowLoading:false,
      total: 0, //总计
      pageSize: 6, //页面数据条数
      curPage: 1, //当前页数
      pageType:1,//分页类型，1为前端分页，2为后端分页
      pageList:[],
      reqUrl:'',
      reqData:{},
      isReq:true
    };
  },
  computed: {
    pageTotal() {
      var pageTotal = Math.ceil(this.total / this.pageSize);
      return pageTotal;
    }
  },
  mounted() {
    //this.setParam(this.pageInfo_props);
    this.getData(this.pageInfo_props);
  },
  methods:{
    setParam(p){
      this.pageInfo = p;
      this.total = this.pageInfo.total || this.total;
      this.pageSize = this.pageInfo.pageSize || this.pageSize;
      this.curPage = this.pageInfo.curPage || this.curPage;
      this.pageType = this.pageInfo.pageType || this.pageType;
      this.reqUrl = this.pageInfo.reqParams.url || this.reqUrl;
      this.reqData = this.pageInfo.reqParams.data || this.reqData;
      this.isReq = this.pageInfo.reqParams.isReq != undefined ? this.pageInfo.reqParams.isReq : this.isReq;
    },
    // 获取当前页数据
    curChange(val) {
      this.curPage = val;
      if (this.pageType == 2){
        this.getData();
      }else{
        var begin = (this.curPage - 1) * this.pageSize;
        var end = this.curPage * this.pageSize;
        this.pageList = this.pageList.slice(begin, end);
        this.$emit('update:pageList',this.pageList);
      }
    },
    //获取数据列表
    getData(p) {
      if (p){this.setParam(p);}
      if (!this.isReq){return}
      if (this.pageType == 2){
        this.reqData.pageNo = this.curPage;
        this.reqData.pageSize = this.pageSize;
      }
      this.$emit('update:isShowLoading',true);//显示加载中
      this.$http.post(this.reqUrl,this.reqData).then(res => {
          this.$emit('update:isShowLoading',false);//隐藏加载中
          if (this.pageType == 2){
            this.pageList = res.data.data.list;
            this.total = res.data.data.total;
          }else{
            this.pageList = res.data.data;
            this.total = res.data.data.length;
          }
          if (!Array.isArray(this.pageList)){
            console.log(res.data);
          }
          this.$emit('update:pageList',this.pageList);
        }).catch(err => {
          console.log(err);
        });
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






