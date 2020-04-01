<template>
  <div class="balanceClaimDetails" v-loading="isShowLoading">
    <el-table :data="tableData" stripe>
      <el-table-column prop="title" label="报销项目名称"></el-table-column>
      <el-table-column prop="amount" label="报销金额"></el-table-column>
      <el-table-column prop="typeIdTxt" label="报销类型"></el-table-column>
      <el-table-column prop="remarks" label="备 注"></el-table-column>
    </el-table>
    <el-divider></el-divider>
    <el-timeline>
      <el-timeline-item
        v-for="item in approveHisList"
        :key="item.id"
        :timestamp="item.createTime"
        placement="top"
      >
        <el-card class="my-card">
          <p>操作员：{{item.operatorUser.name}}{{item.operatorUser.roleName?" ( "+item.operatorUser.roleName+" ) ":""}}</p>
          <p>操作行为：{{item.operatorUser.tip}}</p>
          <p>审批类型：{{item.typeIdTxt}}</p>
          <p>是否完结：{{item.finishFlagTxt}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <!-- 审批 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="结算月份：" prop="balanceMon">
        <el-select v-model="ruleForm.balanceMon" placeholder="请选择月份">
          <el-option v-for="(item,key) in monthList" :key="key" :label="item.txt" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {approveHisTypeTxt,monthList} from "@/lib/staticData.js";
export default {
  name: "balanceClaimDetails",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      isShowLoading:true,
      claimItem:{},
      tableData: [], //数据列表
      getClaimList: [], //审批类型
      approveHisList: [], //审批流程
      monthList:[],
      ruleForm: {
        balanceMon: "",
        remarks: ""
      },
      rules: {
        balanceMon: [
          { required: true, message: "请选择月份", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.monthList = monthList();
    this.init();
  },
  methods: {
    async init(){
      this.claimItem = await this.$myApi.staffClaim({claimCode:this.curInfo.code});
      this.claimTypes = await this.$myApi.getClaimTypeId();
      this.claimItem.details.map(item => {
        item.typeIdTxt = this.claimTypes.filter(child => {
          return child.typeId == item.typeId;
        })[0].val;
        return item;
      });
      this.tableData = this.claimItem.details;
      // 审批流程
      this.approveHisList = this.claimItem.approveHis.map(item => {
        item.createTime = this.$toolFn.timeFormat(item.createTime);
        item.finishFlagTxt = item.finishFlag == 0 ? "否" : "是";
        item.typeIdTxt = approveHisTypeTxt(item.typeId);
        return item;
      });
      this.isShowLoading = false;
    },
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.approveFun();
        } else {
          return false;
        }
      });
    },
    // 审批
    approveFun() {
      var reqUrl = "/server/api/v1/staff/claim/claimApplyBalance";
      var data = {
        hrCode: this.curInfo.hrCode,
        claimCode: this.curInfo.code,
        balanceMon: parseInt(this.ruleForm.balanceMon),
        remarks: this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success('操作成功！');
        } else {
          this.reload();
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.balanceClaimDetails {
  .my-card {
    p {
      margin-top: 10px;
    }
  }
}
</style>


