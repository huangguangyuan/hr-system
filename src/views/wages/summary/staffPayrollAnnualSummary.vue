<template>
  <div class="annualStaffPayroll wrap">
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-select
        v-model="seachMsg.BUCode"
        slot="prepend"
        placeholder="请选择"
        style="width:200px;"
        @change="selectFun"
        class="selectItem"
      >
        <el-option
          v-for="(item,index) in regionBUlist"
          :key="index"
          :label="item.name"
          :value="item.code"
        ></el-option>
      </el-select>
      
      <el-date-picker
        class="selectItem"
        v-model="seachMsg.year"
        type="year"
        placeholder="请选择年份"
        value-format="yyyy"
        format="yyyy"
        @change="selectYear"
      ></el-date-picker>
        <el-select v-model="seachMsg.staffCode" filterable placeholder="请选择" @change="staffPayrollYearFun">
        <el-option
          v-for="item in staffs"
          :key="item.code"
          :label="item.nameChinese  + (item.staffAlias && item.staffAlias != '' ? '(' + item.staffAlias + ' )': '')"
          :value="item.code">
        </el-option>
      </el-select>
    </div>
    <el-divider></el-divider>
    <staffPayrollYear v-if="isShowPayrollYear" :curInfo="curInfo"></staffPayrollYear>

  </div>
</template>
<script>
import staffPayrollYear from "../payroll/staffPayrollYear.vue";
export default {
  components: {
    staffPayrollYear
  },
  name: "annualPayrollEdit",
  inject: ["reload"],
  data() {
    return {
      seachMsg: {
        BUCode: "", //角色类型
        year: "2020", //年份
        staffCode: "",
        staffName:''
      },
      curInfo: {},
      regionBUlist: [], //单位列表
      pageList:[],
      isShowLoading: false, //是否显示loading页
      isShowEditLayer:false,
      staffs: [],
      isShowPayrollYear:false
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{
            isReq:false,
            url:"/server/api/v1/payroll/staff/staffPayrollMonth",
            data:{staffCode: this.seachMsg.staffCode,year: parseInt(this.seachMsg.year)}
          }
        }
    },
    tableData(){
      return this.pageList.map(item => {
        return item;
      });
    }
  },
  mounted() {
    this.getRegionBU();
  },
  methods: {
    // 获取单位列表
    async getRegionBU() {
      var regionBUs = await this.$myApi.regionBUs({isCache:true});
      if (regionBUs && regionBUs.length > 0) {
          this.regionBUlist = regionBUs;
          this.seachMsg.BUCode = this.$toolFn.sessionGet("annualPayrollEdit")? this.$toolFn.sessionGet("annualPayrollEdit").BUCode : this.regionBUlist[0].code;
          this.seachMsg.staffName = this.$toolFn.sessionGet("annualPayrollEdit") ? this.$toolFn.sessionGet("annualPayrollEdit").staffName : "";
          this.seachMsg.staffCode = this.$toolFn.sessionGet("annualPayrollEdit") ? this.$toolFn.sessionGet("annualPayrollEdit").staffCode : "";
          this.loadAll(this.seachMsg.BUCode);
        }
    },
    // 获取单位BUCode
    selectFun(val) {
      this.seachMsg.BUCode = val;
      this.seachMsg.staffName = '';
      this.loadAll(this.seachMsg.BUCode);
      this.$toolFn.sessionSet("annualPayrollEdit", this.seachMsg);
    },
    // 选择年份
    selectYear() {
      //this.getData(this.seachMsg.staffCode, parseInt(val));
      this.$toolFn.sessionSet("annualPayrollEdit", this.seachMsg);
      this.pageInfo.reqParams.isReq = true;
      this.$refs.pageInfo.getData(this.pageInfo);
    },
      loadAll(BUCode) {
        var reqUrl = "/server/api/v1/payroll/staff/allowPayrollStaffs";
        var myData = {
          BUCode: BUCode
        };
        this.$myApi.http.post(reqUrl, myData).then(res => {
          if (res.data.code == 0){
            this.staffs = res.data.data;
          }
        })
      },
      // 获取全年工资信息
      staffPayrollYearFun(item) {
        this.isShowPayrollYear = false;
        this.seachMsg.staffCode = item;
        this.curInfo = {
          code: this.seachMsg.staffCode,
          year: this.seachMsg.year,
          isShowYear: false
        };
        this.$nextTick(() => {
                this.isShowPayrollYear = true;
            })
        
      },
      // 接收子组件发送信息
      listenIsShowMask(res) {
        this.isShowEditLayer = res;
      }
    }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-wrap {
  margin: 20px auto;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  .selectItem {
    display: flex;
    min-width: 200px;
    align-items: center;
    font-size: 14px;
    color: rgb(237, 137, 55);
    margin-right: 15px;
  }
  .el-date-editor {
    margin-right: 15px;
  }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
}
</style>






