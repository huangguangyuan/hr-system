<template>
  <div class="holidaysApplyList">
    <div>
      <el-radio-group v-model="holidayTypeSelected">
        <el-radio-button
          v-for="item in holidaysTypeList"
            :key="item.typeId"
            :label="item.typeId"
          @click.native.prevent="changeType(item.typeId)"
        >{{item.val}}</el-radio-button>
      </el-radio-group>
    </div>
    <br />
    <!-- 列表内容 -->
    <div v-show="holidayTypeSelected !== '999'">
      <el-table v-loading="isShowLoading" :data="tableData" stripe show-summary sum-text="合计" >
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="开始日期" v-if="props.row.startTime">
                <span>{{props.row.startTime}}</span>
              </el-form-item>
              <el-form-item label="结束日期"  v-if="props.row.endTime">
                <span>{{props.row.endTime}}</span>
              </el-form-item>
              <el-form-item label="是否带薪"  v-if="props.row.isWithpay && props.row.isWithpay == 1">
                <span>{{props.row.isWithpayTxt}}</span>
              </el-form-item>
              <el-form-item label="扣除金额"  v-if="props.row.totalAmount && props.row.totalAmount!=0">
                <span>{{props.row.totalAmount}}</span>
              </el-form-item>
              <el-form-item label="申请日期"  v-if="props.row.createTime">
                <span>{{props.row.createTime}}</span>
              </el-form-item>            
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="申请时间">
          <template slot-scope="props">
            <span>{{props.row.createTime || props.row.applyDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDay" label="假期天数"></el-table-column>
        <el-table-column prop="startDate" label="开始日期"></el-table-column>
        <el-table-column prop="endDate" label="结束日期"></el-table-column> 
        <el-table-column prop="hisTypeIdTxt" label="类型"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </el-table>
      <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    </div>
    <div v-show="holidayTypeSelected === '999'">
      <el-table v-loading="isShowLoading" :data="willLeaves">
        <el-table-column prop="createTime" label="申请时间"></el-table-column>
        <el-table-column prop="totalDay" label="假期天数"></el-table-column>
        <el-table-column prop="startDate" label="开始日期"></el-table-column>
        <el-table-column prop="endDate" label="结束日期"></el-table-column>
        <el-table-column prop="typeIdTxt" label="类型"></el-table-column>
        <el-table-column prop="isWithpayTxt" label="是否带薪"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import pageInfo from "@/components/pageInfo.vue";
export default {
  components: {
    pageInfo
  },
  name: "holidaysApplyList",
  inject: ["reload"],
  props: ["staffCode_props"],
  data() {
    return {
      holidayTypeSelected: 1,
      holidaysTypeList: [],
      pageList:[],
      willLeaves:[],
      curInfo: {},
      isShowAddAccess: false, //是否显示新增权限页面
      isShowDetails:false,//是否显示表单详情
      isShowLoading: false, //是否显示loading页
      staffCode: this.staffCode_props
    };
  },
  computed:{
    pageInfo(){
      return {reqParams:{isReq:false,url:"/server/api/v1/staff/holidaysApply/staffLeaves",data:{ staffCode: this.staffCode,typeId: parseInt(this.holidayTypeSelected) }}}
    },
    tableData(){
      return this.pageList.map(item => {
          item.applyDate = this.$toolFn.timeFormat(item.applyDate,"yyyy-MM-dd");
          item.isWithpayTxt = item.isWithpay == 1?'是':'否';
          item.hisTypeIdTxt = item.hisTypeId == 2?'系统结算':item.hisTypeId == 3?'管理员录入':'员工发起';
          item.createTime = item.createTime? this.$toolFn.timeFormat(item.createTime,"yyyy-MM-dd"):null;
          item.startDate = item.startDate? this.$toolFn.timeFormat(item.startDate,"yyyy-MM-dd"):null
          item.endDate = item.endDate? this.$toolFn.timeFormat(item.endDate,"yyyy-MM-dd"):null
          return item;
      });
    },
    staffInfo() {
      return this.$store.state.staffModule.staffInfo;
    }
  },
  mounted() {
    this.getHolidaysApplyTypeFun();
  },
  methods: {
    changeType(typeId){
      this.holidayTypeSelected = typeId;
      this.willLeaves = [];
      if (this.holidayTypeSelected === '999'){
        this.isShowLoading = true;
        var reqUrl = "/server/api/v1/staff/holidaysApply/getWillLeaves";
        this.$myApi.http.post(reqUrl, {staffCode: this.staffCode}).then(res => {
          if (res.data.code === 0) {
            this.isShowLoading = false
            this.willLeaves = res.data.data.map(item => {
                item.createTime = this.$toolFn.timeFormat(item.createTime,"yyyy-MM-dd");
                item.isWithpayTxt = item.isWithpay == 1?'是':'否';
                item.startDate = this.$toolFn.timeFormat(item.startDate,"yyyy-MM-dd")
                item.endDate = this.$toolFn.timeFormat(item.endDate,"yyyy-MM-dd")
                let holidaysType = this.holidaysTypeList.find(f=>{ return f.typeId.toString() === item.typeId.toString()})
                if (holidaysType){
                  item.typeIdTxt = holidaysType.val
                }
                return item;
            });
          }
        });        
      }else{
        this.pageInfo.reqParams.isReq = true;
        this.$refs.pageInfo.getData(this.pageInfo);
      }

    },
    // 获取请假类型
    getHolidaysApplyTypeFun() {
      var reqUrl = "/server/api/v1/staff/holidaysApply/getHolidaysApplyTypeId";
      this.$myApi.http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          this.holidaysTypeList = [...[{val:'将会休假',typeId:'999'}],...res.data.data];
          this.holidayTypeSelected = this.holidaysTypeList[0].typeId;
          this.changeType(this.holidayTypeSelected);
          // this.pageInfo.reqParams.isReq = true;
          // this.$refs.pageInfo.getData(this.pageInfo);
        }
      });
    },
    // 接收子组件发送信息
    listenIsShowMask() {
      this.isShowAddAccess = false;
      this.isShowDetails = false;
    },
    // 新增
    addFun() {
      this.isShowAddAccess = true;
      this.curInfo.staffCode = this.staffCode;
    },
    // 查看详情
    handleDetails(index, res){
      this.isShowDetails = true;
      this.curInfo = res;
    },
  }
};
</script>
<style scoped lang="scss">
.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled){
box-shadow:0 0 0 0 #f28c38;
}
.table-expand{
    display: flex;flex-wrap: wrap;
    .el-form-item{
        width: 23%;box-sizing: border-box;border-bottom:1px #99a9bf solid;padding:0 10px;
        box-shadow: darkgrey 0px 2px 15px 1px;border-radius: 8px;
    }
}
</style>






