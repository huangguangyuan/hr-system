<template>
  <div class="editTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" size="mini">
    
      <el-divider>
        <i class="hr-icon-jichuxinxi"></i> 基础信息
      </el-divider>
      <el-form-item label="所属公司/地区/单位" prop="selectedOptions" v-if="isShow">
        <el-cascader v-model="ruleForm.selectedOptions" @change="handleChange" :props="props"></el-cascader>
      </el-form-item>
      <el-form-item label="所属部门" prop="departmentCode">
        <el-select v-model="ruleForm.departmentCode" placeholder="请选择所属部门" :loading="loading">
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
            :disabled="item.status===0"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第一姓名：" prop="nameChinese">
        <el-input v-model="ruleForm.nameChinese"></el-input>
      </el-form-item>
      <el-form-item label="性 别：" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="M">男</el-radio>
          <el-radio label="F">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="第二姓名：" prop="nameEnglish">
        <el-input v-model="ruleForm.nameEnglish"></el-input>
      </el-form-item>
      <el-form-item label="个人头像：" prop="photo">
        <image-upload :imageUpload_props="photo_props" :imageSrc.sync="ruleForm.photo"></image-upload>
        <!-- <el-upload
          class="avatar-uploader"
          action="/app/api/v1/file/imageUpload"
          :show-file-list="false"
          :on-success="uploadAvatar"
        >
          <el-image v-if="ruleForm.photo" :src="avatarSrc" class="avatar" fit="cover"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
      </el-form-item>
      <el-form-item label="出生日期：" prop="dateOfBirth">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.dateOfBirth"
          style="width: 100%;"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="mobile">
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="员工编号：" prop="staffNo">
        <el-input v-model="ruleForm.staffNo"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="workStatus">
        <el-radio-group v-model="ruleForm.workStatus">
          <el-radio :label="1">在职</el-radio>
          <el-radio :label="2">离职</el-radio>
          <el-radio :label="3">停薪留职</el-radio>
        </el-radio-group>
      </el-form-item>
          <el-divider v-if="isShow">
            <i class="hr-icon-jichuxinxi"></i> 账户信息
          </el-divider>
          <el-form-item label="登录账户" prop="account" v-if="isShow">
            <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password" v-if="isShow">
            <el-input v-model="ruleForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="关联系统管理员账户：" prop="hrCode" v-if="isShow">
            <el-select v-model="ruleForm.hrCode" placeholder="请选择关联系统管理员" :loading="loading">
              <el-option label="无关联账户" value=""></el-option>
              <el-option
                v-for="item in HRadminList" 
                :key="item.id"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-divider>
            <i class="hr-icon-gerenxinxi"></i> 个人信息
          </el-divider>
      <el-form-item label="员工别名：" prop="staffAlias">
        <el-input v-model="ruleForm.staffAlias"></el-input>
      </el-form-item>
      <el-form-item label="职位：" prop="position">
        <el-input v-model="ruleForm.position"></el-input>
      </el-form-item>
      <el-form-item label="公司电话：" prop="companyPhone">
        <el-input v-model="ruleForm.companyPhone"></el-input>
      </el-form-item>      
      <el-form-item label="国家号码：" prop="mobileCountryCode">
        <el-select v-model="ruleForm.mobileCountryCode" placeholder="请选择国家号码">
          <el-option label="86-中国" value="86"></el-option>
          <el-option label="852-香港" value="852"></el-option>
          <el-option label="886-台湾" value="886"></el-option>
          <el-option label="853-澳门" value="853"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="国籍：" prop="nationality">
        <el-select v-model="ruleForm.nationality" placeholder="请选择所属国籍">
          <el-option label="中国大陆" value="中国大陆"></el-option>
          <el-option label="香港" value="香港"></el-option>
          <el-option label="台湾" value="台湾"></el-option>
          <el-option label="澳门" value="澳门"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号码：" prop="IDNo">
        <el-input v-model="ruleForm.IDNo"></el-input>
      </el-form-item>
      <el-form-item label="民族：" prop="ethnic">
        <el-select v-model="ruleForm.ethnic" placeholder="请选择民族">
          <el-option v-for="item in nationalList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证正面图：" prop="IDCopy">
        <image-upload :imageUpload_props="IDCopy_props" :imageSrc.sync="ruleForm.IDCopy"></image-upload>
      </el-form-item>
      <el-form-item label="身份证背面图：" prop="IDCopyBack">
        <image-upload :imageUpload_props="IDCopyBack_props" :imageSrc.sync="ruleForm.IDCopyBack"></image-upload>
      </el-form-item>
      <el-form-item label="政治面貌：" prop="politicalBackground">
        <el-select v-model="ruleForm.politicalBackground" placeholder="请选择政治面貌">
          <el-option label="群众" value="1"></el-option>
          <el-option label="党员" value="2"></el-option>
          <el-option label="预备党员" value="3"></el-option>
          <el-option label="民主党派" value="4"></el-option>
          <el-option label="团员" value="5"></el-option>
          <el-option label="其他" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文化程度：" prop="cultureLevel">
        <el-select v-model="ruleForm.cultureLevel" placeholder="请选择文化程度">
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
      <el-form-item label="户口性质：" prop="hukouType">
        <el-radio-group v-model="ruleForm.hukouType">
          <el-radio label="1">城镇</el-radio>
          <el-radio label="2">农村</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="户口所在地：" prop="hukouLoction">
        <el-input v-model="ruleForm.hukouLoction"></el-input>
      </el-form-item>
      <el-form-item label="婚姻状况：" prop="martialStatus">
        <el-radio-group v-model="ruleForm.martialStatus">
          <el-radio label="0">未婚</el-radio>
          <el-radio label="1">已婚</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="伴侣姓名：" prop="nameOfSpouse" v-if="ruleForm.martialStatus == '1'">
        <el-input v-model="ruleForm.nameOfSpouse"></el-input>
      </el-form-item>
      <el-form-item label="子女数目：" prop="countOfKids" v-if="ruleForm.martialStatus == '1'">
        <el-input v-model="ruleForm.countOfKids"></el-input>
      </el-form-item>
      <el-form-item label="紧急联系人：" prop="emergencyContact">
        <el-input v-model="ruleForm.emergencyContact"></el-input>
      </el-form-item>
      <el-form-item label="入职日期：" prop="dateOfJoining">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.dateOfJoining"
          style="width: 100%;"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="离职日期：" prop="dateOfLeaving" v-if="ruleForm.workStatus == '2'">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.dateOfLeaving"
          style="width: 100%;"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="离职原因：" prop="reasonOfLeaving" v-if="ruleForm.workStatus == '2'">
        <el-input v-model="ruleForm.reasonOfLeaving"></el-input>
      </el-form-item>
      <el-form-item label="出生地：" prop="dateOfPlace">
        <el-input v-model="ruleForm.dateOfPlace"></el-input>
      </el-form-item>
      <el-form-item label="工作地点：" prop="workingLocation">
        <el-input v-model="ruleForm.workingLocation"></el-input>
      </el-form-item>
      <el-form-item label="邮递地址：" prop="postalAddress">
        <el-input v-model="ruleForm.postalAddress"></el-input>
      </el-form-item>
      <el-form-item label="外派地点：" prop="outsourceLocation">
        <el-input v-model="ruleForm.outsourceLocation"></el-input>
      </el-form-item>
      <el-form-item label="长工/合约：" prop="permanentOrContract">
        <el-radio-group v-model="ruleForm.permanentOrContract">
          <el-radio label="P">长工</el-radio>
          <el-radio label="C">合约</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-divider>
        <i class="hr-icon-yuangongfulitaizhang"></i> 薪资福利
      </el-divider>
      <el-form-item label="每年可享有薪年假：" prop="annualLeaveEntitled">
        <el-input v-model="ruleForm.annualLeaveEntitled" style="width:50%;padding-right:20px"></el-input><el-button type="primary" @click="getAnnualLeave(curInfo.BUCode)">引用单位年假默认配置</el-button>
      </el-form-item>
      <!-- <el-form-item label="年假结算方法：" prop="annualLeaveWriteOffMethod" >
        <el-radio-group v-model="ruleForm.annualLeaveWriteOffMethod">
          <el-radio label="1">年结</el-radio>
          <el-radio label="2">自定义日期结算</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="年假清空日期：" prop="annualLeaveWriteOffDate" >
          <el-date-picker
            v-model="ruleForm.annualLeaveWriteOffDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      <el-form-item label="年假清空后可保留天数：" prop="annualLeaveRetain" >
        <el-input v-model="ruleForm.annualLeaveRetain"></el-input>
      </el-form-item>
      <el-form-item label="可保留天数清空日期：" prop="annualLeaveRetainClearDate" >
          <el-date-picker
            v-model="ruleForm.annualLeaveRetainClearDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      <el-form-item label="每年可享有薪病假：" prop="paidSickLeaveEntitled">
        <el-input v-model="ruleForm.paidSickLeaveEntitled"></el-input>
      </el-form-item>
      <el-form-item label="各项津贴上限：" prop="fringeBeneiftLimit">
        <el-input v-model="ruleForm.fringeBeneiftLimit"></el-input>
      </el-form-item>      
      <el-form-item label="工资类型：" prop="payrollType">
        <el-radio-group v-model="ruleForm.payrollType">
          <el-radio label="1">月薪</el-radio>
          <!-- <el-radio label="2">周薪</el-radio>
          <el-radio label="3">时薪</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="约满酬金：" prop="gratuity">
        <el-radio-group v-model="ruleForm.gratuity">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="医疗计划：" prop="medicalScheme">
        <el-radio-group v-model="ruleForm.medicalScheme">
          <el-radio label="E">E</el-radio>
          <el-radio label="M">M</el-radio>
          <el-radio label="S">S</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider>
        <i class="hr-icon-yinhangqiaxinxi"></i> 银行卡信息
      </el-divider>
      <el-form-item label="银行名称：" prop="bankName">
        <el-input v-model="ruleForm.bankName"></el-input>
      </el-form-item>
      <el-form-item label="银行账户名称：" prop="bankAccountName">
        <el-input v-model="ruleForm.bankAccountName"></el-input>
      </el-form-item>
      <el-form-item label="银行账户：" prop="bankAccountNo">
        <el-input v-model="ruleForm.bankAccountNo"></el-input>
      </el-form-item>
      <el-form-item label="档案所在单位：" prop="fileUnit">
        <el-input v-model="ruleForm.fileUnit"></el-input>
      </el-form-item>
      <el-form-item label="档案所在单位可否调动：" prop="fileUnitMove">
        <el-radio-group v-model="ruleForm.fileUnitMove">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="社保养老账户电脑号：" prop="SIAccount">
        <el-input v-model="ruleForm.SIAccount"></el-input>
      </el-form-item>
      <el-form-item label="住房公积金账户：" prop="HCAccount">
        <el-input v-model="ruleForm.HCAccount"></el-input>
      </el-form-item>
      <el-form-item label="基本医疗保险卡号：" prop="medicalSchemeAccount">
        <el-input v-model="ruleForm.medicalSchemeAccount"></el-input>
      </el-form-item>
      <!-- 按钮组 -->
      <el-form-item class="btn-ground">
        <el-button v-if="userRight" type="primary" @click="submitForm('ruleForm')" size="medium">确定</el-button>
        <el-button @click="cancelFn" size="medium">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import imageUpload from "@/components/imageUpload.vue";
import axios from "axios";
import md5 from "js-md5";
export default {
  components: {
    imageUpload
  },
  name: "editTemplate",
  inject: ["reload"],
  props: ["curInfo","userRight_props"],
  data() {
    return {
      userRight:false,
      ruleForm: {
        selectedOptions: [],
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
        annualLeaveWriteOffMethod: "2",
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
        status: "",
        workStatus: "",
        account:"",
        password:"",
        hrCode:"",
        staffNo:"",
        staffAlias:"",
        position:"",
        dateOfPlace:"",
        postalAddress:"",
        fringeBeneiftLimit:"",
        annualLeave:0,
        annualLeaveRetain:0,
        companyPhone:"",
        annualLeaveRetainClearDate:'',
        annualLeaveWriteOffDate:''
      }, //表单信息
      avatarSrc: "", //头像路径
      IDPositiveSrc: "", //身份证正面
      IDNegativeSrc: "", //身份证反面
      departmentList: [], //部门列表
      annualLeaveConfig:{},//年假配置
      HRadminList:[],//管理员列表
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          var nodes;
          if (node.level == 0) {
            var reqUrl = "/server/api/v1/company/companys";
            axios.post(reqUrl, {}).then(res => {
              nodes = res.data.data.map(item => {
                return {
                  id: item.id,
                  code: item.code,
                  name: item.name
                };
              });
              resolve(nodes);
            });
          } else if (node.level == 1) {
            axios
              .post("/server/api/v1/company/company", { id: node.data.id })
              .then(res => {
                nodes = res.data.data.companyRegionList.map(item => {
                  return {
                    id: item.id,
                    code: item.code,
                    name: item.name
                  };
                });
                resolve(nodes);
              });
          } else if (node.level == 2) {
            axios
              .post("/server/api/v1/company/region", { id: node.data.id })
              .then(res => {
                nodes = res.data.data.BUList.map(item => {
                  return {
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    leaf: item.code
                  };
                });
                resolve(nodes);
              });
          }
        },
        value: "code",
        label: "name",
        children: "children"
      },
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
      ], //民族
      loading: false, //公司ID号
      isShow: true, //是否显示
      rules: {
        // annualLeaveWriteOffDate: [
        //   {
        //     required: true,
        //     message: "请选择所属公司/区域/单位",
        //     trigger: "change"
        //   }
        // ],
        nameChinese: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        workStatus: [
          { required: true, message: "请选择员工在职状态", trigger: "change" }
        ],
        account: [{ required: true, message: "请填写账户", trigger: "change" }],
        password: [{ required: true, message: "请填写密码", trigger: "change" }],
        staffNo: [{ required: true, message: "请填写员工编号", trigger: "change" }],
        // hukouType: [{ required: true, message: "请选择户口性质", trigger: "change" }],
        // martialStatus: [{ required: true, message: "请选择婚姻状况", trigger: "change" }],
        // photo:[{ required: true, message: "请上传个人头像", trigger: "change" }]
      },
      photo_props:{
        imageSrc:'',
        uploadFolder:''
      },
      IDCopy_props:{
        imageSrc:'',
        uploadFolder:''
      },
      IDCopyBack_props:{
        imageSrc:'',
        uploadFolder:''
      },
    };
  },
  mounted() {
    this.userRight = this.userRight_props;
    this.initialize();
  },
  methods: {
    // 初始化
    initialize() {
      if (this.curInfo.type == "modify") {
        this.isShow = false;
        this.ruleForm = JSON.parse(JSON.stringify(this.curInfo));
        this.ruleForm.hukouType = this.curInfo.hukouType?this.curInfo.hukouType.toString():null;
        this.ruleForm.martialStatus = this.curInfo.martialStatus!= undefined?this.curInfo.martialStatus.toString():"0";
        this.ruleForm.annualLeaveWriteOffMethod = this.curInfo.annualLeaveWriteOffMethod?this.curInfo.annualLeaveWriteOffMethod.toString():"2";
        this.ruleForm.payrollType = this.curInfo.payrollType?this.curInfo.payrollType.toString():"1";
        this.ruleForm.fileUnitMove = this.curInfo.fileUnitMove?this.curInfo.fileUnitMove.toString():"1";
        //this.ruleForm.workStatus = this.ruleForm.workStatus?this.ruleForm.workStatus.toString():null;
        this.ruleForm.workStatus = this.ruleForm.workStatus;
        this.avatarSrc = this.ruleForm.photo;
        this.IDPositiveSrc = this.ruleForm.IDCopy;
        this.IDNegativeSrc = this.ruleForm.IDCopyBack;
        this.photo_props.imageSrc = this.ruleForm.photo;
        this.IDCopy_props.imageSrc = this.ruleForm.IDCopy;
        this.IDCopyBack_props.imageSrc = this.ruleForm.IDCopyBack;
        this.getDepartment(this.ruleForm.BUCode);
        // this.getAnnualLeave(this.curInfo.BUCode);
      }
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
    // 新增单位
    addFun() {
      var reqUrl = "/server/api/v1/staff/add";
      var data = this.ruleForm;
      data = {
        companyCode: this.ruleForm.selectedOptions[0],
        regionCode: this.ruleForm.selectedOptions[1],
        BUCode: this.ruleForm.selectedOptions[2],
        departmentCode: this.ruleForm.departmentCode,
        nameChinese: this.ruleForm.nameChinese,
        nameEnglish: this.ruleForm.nameEnglish,
        gender: this.ruleForm.gender,
        photo: this.ruleForm.photo,
        dateOfBirth: this.ruleForm.dateOfBirth  || ' ',
        address: this.ruleForm.address,
        mobile: this.ruleForm.mobile,
        mobileCountryCode: this.ruleForm.mobileCountryCode,
        email: this.ruleForm.email,
        nationality: this.ruleForm.nationality,
        IDNo: this.ruleForm.IDNo,
        IDCopy: this.ruleForm.IDCopy,
        IDCopyBack: this.ruleForm.IDCopyBack,
        ethnic: this.ruleForm.ethnic,
        politicalBackground: this.ruleForm.politicalBackground,
        cultureLevel: this.ruleForm.cultureLevel,
        hukouType: this.ruleForm.hukouType,
        hukouLoction: this.ruleForm.hukouLoction,
        martialStatus: this.ruleForm.martialStatus,
        nameOfSpouse: this.ruleForm.nameOfSpouse,
        countOfKids: this.ruleForm.countOfKids,
        emergencyContact: this.ruleForm.emergencyContact,
        dateOfJoining: this.ruleForm.dateOfJoining,
        dateOfLeaving: this.ruleForm.dateOfLeaving,
        reasonOfLeaving: this.ruleForm.reasonOfLeaving,
        workingLocation: this.ruleForm.workingLocation,
        outsourceLocation: this.ruleForm.outsourceLocation,
        permanentOrContract: this.ruleForm.permanentOrContract,
        annualLeaveWriteOffMethod: this.ruleForm.annualLeaveWriteOffMethod,
        annualLeaveEntitled: this.ruleForm.annualLeaveEntitled,
        paidSickLeaveEntitled: this.ruleForm.paidSickLeaveEntitled,
        payrollType: this.ruleForm.payrollType,
        gratuity: this.ruleForm.gratuity,
        medicalScheme: this.ruleForm.medicalScheme,
        bankName: this.ruleForm.bankName,
        bankAccountName: this.ruleForm.bankAccountName,
        bankAccountNo: this.ruleForm.bankAccountNo,
        fileUnit: this.ruleForm.fileUnit,
        fileUnitMove: this.ruleForm.fileUnitMove,
        SIAccount: this.ruleForm.SIAccount,
        HCAccount: this.ruleForm.HCAccount,
        medicalSchemeAccount: this.ruleForm.medicalSchemeAccount,
        workStatus: parseInt(this.ruleForm.workStatus),
        account:this.ruleForm.account,
        password: md5(this.ruleForm.password),
        hrCode: this.ruleForm.hrCode,
        staffNo: this.ruleForm.staffNo,
      };
      if (this.ruleForm.annualLeaveWriteOffDate == ""){
        this.$message.error("年假清空日期不能为空");
        return false;
      }
      if (this.ruleForm.annualLeaveRetain == undefined){
        this.$message.error("请填写年假清空后可保留天数");
        return false;
      }
      if (this.ruleForm.annualLeaveRetainClearDate == ""){
        this.$message.error("请填写可保留天数清空日期");
        return false;
      }
      // if (new Date(this.ruleForm.annualLeaveWriteOffDate) < new Date((new Date().getFullYear() +1) + "-01-01 00:00:00")){
      //   this.$message.error("年假清空日不能早于" + (new Date().getFullYear() + 1) + "-01-01");
      //   return false;
      // }
      if (new Date(this.ruleForm.annualLeaveWriteOffDate) > new Date(this.ruleForm.annualLeaveRetainClearDate)){
        this.$message.error("年假保留天数清空日期不能早于年假清空日期");
        return false;
      }
      data.annualLeaveWriteOffDate =  this.$toolFn.timeFormat(this.curInfo.annualLeaveWriteOffDate,"yyyy-MM-dd");
      data.annualLeaveRetain = this.ruleForm.annualLeaveRetain;
      data.annualLeaveRetainClearDate = this.$toolFn.timeFormat(this.ruleForm.annualLeaveRetainClearDate);
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改信息
    modifyFun() {
      var reqUrl = "/server/api/v1/staff/update";
      var data = {
        id: this.curInfo.id,
        nameChinese: this.ruleForm.nameChinese,
        nameEnglish: this.ruleForm.nameEnglish,
        gender: this.ruleForm.gender,
        photo: this.ruleForm.photo,
        dateOfBirth: this.ruleForm.dateOfBirth || ' ',
        address: this.ruleForm.address,
        mobile: this.ruleForm.mobile,
        mobileCountryCode: this.ruleForm.mobileCountryCode,
        email: this.ruleForm.email,
        nationality: this.ruleForm.nationality,
        IDNo: this.ruleForm.IDNo,
        IDCopy: this.ruleForm.IDCopy,
        IDCopyBack: this.ruleForm.IDCopyBack,
        ethnic: this.ruleForm.ethnic,
        politicalBackground: this.ruleForm.politicalBackground,
        cultureLevel: this.ruleForm.cultureLevel,
        hukouType: this.ruleForm.hukouType,
        hukouLoction: this.ruleForm.hukouLoction,
        martialStatus: this.ruleForm.martialStatus,
        nameOfSpouse: this.ruleForm.nameOfSpouse,
        countOfKids: this.ruleForm.countOfKids,
        emergencyContact: this.ruleForm.emergencyContact,
        dateOfJoining: this.ruleForm.dateOfJoining || '',
        dateOfLeaving: this.ruleForm.dateOfLeaving || '',
        reasonOfLeaving: this.ruleForm.reasonOfLeaving,
        workingLocation: this.ruleForm.workingLocation,
        outsourceLocation: this.ruleForm.outsourceLocation,
        permanentOrContract: this.ruleForm.permanentOrContract,
        annualLeaveWriteOffMethod: this.ruleForm.annualLeaveWriteOffMethod,
        annualLeaveEntitled: this.ruleForm.annualLeaveEntitled,
        paidSickLeaveEntitled: this.ruleForm.paidSickLeaveEntitled,
        payrollType: this.ruleForm.payrollType,
        gratuity: this.ruleForm.gratuity,
        medicalScheme: this.ruleForm.medicalScheme,
        bankName: this.ruleForm.bankName,
        bankAccountName: this.ruleForm.bankAccountName,
        bankAccountNo: this.ruleForm.bankAccountNo,
        fileUnit: this.ruleForm.fileUnit,
        fileUnitMove: this.ruleForm.fileUnitMove,
        SIAccount: this.ruleForm.SIAccount,
        HCAccount: this.ruleForm.HCAccount,
        medicalSchemeAccount: this.ruleForm.medicalSchemeAccount,
        staffNo: this.ruleForm.staffNo,
        staffAlias: this.ruleForm.staffAlias,
        position: this.ruleForm.position,
        dateOfPlace: this.ruleForm.dateOfPlace,
        postalAddress: this.ruleForm.postalAddress,
        fringeBeneiftLimit: this.ruleForm.fringeBeneiftLimit,
        departmentCode:this.ruleForm.departmentCode,
        workStatus: parseInt(this.ruleForm.workStatus)
      };
      if (this.ruleForm.annualLeaveWriteOffDate == ""){
        this.$message.error("年假结算日期不能为空");
        return false;
      }
      if (this.ruleForm.annualLeaveRetain == undefined){
        this.$message.error("请填写年假清空后可保留天数");
        return false;
      }
      if (this.ruleForm.annualLeaveRetainClearDate == ""){
        this.$message.error("请填写可保留天数清空日期");
        return false;
      }
      // if (new Date(this.ruleForm.annualLeaveWriteOffDate) < new Date((new Date().getFullYear() +1) + "-01-01 00:00:00")){
      //   this.$message.error("年假清空日不能早于" + (new Date().getFullYear() + 1) + "-01-01");
      //   return false;
      // }
      if (new Date(this.ruleForm.annualLeaveWriteOffDate) >= new Date(this.ruleForm.annualLeaveRetainClearDate)){
        this.$message.error("年假保留天数清空日期需要大于年假清空日期");
        return false;
      }
      data.annualLeaveWriteOffDate = this.$toolFn.timeFormat(this.ruleForm.annualLeaveWriteOffDate);
      data.annualLeaveRetain = this.ruleForm.annualLeaveRetain;
      data.annualLeaveRetainClearDate = this.$toolFn.timeFormat(this.ruleForm.annualLeaveRetainClearDate);
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功");
        } else {
          
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取公司、地区、单位code
    handleChange(val) {
      this.getDepartment(val[2]);
      this.getHRadminList(val[2]);
      // this.getAnnualLeave(val[2]);
    },
    // 获取部门列表
    getDepartment(val) {
      //this.ruleForm.departmentCode = "";
      var reqUrl = "/server/api/v1/buDepartment/getAll";
      var data = { BUCode: val };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.data) {
          this.departmentList = res.data.data;
        }
      });
    },
    // 获取年假配置
    async getAnnualLeave(val) {
      var reqUrl = "/server/api/v1/bu/annualLeave";
      if (this.annualLeaveConfig.annualLeaveEntitled){
        if (this.annualLeaveConfig.annualLeaveEntitled != undefined){
          this.ruleForm.annualLeaveEntitled = this.annualLeaveConfig.annualLeaveEntitled;
        }
        if (this.annualLeaveConfig.annualLeaveWriteOffDate){
          this.ruleForm.annualLeaveWriteOffDate = new Date(this.$toolFn.timeFormat(this.annualLeaveConfig.annualLeaveWriteOffDate,"yyyy-MM-dd"));
        }
        if (this.annualLeaveConfig.annualLeaveRetain != undefined){
          this.ruleForm.annualLeaveRetain = this.annualLeaveConfig.annualLeaveRetain;
        }
        if (this.annualLeaveConfig.annualLeaveRetainClearDate){
          this.ruleForm.annualLeaveRetainClearDate = new Date(this.$toolFn.timeFormat(this.annualLeaveConfig.annualLeaveRetainClearDate,"yyyy-MM-dd"));
        }
      }else{
        this.$myApi.http.post(reqUrl, {BUCode:val}).then(res => {
          if (res.data.code == 0) {
            this.annualLeaveConfig = res.data.data;
            this.annualLeaveConfig.annualLeaveWriteOffDate = this.$toolFn.timeFormat(this.annualLeaveConfig.annualLeaveWriteOffDate,"yyyy-MM-dd")
            this.annualLeaveConfig.annualLeaveRetainClearDate = this.$toolFn.timeFormat(this.annualLeaveConfig.annualLeaveRetainClearDate,"yyyy-MM-dd")
            if (this.annualLeaveConfig.annualLeaveEntitled != undefined){
              this.ruleForm.annualLeaveEntitled = this.annualLeaveConfig.annualLeaveEntitled;
            }
            if (this.annualLeaveConfig.annualLeaveWriteOffDate){
              this.ruleForm.annualLeaveWriteOffDate = new Date(this.$toolFn.timeFormat(this.annualLeaveConfig.annualLeaveWriteOffDate,"yyyy-MM-dd"));
            }
            if (this.annualLeaveConfig.annualLeaveRetain != undefined){
              this.ruleForm.annualLeaveRetain = this.annualLeaveConfig.annualLeaveRetain;
            }
            if (this.annualLeaveConfig.annualLeaveRetainClearDate){
              this.ruleForm.annualLeaveRetainClearDate = new Date(this.$toolFn.timeFormat(this.annualLeaveConfig.annualLeaveRetainClearDate,"yyyy-MM-dd"));
            }
          }
        });
      }
    },
    // 获取HR管理员列表
    getHRadminList(val){
      var reqUrl = '/server/api/v1/admin/hrSys/getAll';
      var data = {BUCode:val}
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.data){
          this.HRadminList = res.data.data;
        }
      })
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    },
    // 获取上传头像
    uploadAvatar(res, file) {
      this.ruleForm.photo = res.data.path;
      this.avatarSrc = URL.createObjectURL(file.raw);
    },
    // 获取身份证正面
    uploadIDPositive(res, file) {
      this.ruleForm.IDCopy = res.data.path;
      this.IDPositiveSrc = URL.createObjectURL(file.raw);
    },
    // 获取身份证反面
    uploadIDNegative(res, file) {
      this.ruleForm.IDCopyBack = res.data.path;
      this.IDNegativeSrc = URL.createObjectURL(file.raw);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss">
.editTemplate {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: 49%;
    }
    h5 {
      width: 100%;
    }
    .el-divider--horizontal {
      margin-bottom: 60px;
    }
    .btn-ground {
      width: 100%;
      margin-top: 50px;
      .el-form-item__content {
        margin-left: 0 !important;
        text-align: center;
      }
    }
    .el-divider__text {
      font-size: 16px;
      color: #f28c38;
    }
    .el-divider i {
      font-size: 16px;
    }
  }
}

.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
.el-cascader-menu__list {
  padding-right: 10px;
}
</style>


