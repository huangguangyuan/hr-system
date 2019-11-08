<template>
  <div class="insured">
    <el-page-header @back="goBack" content="缴纳社保/公积金信息"></el-page-header>
    <el-divider></el-divider>

    <!-- 内容 -->
    <div class="container" v-if="isContent">
      <!-- 头部内容 -->
      <div class="my-top">
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="modifyFun(tableData)">修 改</el-button>
          <!-- <el-button type="primary" icon="el-icon-setting" @click="setStatus(tableData.status)">状 态</el-button> -->
          <el-button type="primary" icon="el-icon-delete" @click="handleDelete">删 除</el-button>
        </el-button-group>
      </div>
      <el-divider>基础信息</el-divider>
      <ul class="infoList">
        <!-- <li>
          <span>ID：</span>
          <span>{{tableData.id}}</span>
        </li> -->
        <li>
          <span>社保账号：</span>
          <span>{{tableData.SIAccount}}</span>
        </li>
        <li>
          <span>社保城市：</span>
          <span>{{tableData.SICity}}</span>
        </li>
        <li>
          <span>该地社保首次购买社保：</span>
          <span>{{tableData.SICityFirst==1?'是':'否'}}</span>
        </li>
        <li>
          <span>社保基数：</span>
          <span>{{tableData.SIBase}}</span>
        </li>
        <li>
          <span>公积金账号：</span>
          <span>{{tableData.HCAccount}}</span>
        </li>
        <li>
          <span>公积金城市：</span>
          <span>{{tableData.HCCity}}</span>
        </li>
        <li>
          <span>该地首次购买公积金：</span>
          <span>{{tableData.HCCityFirst==1?'是':'否'}}</span>
        </li>
        <li>
          <span>公积金基数：</span>
          <span>{{tableData.HCRealityAoumt}}</span>
        </li>
        <li>
          <span>医疗保险卡号：</span>
          <span>{{tableData.medicalSchemeAccount}}</span>
        </li>
        <li>
          <span>户籍类型：</span>
          <span>{{tableData.householdIdTxt}}</span>
        </li>
        <li>
          <span>是否生效：</span>
          <span>{{tableData.status==1?'是':'否'}}</span>
        </li>
        <li>
          <span>备注：</span>
          <span>{{tableData.remarks}}</span>
        </li>
      </ul>
      <el-divider>{{tableData.SISchemeDetail.name}}</el-divider>
      <el-table :data="schemeSIList" stripe>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
        <el-table-column prop="baseLower" label="基数下线"></el-table-column>
        <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
        <el-table-column prop="typeIdTxt" label="类 型"></el-table-column>
        <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
      </el-table>
      <el-divider>{{tableData.HCSchemeDetail.name}}</el-divider>
      <el-table :data="schemeHCList" stripe>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="baseUpper" label="基数上限"></el-table-column>
        <el-table-column prop="baseLower" label="基数下线"></el-table-column>
        <el-table-column prop="paymentRatio" label="缴纳比例"></el-table-column>
        <el-table-column prop="paymentIdTxt" label="缴纳对象"></el-table-column>
      </el-table>
    </div>
    <!-- 无内容 -->
    <div class="noContent" v-else>
      <el-button type="primary" @click="addFun">添加社保/公积金方案</el-button>
      <p>暂无内容~</p>
    </div>
    <!-- 新增 -->
    <el-dialog
      title="添加社保/公积金方案"
      :visible.sync="isShowEditLayer"
      :close-on-click-modal="false"
      width="60%"
    >
      <edit-layer
        v-on:listenIsShowMask="listenIsShowMask"
        :curInfo="curInfo"
        v-if="isShowEditLayer"
      ></edit-layer>
    </el-dialog>
  </div>
</template>
<script>
import editLayer from "./editLayer.vue";
export default {
  name: "insured",
  inject: ["reload"],
  data() {
    return {
      tableData: {},
      schemeSIList: [], //社保方案列表
      schemeHCList: [], //公积金方案列表
      curInfo: {}, //当前内容
      isShowEditLayer: false, //是否显示新增页面
      isContent: false //是否有内容
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取项目数据列表
    getData() {
      var reqUrl = "/server/api/v1/payroll/staff/insured/item";
      var myData = { staffCode: this.payrollInfo.code };
      this.$http
        .post(reqUrl, myData)
        .then(res => {
          if (res.data.code == 0) {
            this.isContent = true;
            this.tableData = res.data.data;
            this.tableData.householdIdTxt = this.householdIdTxt(this.tableData.householdId);
            if (!res.data.data.SISchemeDetail){
              this.isContent = false;
              return;
            }
            this.schemeSIList = res.data.data.SISchemeDetail.schemeSIList.filter(f=>f.paymentId == 2).map(
              item => {
                switch (item.typeId) {
                  case 1:
                    item.typeIdTxt = "养老";
                    break;
                  case 2:
                    item.typeIdTxt = "医疗";
                    break;
                  case 3:
                    item.typeIdTxt = "工伤";
                    break;
                  case 4:
                    item.typeIdTxt = "生育";
                    break;
                  case 5:
                    item.typeIdTxt = "失业";
                    break;
                  case 6:
                    item.typeIdTxt = "大病";
                    break;
                  case 7:
                    item.typeIdTxt = "医疗保险";
                    break;
                }
                switch (item.paymentId) {
                  case 1:
                    item.paymentIdTxt = "公司";
                    break;
                  case 2:
                    item.paymentIdTxt = "个人";
                    break;
                }
                return item;
              }
            );
            this.schemeHCList = res.data.data.HCSchemeDetail.schemeHCList.filter(f=>f.paymentId == 2).map(
              item => {
                switch (item.paymentId) {
                  case 1:
                    item.paymentIdTxt = "公司";
                    break;
                  case 2:
                    item.paymentIdTxt = "个人";
                    break;
                }
                return item;
              }
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增
    addFun() {
      this.isShowEditLayer = true;
      this.curInfo = {
        staffCode: this.payrollInfo.code,
        BUCode: this.payrollInfo.BUCode,
        type: "add"
      };
    },
    // 编辑
    modifyFun(res) {
      this.isShowEditLayer = true;
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.curInfo.BUCode = this.payrollInfo.BUCode;
      this.curInfo.staffCode = this.payrollInfo.code;
    },
    // 设置状态
    setStatus(res) {
      var txt = "",
        status;
      if (res == 1) {
        txt = "此操作将会让数据失效, 是否继续?";
        status = 0;
      } else {
        txt = "此操作将会让数据生效, 是否继续?";
        status = 1;
      }
      this.$confirm(txt, "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/server/api/v1/payroll/staff/insured/update", {
              staffCode: this.payrollInfo.code,
              status: status
            })
            .then(res => {
              this.reload();
              this.$message.success("修改成功~");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/server/api/v1/payroll/staff/insured/delete", {
              staffCode: this.payrollInfo.code
            })
            .then(res => {
              if(res.data.code == 0){
                this.reload();
                this.$message.success("删除成功~");
              }else{
                this.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 监听子组件返回信息
    listenIsShowMask(res) {
      this.isShowEditLayer = res;
    },
    // 返回
    goBack() {
      this.$store.commit({
        type: "getPayrollInfo",
        payrollKey: "payrollList"
      });
    },
    householdIdTxt(id){
      var str = "";
      switch (id) {
        case 1:
          str = "外地农村";
          break;
        case 2:
          str = "外地城镇";
          break;
        case 3:
          str = "本地农村";
          break;
        case 4:
          str = "本地城镇";
          break;
        case 5:
          str = "港澳台";
          break;
        case 6:
          str = "外籍";
          break;
      }
      return str;
    }
  },
  computed: {
    payrollInfo() {
      return this.$store.state.payrollModule.payrollInfo;
    }
  },
  components: {
    editLayer
  }
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.infoList {
  display: flex;
  flex-wrap: wrap;
  li {
    list-style-type: none;
    width: calc(25% - 10px);
    padding: 12px 0;
    border: 1px solid #6ec4db;
    margin: 0 10px 10px 0;
    border-radius: 8px;
    text-align: center;
    color: #6ec4db;
    font-size: 14px;
    box-sizing: border-box;
  }
}
.noContent {
  padding: 100px 0;
  text-align: center;
  p {
    font-size: 14px;
    margin-top: 15px;
    color: #cccccc;
  }
}
</style>






