<template>
  <div class="approvalHolidaysDetails">
    <el-table :data="tableData" stripe>
      <el-table-column prop="startDate" label="请假开始时间" width="200"></el-table-column>
      <el-table-column prop="endDate" label="请假结束时间" width="200"></el-table-column>
      <el-table-column prop="typeIdTxt" label="请假类型"></el-table-column>
      <el-table-column prop="remarks" label="备 注"></el-table-column>
    </el-table>
    <el-divider></el-divider>
    <el-timeline>
      <el-timeline-item v-for='item in approveHisList' :key='item.id' :timestamp="item.creatorTime" placement="top">
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
    >
      <el-form-item label="结算月份：" prop="balanceMon">
        <el-select v-model="ruleForm.balanceMon" placeholder="请选择月份">
          <el-option label="1月" value="1"></el-option>
          <el-option label="2月" value="2"></el-option>
          <el-option label="3月" value="3"></el-option>
          <el-option label="4月" value="4"></el-option>
          <el-option label="5月" value="5"></el-option>
          <el-option label="6月" value="6"></el-option>
          <el-option label="7月" value="7"></el-option>
          <el-option label="8月" value="8"></el-option>
          <el-option label="9月" value="9"></el-option>
          <el-option label="10月" value="10"></el-option>
          <el-option label="11月" value="11"></el-option>
          <el-option label="12月" value="12"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扣除金额：" v-if='curInfo.isWithpay == 1'>
        <el-input type="text" v-model="ruleForm.totalAmount"></el-input>
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
  name: "approvalHolidaysDetails",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      tableData: [],
      getClaimList: [],
      approveHisList:[],//审批流程
      ruleForm: {
        balanceMon: "",
        totalAmount:0,
        remarks: ""
      },
      rules: {
        balanceMon: [
          { required: true, message: "请选择结算月份", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.dataConvert().then(res => {
      this.curInfo.details.map(item => {
          item.typeIdTxt = res.filter(child => {
              return child.typeId == item.typeId;
          })[0].val;
          return item;
      })
      this.tableData = this.curInfo.details.map(item => {
        item.startDate = this.$toolFn.timeFormat(item.startDate);
        item.endDate = this.$toolFn.timeFormat(item.endDate);
        return item;
      });
    });
    // 审批流程
    this.approveHisList = this.curInfo.approveHis.map(item => {
      item.creatorTime = this.$toolFn.timeFormat(item.creatorTime);
      item.finishFlagTxt = item.finishFlag == 0?'否':'是';
      switch(item.typeId){
        case 1:
          item.typeIdTxt = '批准';
          break;
        case 2:
          item.typeIdTxt = '不批准';
          break;
        case 3:
          item.typeIdTxt = '转派';
          break;
        case 90:
          item.typeIdTxt = '撤回';
          break;
        case 99:
          item.typeIdTxt = '新建';
          break;
        case 100:
          item.typeIdTxt = '结算';
          break;
        default:
          item.typeIdTxt = '未知';
      }
      return item;
    });
  },
  methods: {
    // 数据转换
    dataConvert() {
      var _this = this;
      var p = new Promise(function(resolve, reject) {
        var reqUrl = "/server/api/v1/staff/holidaysApply/getHolidaysApplyTypeId";
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
    // 结算
    approveFun(){
      var reqUrl = '/server/api/v1/staff/holidaysApply/holidaysApplyBalance';
      var data = {
        hrCode:this.curInfo.hrCode,
        holidaysApplyCode:this.curInfo.code,
        balanceMon:parseInt(this.ruleForm.balanceMon),
        totalAmount:parseFloat(this.ruleForm.totalAmount),
        remarks:this.ruleForm.remarks
      }
      this.$http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('操作成功！');
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
.approvalHolidaysDetails{
  .my-card{
    p{
      margin-top: 10px;
    }
  }
}
</style>


