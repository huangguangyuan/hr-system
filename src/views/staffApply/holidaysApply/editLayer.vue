<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <!-- <el-form-item label="请假时间" prop="applyTime">
        <el-date-picker
          v-model="ruleForm.applyTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker
          v-model="ruleForm.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择假期开始日期"
        ></el-date-picker>
      <el-select v-model="ruleForm.startTime" placeholder="请选择时间" style="width:200px;padding-left:10px">
        <el-option key="am"
          label="上午"
          value="am">
        </el-option>
        <el-option key="pm"
          label="下午"
          value="pm">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker
          v-model="ruleForm.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择假期结束日期"
        ></el-date-picker>
      <el-select v-model="ruleForm.endTime" placeholder="请选择时间" style="width:200px;padding-left:10px">
        <el-option key="am"
          label="上午"
          value="am">
        </el-option>
        <el-option key="pm"
          label="下午"
          value="pm">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="请假天数" prop="days">
        <el-input-number v-model="ruleForm.days" :precision="1" :step="0.5" :max="30" :min="0"  class="inp01" @keyup.native="proving(index)"></el-input-number>
        <span class="inptTip">最少单位为0.5</span>
      </el-form-item>
      <el-form-item label="是否带薪" prop="isWithpay">
        <el-radio-group v-model="ruleForm.isWithpay">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请假类型" prop="typeId">
        <el-select v-model="ruleForm.typeId" placeholder="请选择请假类型">
          <el-option
            v-for="item in holidayTypes"
            :key="item.typeId"
            :label="item.val"
            :value="item.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <fileUpload :fileUpload_props="fileUpload_props" @fileUpload_tf="fileUpload_tf"></fileUpload>
      <el-form-item label="审批人员：" :rules="{required: true, message: '请最少选择一名审批人员', trigger: 'blur'}">
        <el-checkbox-group v-model="approveOfficer" >
          <el-checkbox v-for="approve in approveOfficerList" :label="approve.code" :key="approve.code" >{{approve.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="结算人员：" v-show="false">
        <el-checkbox-group v-model="balanceOfficer">
          <el-checkbox v-for="balance in balanceOfficerList" :label="balance.code" :key="balance.code" >{{balance.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="抄送人员：">
        <el-checkbox-group v-model="noticeOfficer">
          <el-checkbox v-for="notice in noticeOfficerList" :label="notice.code" :key="notice.code">{{notice.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="抄送邮件：">
        <el-input v-model="ruleForm.sendEmail"></el-input> 抄送至其他电子邮件，多个地址请用“,”隔开，例：abc@163.com,abc@qq.com；
      </el-form-item>
      <el-form-item label="备 注：">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import fileUpload from "@/components/fileUpload.vue";
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      approveOfficerList:[],
      approveOfficer:[],
      balanceOfficerList:[],
      balanceOfficer:[],
      noticeOfficerList:[],
      noticeOfficer:[],
      ruleForm: {
        startDate:new Date(),
        startTime:'am',
        endDate:new Date(),
        endTime:'pm',
        staffCode: "",
        applyTime: [],
        days: 0,
        typeId: "",
        remarks: "",
        isWithpay:1,
        fileSrc: "",
        sendEmail:"",
      }, //表单信息
      fileUpload_props:{
        isUploading:false,
        uploadUrl:'',
        uploadFolder:'',
        fileList:[]
      },
      isShow: true, //是否显示
      fileList: [],
      holidayTypes: [], //请假类型
      rules: {
        startDate: [
          { required: true, message: "请选择请假开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择请假结束时间", trigger: "blur" }
        ],
        days: [{ required: true, message: "请填写请假天数", trigger: "blur" }],
        typeId: [
          { required: true, message: "请选择请假类型", trigger: "change" }
        ],
        isWithpay: [
          { required: true, message: "请选择假期性质", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.initializeFun();
    // let s = this.$toolFn.timeFormat(this.$toolFn.formatTime(new Date(),"yyyy-MM-dd") + " 09:00:00");
    // let e = this.$toolFn.timeFormat(this.$toolFn.formatTime(new Date(),"yyyy-MM-dd") + " 18:00:00");
    // this.ruleForm.applyTime.push(s,e);
  },
  methods: {
    // 只能输入数字且只有一位小数
    proving(e) {
        // 先把非数字的都替换掉，除了数字和.
        this.ruleForm.days = this.ruleForm.days.toString().replace(/[^\d.]/g, '');
        // 必须保证第一个为数字而不是.
        this.ruleForm.days = this.ruleForm.days.toString().replace(/^\./g, '');
        // 保证只有出现一个.而没有多个.
        this.ruleForm.days = this.ruleForm.days.toString().replace(/\.{2,}/g, '');
        // 保证.只出现一次，而不能出现两次以上
        this.ruleForm.days = this.ruleForm.days.toString().replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        let index = -1;
        for (let i in this.ruleForm.days) {
            if (this.ruleForm.days[i] === '.') {
                index = i
            }
            if (index !== -1) {
                if (i - index > 1) {
                    this.ruleForm.days = this.ruleForm.days.substring(0, this.ruleForm.days.length - 1)
                }
            }
        }
    },
    // 初始化
    async initializeFun() {
      this.userInfo = this.$toolFn.curUser;
      this.holidayTypes = await this.$myApi.getHolidaysTypeId();
      this.holidayProcessRelate(this.curInfo.staffCode); //获取报假期相关人员
    },
    // 获取假期流程相关人员
    holidayProcessRelate(staffCode) {
      var reqUrl = "/server/api/v1/staff/holidaysApply/holidayProcessRelate";
      this.$myApi.http.post(reqUrl, {staffCode:staffCode}).then(res => {
        if (res.data.code == 0) {
          this.approveOfficerList = res.data.data.approveOfficerList;
          //this.approveOfficer = this.approveOfficerList.map(m => m.code);
          for (let index = 0; index < this.approveOfficerList.length; index++) {
            const element = this.approveOfficerList[index];
            if (element.selected){
              this.approveOfficer.push(element.code);
            }
          }

          this.balanceOfficerList = res.data.data.balanceOfficerList;
          this.balanceOfficer = this.balanceOfficerList.map(m => m.code);
          this.noticeOfficerList = res.data.data.noticeOfficerList;
          this.noticeOfficer = this.noticeOfficerList.map(m => m.code);

          // console.log(this.noticeOfficer)
          // for (let index = 0; index < this.approveOfficerList.length; index++) {
          //   const element = this.approveOfficerList[index];
          //   // if (this.noticeOfficer.indexOf(element.code) < 0){
          //   //   this.noticeOfficerList.push(element);
          //   //   this.noticeOfficer.push(element.code);
          //   // }
          // }
          // for (let index = 0; index < this.balanceOfficerList.length; index++) {
          //   const element = this.balanceOfficerList[index];
          //   // if (this.noticeOfficer.indexOf(element.code) < 0){
          //   //   this.noticeOfficerList.push(element);
          //   //   this.noticeOfficer.push(element.code);
          //   // }
          // }
          this.noticeOfficer = [];
          for (let index = 0; index < this.noticeOfficerList.length; index++) {
            const element = this.noticeOfficerList[index];
            if (element.lev === 611){// 如果是人事文员，默认勾选
              this.noticeOfficer.push(element.code);
            }
            
          }
           
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addFun();
        } else {
          return false;
        }
      });
    },
    timeSetS(s){
      if (s === 'am'){
        return '09:00:00'
      }
      return '12:00:00'
    },
    timeSetE(s){
      if (s === 'am'){
        return '12:00:00'
      }
      return '18:00:00'
    },
    /**
     * @description: 计算两个日期相差
     */
    dayDiff(s,e){
      const date_s = new Date(s);  //开始时间
      const date_e = new Date(e);    //结束时间
      const date_d = date_e.getTime() - date_s.getTime();   //时间差的毫秒数    
      // 计算出相差天数
      let days = Math.floor(date_d/(24*3600*1000));
      var weekday = 0; //周六日
      // 计算出小时数
      const leave1 = date_d%(24*3600*1000) //计算天数后剩余的毫秒数
      const hours = Math.floor(leave1/(3600*1000))
      // for (var i = 1; i < days + 1; i++) {
      //     var time = new Date(date_s.getYear(), date_s.getMonth(), date_s.getDate() + i);
      //     if (time.getDay() == 0 || time.getDay() == 6) {
      //         weekday++;
      //     }
      // }
      console.log(hours)
      if (hours >= 8){// 超过8小时判断为1天，否则0.5天
        days++;
      }else{
        days = days + 0.5
      }
      console.log(days)
      // return days - weekday;
      return days;
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/staff/holidaysApply/approveApply";
      if (this.fileUpload_props.isUploading){
        this.$message.error("正在上传文件，请稍后");
        return;
      }
      var details = [
        {
          startDate: this.$toolFn.timeFormat(this.ruleForm.startDate,'yyyy-MM-dd') + " " +  this.timeSetS(this.ruleForm.startTime),
          endDate: this.$toolFn.timeFormat(this.ruleForm.endDate,'yyyy-MM-dd') + " " +  this.timeSetE(this.ruleForm.endTime),
          days: parseFloat(this.ruleForm.days),
          isWithpay: parseInt(this.ruleForm.isWithpay),
          typeId: parseInt(this.ruleForm.typeId),
          remarks: this.ruleForm.remarks,
        }
      ];
      const days = this.dayDiff(details[0].startDate,details[0].endDate);
      if (days <= 0){
        this.$message.error("请检查请假日期区间");
        return;
      }else{
        console.log(days)
        console.log(this.ruleForm.days)
        if (days < this.ruleForm.days){
          this.$message.error("请检查请假天数是否超出");
          return;
        }
      }
      var data = {
        staffCode: this.curInfo.staffCode,
        totalDay: parseFloat(this.ruleForm.days),
        isWithpay: parseInt(this.ruleForm.isWithpay),
        details: details,
        fileSrc:'',
        approveOfficer:this.approveOfficer.join(','),
        balanceOfficer:this.balanceOfficer.join(','),
        noticeOfficer:this.noticeOfficer.join(','),
        sendEmail:this.ruleForm.sendEmail.replace(/，/g,","),
      };
      if (data.totalDay <= 0){
        this.$message.error("请选择请假天数");
        return;
      }
      if (!Number.isInteger((data.totalDay * 2))){
        this.$message.error("请确保请假天数是0.5的倍数");
        return;
      }
      if(this.approveOfficer.length == 0){
        this.$message.error("请至少选中一个审批人员");
        return;
      }
      // if(this.balanceOfficer.length == 0){
      //   this.$message.error("请至少选中一个结算人员");
      //   return;
      // }
      for (let index = 0; index < this.fileUpload_props.fileList.length; index++) {
        const element = this.fileUpload_props.fileList[index];
        data.fileSrc += data.fileSrc != ""?',' + element.url:element.url
      }
      
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取子组件数据
    fileUpload_tf(data){
      this.fileUpload_props.fileList = data.fileList;
      this.fileUpload_props.isUploading = data.isUploading;
    }
  },
  components: {
    fileUpload
  }
};
</script>


<style scoped lang="scss">
.inptTip{padding: 0 10px;color: #ff6600}
</style>


