<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px">
      <el-form-item label="MPF账号：" prop="account">
        <el-input v-model.number="ruleForm.account"></el-input>
      </el-form-item>

      <el-form-item label="社保缴费方案：" prop="schemeCode">
        <el-select v-model="ruleForm.schemeCode" placeholder="请选择社保缴费方案">
          <el-option
            v-for="item in schemeMPFList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="缴纳日期" prop="contributionDate">
        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.contributionDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>

      <el-form-item label="服务商名称：" prop="serviceProviderName">
        <el-input v-model="ruleForm.serviceProviderName"></el-input>
      </el-form-item>

      <el-form-item label="mpfVoluntarily：" prop="mpfVoluntarily">
        <el-input v-model="ruleForm.mpfVoluntarily" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
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
import { setTimeout } from "timers";
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        staffCode: "", //员工代码
        account: "", //MPF账号
        schemeCode: "", //MPF缴费方案
        serviceProviderName: "Manulife - Manulife Global Select (MPF) Scheme", //服务商名称
        contributionDate: "", //缴纳日期
        mpfVoluntarily: "", //香港MPF专用
        status: "", //是否生效
        remarks: "" //备注
      }, //表单信息
      isShow: true, //是否显示
      schemeMPFList: [], //香港MPF方案列表
      rules: {
        account: [
          { required: true, message: "请输入MPF账号", trigger: "blur" }
        ],
        schemeCode: [
          {required: true,message: "请选择MPF缴费方案", trigger: "change"}
        ],
        serviceProviderName: [
          { required: true, message: "请输入服务商名称", trigger: "blur" }
        ],
        contributionDate: [
          {required: true,message: "请选择缴纳日期", trigger: "change"}
        ],
        mpfVoluntarily: [
          { required: true, message: "请输入mpfVoluntarily", trigger: "blur" }
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
        this.ruleForm.account = this.curInfo.account;
        this.ruleForm.mpfCity = this.curInfo.mpfCity;
        this.ruleForm.schemeCode = this.curInfo.schemeCode;
        this.ruleForm.serviceProviderName = this.curInfo.serviceProviderName;
        this.ruleForm.contributionDate = this.curInfo.contributionDate;
        this.ruleForm.mpfVoluntarily = this.curInfo.mpfVoluntarily;
        this.ruleForm.status = this.curInfo.status.toString();
        this.ruleForm.remarks = this.curInfo.remarks;
        this.isShow = false;
      }
    },
    // 获取MPF方案列表
    getInsuredScheme() {
      var reqUrl = "/server/api/v1/insuredScheme/getAll";
      var data = { BUCode: this.curInfo.BUCode };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.schemeMPFList = res.data.data.filter(item => {
            return item.typeId == "3";
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
      var reqUrl = "/server/api/v1/payroll/staff/insured/mpf/add";
      var data = {
        staffCode: this.curInfo.staffCode,
        account: this.ruleForm.account,
        schemeCode: this.ruleForm.schemeCode,
        serviceProviderName: this.ruleForm.serviceProviderName,
        contributionDate: this.ruleForm.contributionDate,
        mpfVoluntarily: parseFloat(this.ruleForm.mpfVoluntarily),
        status: parseInt(this.ruleForm.status),
        remarks: this.ruleForm.remarks
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
      var reqUrl = "/server/api/v1/payroll/staff/insured/mpf/update";
      var data = {
        staffCode: this.curInfo.staffCode,
        account: this.ruleForm.account,
        schemeCode: this.ruleForm.schemeCode,
        serviceProviderName: this.ruleForm.serviceProviderName,
        contributionDate: this.ruleForm.contributionDate,
        mpfVoluntarily: parseFloat(this.ruleForm.mpfVoluntarily),
        status: parseInt(this.ruleForm.status),
        remarks: this.ruleForm.remarks
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


