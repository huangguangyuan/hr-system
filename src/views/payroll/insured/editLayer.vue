<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px">
      <el-form-item label="社保账号：" prop="SIAccount">
        <el-input v-model="ruleForm.SIAccount"></el-input>
      </el-form-item>
      <el-form-item label="该地社保首次购买社保：" prop="SICityFirst">
        <el-radio-group v-model="ruleForm.SICityFirst">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="社保缴费方案：" prop="SISchemeCode">
        <el-select v-model="ruleForm.SISchemeCode" placeholder="请选择社保缴费方案">
          <el-option
            v-for="item in schemeSIList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="社保基数：" prop="SIBase" >
        <el-input v-model="ruleForm.SIBase" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="住房公积金账户：" prop="HCAccount">
        <el-input v-model="ruleForm.HCAccount"></el-input>
      </el-form-item>
      <el-form-item label="该地公积金首次购买社保：" prop="HCCityFirst">
        <el-radio-group v-model="ruleForm.HCCityFirst">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公积金方案：" prop="HCSchemeCode">
        <el-select v-model="ruleForm.HCSchemeCode" placeholder="请选择社公积金方案">
          <el-option
            v-for="item in schemeHCList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公积金基数：" prop="HCRealityAoumt">
        <el-input
          v-model="ruleForm.HCRealityAoumt" oninput = "value=value.replace(/[^\d.]/g,'')" placeholder="不填写默认用社保基数"></el-input> <span style="color:#ccc">不填写默认用社保基数</span>
      </el-form-item>
      <el-form-item label="基本医疗保险卡号：" prop="medicalSchemeAccount">
        <el-input v-model="ruleForm.medicalSchemeAccount"></el-input>
      </el-form-item>
      <el-form-item label="户籍：" prop="householdId">
        <el-radio-group v-model="ruleForm.householdId">
          <el-radio label="1">外地农村</el-radio>
          <el-radio label="2">外地城镇</el-radio>
          <el-radio label="3">本地农村</el-radio>
          <el-radio label="4">本地城镇</el-radio>
          <el-radio label="5">港澳台</el-radio>
          <el-radio label="6">外籍</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否生效：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        staffCode: "", //员工代码
        SIAccount: "", //社保账号
        SICityFirst: "", //该地社保首次购买社保
        SISchemeCode: "", //社保缴费方案Code
        SIBase: "", //社保基数
        HCAccount: "", //住房公积金账户
        HCCityFirst: "", //该地公积金首次购买社保
        HCSchemeCode: "", //社保缴费方案Code
        HCRealityAoumt: "", //公积金基数
        medicalSchemeAccount: "", //基本医疗保险卡号
        householdId: "", //户籍
        status: "", //是否生效
        remarks: "" //备注
      }, //表单信息
      isShow: true, //是否显示
      schemeSIList: [], //社保方案列表
      schemeHCList: [], //公积金方案列表
      rules: {
        SIAccount: [
          { required: true, message: "请输入社保账号", trigger: "blur" }
        ],
        SICityFirst: [
          {
            required: true,
            message: "请选择是否该地社保首次购买社保",
            trigger: "change"
          }
        ],
        SISchemeCode: [
          { required: true, message: "请选择社保缴费方案", trigger: "change" }
        ],
        SIBase: [
          { required: true, message: "请输入社保基数", trigger: "blur" }
        ],
        HCAccount: [
          { required: true, message: "请输入住房公积金账户", trigger: "blur" }
        ],
        HCCityFirst: [
          {
            required: true,
            message: "请选择是否该地公积金首次购买社保",
            trigger: "change"
          }
        ],
        HCSchemeCode: [
          { required: true, message: "请选择公积金方案", trigger: "change" }
        ],
        // HCRealityAoumt: [
        //   { required: true, message: "请输入公积金基数", trigger: "blur" }
        // ],
        medicalSchemeAccount: [
          { required: true, message: "请输入基本医疗保险卡号", trigger: "blur" }
        ],
        householdId: [
          { required: true, message: "请选择户籍类型", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择是否生效", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      this.getInsuredScheme();
      if (this.curInfo.type == "modify") {
        this.ruleForm.SIAccount = this.curInfo.SIAccount;
        this.ruleForm.SICityFirst = this.curInfo.SICityFirst.toString();
        this.ruleForm.SISchemeCode = this.curInfo.SISchemeCode;
        this.ruleForm.SIBase = this.curInfo.SIBase;
        this.ruleForm.HCAccount = this.curInfo.HCAccount;
        this.ruleForm.HCCityFirst = this.curInfo.HCCityFirst.toString();
        this.ruleForm.HCSchemeCode = this.curInfo.HCSchemeCode;
        this.ruleForm.HCRealityAoumt = this.curInfo.HCRealityAoumt;
        this.ruleForm.medicalSchemeAccount = this.curInfo.medicalSchemeAccount;
        this.ruleForm.householdId = this.curInfo.householdId.toString();
        this.ruleForm.status = this.curInfo.status.toString();
        this.ruleForm.remarks = this.curInfo.remarks;
        this.isShow = false;
      }
    },
    // 获取社保/公积金方案列表
    getInsuredScheme() {
      var reqUrl = "/server/api/v1/insuredScheme/getAll";
      var data = { BUCode: this.curInfo.BUCode };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.schemeSIList = res.data.data.filter(item => {
            return item.typeId == "1";
          });
          this.schemeHCList = res.data.data.filter(item => {
            return item.typeId == "2";
          });
        }
      });
    },
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.curInfo.type) {
            case "add":
              this.addFun();
              break;
            case "modify":
              this.modifyFun();
              break;
          }
        } else {
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/payroll/staff/insured/add";
      var data = {
        staffCode: this.curInfo.staffCode,
        SIAccount: this.ruleForm.SIAccount,
        SICityFirst:parseInt(this.ruleForm.SICityFirst),
        SISchemeCode:this.ruleForm.SISchemeCode,
        SIBase:parseFloat(this.ruleForm.SIBase),
        HCAccount:this.ruleForm.HCAccount,
        HCCityFirst:parseInt(this.ruleForm.HCCityFirst),
        HCSchemeCode:this.ruleForm.HCSchemeCode,
        HCRealityAoumt:this.ruleForm.HCRealityAoumt ? parseFloat(this.ruleForm.HCRealityAoumt):parseFloat(this.ruleForm.SIBase),
        medicalSchemeAccount:this.ruleForm.medicalSchemeAccount,
        householdId:parseInt(this.ruleForm.householdId),
        status:parseInt(this.ruleForm.status),
        remarks:this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/payroll/staff/insured/update";
      var data = {
        staffCode: this.curInfo.staffCode,
        SIAccount: this.ruleForm.SIAccount,
        SICityFirst:parseInt(this.ruleForm.SICityFirst),
        SISchemeCode:this.ruleForm.SISchemeCode,
        SIBase:parseFloat(this.ruleForm.SIBase),
        HCAccount:this.ruleForm.HCAccount,
        HCCityFirst:parseInt(this.ruleForm.HCCityFirst),
        HCSchemeCode:this.ruleForm.HCSchemeCode,
        HCRealityAoumt:this.ruleForm.HCRealityAoumt ? parseFloat(this.ruleForm.HCRealityAoumt):parseFloat(this.ruleForm.SIBase),
        medicalSchemeAccount:this.ruleForm.medicalSchemeAccount,
        householdId:parseInt(this.ruleForm.householdId),
        status:parseInt(this.ruleForm.status),
        remarks:this.ruleForm.remarks
      };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功");
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style scoped lang="scss">
</style>


