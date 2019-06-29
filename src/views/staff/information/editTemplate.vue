<template>
  <div class="editTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" size="mini">
      <!-- <el-form-item label="所属公司/地区/单位">
        <el-cascader
          v-model="selectedOptions"
          placeholder="请选择公司/地区/单位"
          :options="cascaderData"
          @active-item-change="handleItemChange"
          :props="{
            value: 'code',
            label: 'name',
            children: 'children'
          }"
        ></el-cascader>
      </el-form-item> -->

      <el-form-item label="所属公司" prop="companyCode" v-if="isShow">
        <el-select v-model="ruleForm.companyCode" placeholder="请选择所属公司" @change="getRegionData">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域" prop="regionCode" v-if="isShow">
        <el-select
          v-model="ruleForm.regionCode"
          placeholder="请选择所属区域"
          :loading="loading"
          @change="getRegionBUData"
        >
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属单位" prop="BUCode" v-if="isShow">
        <el-select
          v-model="ruleForm.BUCode"
          placeholder="请选择所属单位"
          :loading="loading"
          @change="getDepartment"
        >
          <el-option
            v-for="item in regionBUList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="departmentCode" v-if="isShow">
        <el-select v-model="ruleForm.departmentCode" placeholder="请选择所属部门" :loading="loading">
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中文名：" prop="nameChinese" v-if="isShow">
        <el-input v-model="ruleForm.nameChinese"></el-input>
      </el-form-item>
      <el-form-item label="英文名：" prop="nameEnglish" v-if="isShow">
        <el-input v-model="ruleForm.nameEnglish"></el-input>
      </el-form-item>
      <el-form-item label="性 别：" prop="gender" v-if="isShow">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="M">男</el-radio>
          <el-radio label="F">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="相片：" prop="photo" v-if="isShow">
        <el-upload
          class="avatar-uploader"
          action="http://192.168.103.160:9527/app/api/v1/file/imageUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="ruleForm.photo" :src="ruleForm.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="出生日期：" prop="dateOfBirth" v-if="isShow">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.dateOfBirth"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="地址：" prop="address" v-if="isShow">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="mobile" v-if="isShow">
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="国家号码：" prop="mobileCountryCode" v-if="isShow">
        <el-input v-model="ruleForm.mobileCountryCode"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email" v-if="isShow">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="国籍：" prop="nationality" v-if="isShow">
        <el-select v-model="ruleForm.nationality" placeholder="请选择所属国籍">
          <el-option label="中国大陆" value="中国大陆"></el-option>
          <el-option label="香港" value="香港"></el-option>
          <el-option label="台湾" value="台湾"></el-option>
          <el-option label="澳门" value="澳门"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号码：" prop="IDNo" v-if="isShow">
        <el-input v-model="ruleForm.IDNo"></el-input>
      </el-form-item>
      <el-form-item label="身份证正面图：" prop="IDCopy" v-if="isShow">
        <el-input v-model="ruleForm.IDCopy"></el-input>
      </el-form-item>
      <el-form-item label="身份证背面图：" prop="IDCopyBack" v-if="isShow">
        <el-input v-model="ruleForm.IDCopyBack"></el-input>
      </el-form-item>
      <el-form-item label="民族：" prop="ethnic" v-if="isShow">
        <el-select v-model="ruleForm.ethnic" placeholder="请选择民族">
          <el-option v-for="item in nationalList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政治面貌：" prop="politicalBackground" v-if="isShow">
        <el-select v-model="ruleForm.politicalBackground" placeholder="请选择政治面貌">
          <el-option label="群众" value="1"></el-option>
          <el-option label="党员" value="2"></el-option>
          <el-option label="预备党员" value="3"></el-option>
          <el-option label="民主党派" value="4"></el-option>
          <el-option label="团员" value="5"></el-option>
          <el-option label="其他" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文化程度：" prop="politicalBackground" v-if="isShow">
        <el-select v-model="ruleForm.politicalBackground" placeholder="请选择文化程度">
          <el-option label="博士" value="61"></el-option>
          <el-option label="硕士/MBA/EMBA" value="51"></el-option>
          <el-option label="本科" value="41"></el-option>
          <el-option label="大专/高职" value="31"></el-option>
          <el-option label="高中/中专/中技" value="21"></el-option>
          <el-option label="初中" value="11"></el-option>
          <el-option label="小学" value="10"></el-option>
          <el-option label="其他" value="999"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户口性质：" prop="hukouType" v-if="isShow">
        <el-radio-group v-model="ruleForm.hukouType">
          <el-radio label="1">城镇</el-radio>
          <el-radio label="2">农村</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="户口所在地：" prop="hukouLoction" v-if="isShow">
        <el-input v-model="ruleForm.hukouLoction"></el-input>
      </el-form-item>
      <el-form-item label="婚姻状况：" prop="martialStatus" v-if="isShow">
        <el-radio-group v-model="ruleForm.martialStatus">
          <el-radio label="0">未婚</el-radio>
          <el-radio label="1">已婚</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="伴侣姓名：" prop="nameOfSpouse" v-if="isShow">
        <el-input v-model="ruleForm.nameOfSpouse"></el-input>
      </el-form-item>
      <el-form-item label="子女数目：" prop="countOfKids" v-if="isShow">
        <el-input v-model="ruleForm.countOfKids"></el-input>
      </el-form-item>
      <el-form-item label="紧急联系人：" prop="emergencyContact" v-if="isShow">
        <el-input v-model="ruleForm.emergencyContact"></el-input>
      </el-form-item>
      <el-form-item label="入职日期：" prop="dateOfJoining" v-if="isShow">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.dateOfJoining"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="离职日期：" prop="dateOfLeaving" v-if="isShow">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.dateOfLeaving"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="离职原因：" prop="reasonOfLeaving" v-if="isShow">
        <el-input v-model="ruleForm.reasonOfLeaving"></el-input>
      </el-form-item>
      <el-form-item label="工作地点：" prop="workingLocation" v-if="isShow">
        <el-input v-model="ruleForm.workingLocation"></el-input>
      </el-form-item>
      <el-form-item label="外派地点：" prop="outsourceLocation" v-if="isShow">
        <el-input v-model="ruleForm.outsourceLocation"></el-input>
      </el-form-item>
      <el-form-item label="长工/合约：" prop="permanentOrContract" v-if="isShow">
        <el-radio-group v-model="ruleForm.permanentOrContract">
          <el-radio label="P">长工</el-radio>
          <el-radio label="C">合约</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年假清空方法：" prop="annualLeaveWriteOffMethod" v-if="isShow">
        <el-radio-group v-model="ruleForm.annualLeaveWriteOffMethod">
          <el-radio label="1">年结</el-radio>
          <el-radio label="2">自定义日期结算</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="每年可享有薪年假：" prop="annualLeaveEntitled" v-if="isShow">
        <el-input v-model="ruleForm.annualLeaveEntitled"></el-input>
      </el-form-item>
      <el-form-item label="每年可享有薪病假：" prop="paidSickLeaveEntitled" v-if="isShow">
        <el-input v-model="ruleForm.paidSickLeaveEntitled"></el-input>
      </el-form-item>
      <el-form-item label="工资类型：" prop="payrollType" v-if="isShow">
        <el-radio-group v-model="ruleForm.payrollType">
          <el-radio label="1">月薪</el-radio>
          <el-radio label="2">周薪</el-radio>
          <el-radio label="3">时薪</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="约满酬金：" prop="gratuity" v-if="isShow">
        <el-radio-group v-model="ruleForm.gratuity">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="医疗计划：" prop="medicalScheme" v-if="isShow">
        <el-radio-group v-model="ruleForm.medicalScheme">
          <el-radio label="E">E</el-radio>
          <el-radio label="M">M</el-radio>
          <el-radio label="S">S</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="银行名称：" prop="bankName" v-if="isShow">
        <el-input v-model="ruleForm.bankName"></el-input>
      </el-form-item>
      <el-form-item label="银行账户名称：" prop="bankAccountName" v-if="isShow">
        <el-input v-model="ruleForm.bankAccountName"></el-input>
      </el-form-item>
      <el-form-item label="银行账户：" prop="bankAccountNo" v-if="isShow">
        <el-input v-model="ruleForm.bankAccountNo"></el-input>
      </el-form-item>
      <el-form-item label="档案所在单位：" prop="fileUnit" v-if="isShow">
        <el-input v-model="ruleForm.fileUnit"></el-input>
      </el-form-item>
      <el-form-item label="档案所在单位可否调动：" prop="fileUnitMove" v-if="isShow">
        <el-radio-group v-model="ruleForm.fileUnitMove">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="社保养老账户电脑号：" prop="SIAccount" v-if="isShow">
        <el-input v-model="ruleForm.SIAccount"></el-input>
      </el-form-item>
      <el-form-item label="住房公积金账户：" prop="HCAccount" v-if="isShow">
        <el-input v-model="ruleForm.HCAccount"></el-input>
      </el-form-item>
      <el-form-item label="基本医疗保险卡号：" prop="medicalSchemeAccount" v-if="isShow">
        <el-input v-model="ruleForm.medicalSchemeAccount"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status" v-if="isShow">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">在职</el-radio>
          <el-radio label="2">离职</el-radio>
          <el-radio label="3">停薪留职</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 按钮组 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "editTemplate",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      ruleForm: {
        companyCode: "",
        regionCode: "",
        BUCode: "",
        departmentCode: "",
        nameChinese: "",
        nameEnglish: "",
        gender: "",
        photo: "",
        dateOfBirth: "",
        address: "",
        mobile: "",
        mobileCountryCode: "",
        email: "",
        nationality: "",
        IDNo: "",
        IDCopy: "",
        IDCopyBack: "",
        ethnic: "",
        politicalBackground: "",
        cultureLevel: "",
        hukouType: "",
        hukouLoction: "",
        martialStatus: "",
        nameOfSpouse: "",
        countOfKids: "",
        emergencyContact: "",
        dateOfJoining: "",
        dateOfLeaving: "",
        reasonOfLeaving: "",
        workingLocation: "",
        outsourceLocation: "",
        permanentOrContract: "",
        annualLeaveWriteOffMethod: "",
        annualLeaveEntitled: "",
        paidSickLeaveEntitled: "",
        payrollType: "",
        gratuity: "",
        medicalScheme: "",
        bankName: "",
        bankAccountName: "",
        bankAccountNo: "",
        fileUnit: "",
        fileUnitMove: "",
        SIAccount: "",
        HCAccount: "",
        medicalSchemeAccount: "",
        status: ""
      }, //表单信息
      companyList: [], //公司列表
      regionList: [], //地区列表
      regionBUList: [], //单位列表
      departmentList: [], //部门列表
      cascaderData: [],
      selectedOptions: [],
      nationalList: [
        "汉族",
        "壮族",
        "满族",
        "回族",
        "苗族",
        "维吾尔族",
        "土家族",
        "彝族",
        "蒙古族",
        "藏族",
        "布依族",
        "侗族",
        "瑶族",
        "朝鲜族",
        "白族",
        "哈尼族",
        "哈萨克族",
        "黎族",
        "傣族",
        "畲族",
        "傈僳族",
        "仡佬族",
        "东乡族",
        "高山族",
        "拉祜族",
        "水族",
        "佤族",
        "纳西族",
        "羌族",
        "土族",
        "仫佬族",
        "锡伯族",
        "柯尔克孜族",
        "达斡尔族",
        "景颇族",
        "毛南族",
        "撒拉族",
        "布朗族",
        "塔吉克族",
        "阿昌族",
        "普米族",
        "鄂温克族",
        "怒族",
        "京族",
        "基诺族",
        "德昂族",
        "保安族",
        "俄罗斯族",
        "裕固族",
        "乌孜别克族",
        "门巴族",
        "鄂伦春族",
        "独龙族",
        "塔塔尔族",
        "赫哲族",
        "珞巴族"
      ], //全国民族
      loading: false, //公司ID号
      isShow: true, //是否显示
      rules: {
        companyCode: [
          { required: true, message: "请选择所属公司", trigger: "change" }
        ],
        regionCode: [
          { required: true, message: "请选择所属区域", trigger: "change" }
        ],
        BUCode: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        nameChinese: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.getCompanyData();
    if (this.curInfo.type == "modify") {
      this.ruleForm = this.curInfo;
      this.isShow = false;
    }
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          switch (_this.curInfo.type) {
            case "add":
              _this.addFun();
              break;
            case "modify":
              _this.modifyFun();
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增单位
    addFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/add";
      var data = _this.ruleForm;
      var data = {
        companyCode: _this.ruleForm.companyCode,
        regionCode: _this.ruleForm.regionCode,
        BUCode: _this.ruleForm.BUCode,
        departmentCode: _this.ruleForm.departmentCode,
        nameChinese: _this.ruleForm.nameChinese,
        nameEnglish: _this.ruleForm.nameEnglish,
        gender: _this.ruleForm.gender,
        photo: _this.ruleForm.photo,
        dateOfBirth: _this.ruleForm.dateOfBirth,
        address: _this.ruleForm.address,
        mobile: _this.ruleForm.mobile,
        mobileCountryCode: _this.ruleForm.mobileCountryCode,
        email: _this.ruleForm.email,
        nationality: _this.ruleForm.nationality,
        IDNo: _this.ruleForm.IDNo,
        IDCopy: _this.ruleForm.IDCopy,
        IDCopyBack: _this.ruleForm.IDCopyBack,
        ethnic: _this.ruleForm.ethnic,
        politicalBackground: _this.ruleForm.politicalBackground,
        cultureLevel: _this.ruleForm.cultureLevel,
        hukouType: _this.ruleForm.hukouType,
        hukouLoction: _this.ruleForm.hukouLoction,
        martialStatus: _this.ruleForm.martialStatus,
        nameOfSpouse: _this.ruleForm.nameOfSpouse,
        countOfKids: _this.ruleForm.countOfKids,
        emergencyContact: _this.ruleForm.emergencyContact,
        dateOfJoining: _this.ruleForm.dateOfJoining,
        dateOfLeaving: _this.ruleForm.dateOfLeaving,
        reasonOfLeaving: _this.ruleForm.reasonOfLeaving,
        workingLocation: _this.ruleForm.workingLocation,
        outsourceLocation: _this.ruleForm.outsourceLocation,
        permanentOrContract: _this.ruleForm.permanentOrContract,
        annualLeaveWriteOffMethod: _this.ruleForm.annualLeaveWriteOffMethod,
        annualLeaveEntitled: _this.ruleForm.annualLeaveEntitled,
        paidSickLeaveEntitled: _this.ruleForm.paidSickLeaveEntitled,
        payrollType: _this.ruleForm.payrollType,
        gratuity: _this.ruleForm.gratuity,
        medicalScheme: _this.ruleForm.medicalScheme,
        bankName: _this.ruleForm.bankName,
        bankAccountName: _this.ruleForm.bankAccountName,
        bankAccountNo: _this.ruleForm.bankAccountNo,
        fileUnit: _this.ruleForm.fileUnit,
        fileUnitMove: _this.ruleForm.fileUnitMove,
        SIAccount: _this.ruleForm.SIAccount,
        HCAccount: _this.ruleForm.HCAccount,
        medicalSchemeAccount: _this.ruleForm.medicalSchemeAccount,
        status: _this.ruleForm.status
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message.success("新增成功~");
        } else {
          _this.$message.error(res.data.msg);
        }
      });
    },
    // 修改信息
    modifyFun() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUUpdate";
      var data = {
        id: _this.ruleForm.id,
        location: _this.ruleForm.location,
        address: _this.ruleForm.address,
        logo: _this.ruleForm.logo,
        remarks: _this.ruleForm.remarks,
        contactName: _this.ruleForm.contactName,
        contactTel: _this.ruleForm.contactTel,
        contactEmail: _this.ruleForm.contactEmail,
        contactTitle: _this.ruleForm.contactTitle,
        contactLocation: _this.ruleForm.contactLocation,
        contactRemarks: _this.ruleForm.contactRemarks
      };
      _this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.reload();
          _this.$message("修改成功~");
        } else {
          _this.$message(res.data.msg);
        }
      });
    },
    // 获取公司列表
    getCompanyData() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/companys";
      _this.$http.post(reqUrl, {}).then(res => {
        _this.companyList = res.data.data;
        this.cascaderData = res.data.data.map(item => {
          return {
            code: item.code,
            name: item.name,
            children: []
          };
        });
      });
    },
    // 获取区域列表
    getRegionData(val) {
      var _this = this;
      _this.ruleForm.regionCode = "";
      _this.ruleForm.BUCode = "";
      _this.ruleForm.departmentCode = "";
      var result = _this.companyList.filter(item => {
        return item.code == val;
      });
      var reqUrl = "/server/api/v1/company/company";
      var data = { id: result[0].id };
      _this.$http.post(reqUrl, data).then(res => {
        _this.regionList = res.data.data.companyRegionList;
        this.cascaderData = this.cascaderData.map(item => {
          if (item.code == val) {
            item.children = res.data.data.companyRegionList.map(
              items => {
                return {
                  code: items.code,
                  name: items.name,
                  children: []
                };
              }
            );
          }
          return item;
        });
        console.log(this.cascaderData);
      });
    },
    // 获取单位列表
    getRegionBUData(val) {
      var _this = this;
      _this.ruleForm.BUCode = "";
      _this.ruleForm.departmentCode = "";
      var result = _this.regionList.filter(item => {
        return item.code == val;
      });
      var reqUrl = "/server/api/v1/company/region";
      var data = { id: result[0].id };
      _this.$http.post(reqUrl, data).then(res => {
        _this.regionBUList = res.data.data.BUList;
      });
    },
    // 获取部门列表
    getDepartment(val) {
      this.ruleForm.departmentCode = "";
      var reqUrl = "/server/api/v1/buDepartment/getAll";
      var data = { BUCode: val };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.data) {
          this.departmentList = res.data.data;
        }
      });
    },
    // 获取子节点
    getNodes(val) {
      var grade;
      if (!val) {
        grade = 0;
      } else if (val.length === 1) {
        grade = val.length;
        this.getRegionData(val[0]);
      } else if (val.length === 2) {
        grade = val.length;
      }
    },
    handleItemChange(val) {
      this.getNodes(val);
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
    },
    // 获取上传图片
    handleAvatarSuccess(res, file) {
      this.ruleForm.photo = URL.createObjectURL(file.raw);
      console.log(res, file);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #ebb563;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


