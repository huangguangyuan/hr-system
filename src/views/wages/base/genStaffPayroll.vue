<template>
  <div class="genStaffPayroll">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px">
      <el-form-item label="请选择年份：" prop="year">
        <el-date-picker v-model="ruleForm.year" type="year" placeholder="选择年" value-format="yyyy" format="yyyy"></el-date-picker>
      </el-form-item>
      <el-form-item label="请选择月份：" prop="month">
        <el-date-picker v-model="ruleForm.month" type="month" placeholder="选择月" value-format="MM" format="M"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  name: "genStaffPayroll",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        year: "",
        month: ""
      }, //表单信息
      isShow: true, //是否显示
      rules: {
        year: [{ required: true, message: "请选择年份", trigger: "change" }],
        month: [{ required: true, message: "请选择月份", trigger: "change" }]
      }
    };
  },
  mounted() {
    var date = new Date();
    this.ruleForm = {
              year: date.getFullYear().toString(),
              month: (date.getMonth()+1).toString()
            };
  },
  methods: {
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addFun();
        } else {
          
          return false;
        }
      });
    },
    // 生成工资单
    async addFun() {
      var data = {
          hrCode:this.curInfo.hrCode,
          //staffCode:this.curInfo.code,
          year:parseInt(this.ruleForm.year),
          month:parseInt(this.ruleForm.month)
      };
      if (this.curInfo.typeId == 2){
        this.$message.success(" 工资单正在生成，请稍后...");
        for (let index = 0; index < this.curInfo.createItems.length; index++) {
          const element = this.curInfo.createItems[index];
          data.staffCode = element.code;
          await this.$toolFn.sleep(1000);
          var genStaffPayroll = await this.$myApi.genStaffPayroll(data);
          if (genStaffPayroll && genStaffPayroll.code == 0) {
            this.$message.success(element.nameChinese+" 工资单生成成功");
          } else {
            this.$message.error(element.nameChinese + genStaffPayroll.msg);
          }
        }
        this.$message.success("工资单生成完毕");
        this.reload();
      }else if(this.curInfo.typeId == 1){
          data.staffCode = this.curInfo.code;
          var genStaffPayroll = await this.$myApi.genStaffPayroll(data);
          console.log(genStaffPayroll);
          if (genStaffPayroll && genStaffPayroll.code == 0) {
            this.reload();
            this.$message.success("生成成功");
          } else {
            this.$message.error(genStaffPayroll.msg);
          }
      }
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


