<template>
  <div class="approvalClaimDetails">
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
          <p>操作员：{{item.operatorUser.name}}</p>
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
      v-if="!isFinish && canApprove"
    >
      <el-form-item label="是否批准：" prop="approve">
        <el-radio-group v-model="ruleForm.approve">
          <el-radio label="1">批准</el-radio>
          <el-radio label="2">不批准</el-radio>
        </el-radio-group>
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
export default {
  name: "approvalClaimDetails",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      tableData: [], //数据列表
      getClaimList: [], //审批类型
      approveHisList: [], //审批流程
      ruleForm: {
        approve: "",
        remarks: ""
      },
      rules: {
        approve: [
          { required: true, message: "请选择是否批准", trigger: "change" }
        ]
      },
      isFinish:false,
      canApprove:false
    };
  },
  mounted() {
    this.canApprove = this.curInfo.canApprove;
    this.dataConvert().then(res => {
      this.curInfo.details.map(item => {
        item.typeIdTxt = res.filter(child => {
          return child.typeId == item.typeId;
        })[0].val;
        return item;
      });
      this.tableData = this.curInfo.details;
    });
    // 审批流程
    this.approveHisList = this.curInfo.approveHis.map(item => {
      item.createTime = this.$toolFn.timeFormat(item.createTime);
      item.finishFlagTxt = item.finishFlag == 0 ? "否" : "是";
      if (item.finishFlag == 1){
        this.isFinish = true;
      }
      switch (item.typeId) {
        case 1:
          item.typeIdTxt = "批准";
          break;
        case 2:
          item.typeIdTxt = "不批准";
          break;
        case 3:
          item.typeIdTxt = "转派";
          break;
        case 90:
          item.typeIdTxt = "撤回";
          break;
        case 99:
          item.typeIdTxt = "新建";
          break;
        case 100:
          item.typeIdTxt = "结算";
          break;
        default:
          item.typeIdTxt = "未知";
      }
      return item;
    });
  },
  methods: {
    // 数据转换,用于把类型转换成对应的文字
    dataConvert() {
      var _this = this;
      var p = new Promise(function(resolve, reject) {
        var reqUrl = "/server/api/v1/staff/claim/getClaimTypeId";
        _this.$http.post(reqUrl, {}).then(res => {
          if (res.data.code == 0) {
            _this.getClaimList = res.data.data;
            resolve(_this.getClaimList);
          }
        });
      });
      return p;
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.approveFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 审批
    approveFun(){
      var reqUrl = '/server/api/v1/staff/claim/approve';
      var data = {
        hrCode:this.curInfo.hrCode,
        claimCode:this.curInfo.code,
        approve:parseInt(this.ruleForm.approve),
        remarks:this.ruleForm.remarks
      }
      
      this.$http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('审批成功~');
        }else{
          this.reload();
          this.$message.error(res.data.msg);
        }
      })
    }

  }
};
</script>
<style scoped lang="scss">
.approvalClaimDetails {
  .my-card {
    p {
      margin-top: 10px;
    }
  }
}
</style>


