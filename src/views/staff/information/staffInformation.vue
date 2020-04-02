<template>
  <div class="staffInformation" >
    <!-- 头部内容 -->
    <div class="my-top">
      <span>员工基本信息</span>
      <el-button v-if="userRight" type="warning" size="small" @click="isShowAddAccess = true;curInfo.type='add'" icon="el-icon-plus">添加员工</el-button>
    </div>
    <!-- 搜索 -->
    <bus-and-search :busAndSearch_props="busAndSearch" :BUCodeSelected.sync="BUCodeSelected" ref="busAndSearch"></bus-and-search>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="tableData" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <!-- <el-form-item label="登录账户：">
              <span>{{ props.row.account }}</span>
            </el-form-item> -->
            <el-form-item label="员工编号：">
              <span>{{ props.row.staffNo }}</span>
            </el-form-item>
            <el-form-item label="第一姓名称：">
              <span>{{ props.row.nameChinese }}</span>
            </el-form-item>
            <el-form-item label="第二姓名称：">
              <span>{{ props.row.nameEnglish }}</span>
            </el-form-item>
            <el-form-item label="员工别名：">
              <span>{{ props.row.staffAlias }}</span>
            </el-form-item>
            <el-form-item label="职位：">
              <span>{{ props.row.position }}</span>
            </el-form-item>
            <el-form-item label="性别：">
              <span>{{ props.row.genderTxt }}</span>
            </el-form-item>
            <el-form-item label="出生日期：">
              <span>{{ props.row.dateOfBirth }}</span>
            </el-form-item>
            <el-form-item label="地址：">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="电话：">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="电子邮箱：">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="国籍：">
              <span>{{ props.row.nationality }}</span>
            </el-form-item>
            <el-form-item label="国家号码：">
              <span>{{ props.row.mobileCountryCode }}</span>
            </el-form-item>
            <el-form-item label="身份证号码：">
              <span>{{ props.row.IDNo }}</span>
            </el-form-item>
            <el-form-item label="民族：">
              <span>{{ props.row.ethnic }}</span>
            </el-form-item>
            <el-form-item label="政治面貌：">
              <span>{{ props.row.politicalBackground }}</span>
            </el-form-item>
            <el-form-item label="文化程度：">
              <span>{{ props.row.cultureLevel }}</span>
            </el-form-item>
            <el-form-item label="户口性质：">
              <span>{{ props.row.hukouTypeTxt }}</span>
            </el-form-item>
            <el-form-item label="户口所在地：">
              <span>{{ props.row.hukouLoction }}</span>
            </el-form-item>
            <el-form-item label="婚姻状况：">
              <span>{{ props.row.martialStatusTxt }}</span>
            </el-form-item>
            <el-form-item label="伴侣姓名：" v-if="props.row.martialStatus == '1'">
              <span>{{ props.row.nameOfSpouse }}</span>
            </el-form-item>
            <el-form-item label="子女数目：" v-if="props.row.martialStatus == '1'">
              <span>{{ props.row.countOfKids }}</span>
            </el-form-item>
            <el-form-item label="紧急联系人：">
              <span>{{ props.row.emergencyContact }}</span>
            </el-form-item>
            <el-form-item label="入职日期：">
              <span>{{ props.row.dateOfJoining }}</span>
            </el-form-item>
            <el-form-item label="离职日期：" v-if="props.row.workStatus == '2'">
              <span>{{ props.row.dateOfLeaving }}</span>
            </el-form-item>
            <el-form-item label="离职原因：" v-if="props.row.workStatus == '2'">
              <span>{{ props.row.reasonOfLeaving }}</span>
            </el-form-item>
            <el-form-item label="工作地点：">
              <span>{{ props.row.workingLocation }}</span>
            </el-form-item>
            <el-form-item label="外派地点：">
              <span>{{ props.row.outsourceLocation }}</span>
            </el-form-item>
            <el-form-item label="长工/合约：">
              <span>{{ props.row.permanentOrContractTxt }}</span>
            </el-form-item>
            <el-form-item label="年假清空方法：">
              <span>{{ props.row.annualLeaveWriteOffMethodTxt }}</span>
            </el-form-item>
            <el-form-item label="每年可享有薪年假：">
              <span>{{ props.row.annualLeaveEntitled }}</span>
            </el-form-item>
            <el-form-item label="每年可享有薪病假：">
              <span>{{ props.row.paidSickLeaveEntitled }}</span>
            </el-form-item>
            <el-form-item label="工资类型：">
              <span>{{ props.row.payrollTypeTxt }}</span>
            </el-form-item>
            <el-form-item label="约满酬金：">
              <span>{{ props.row.gratuity }}</span>
            </el-form-item>
            <el-form-item label="医疗计划：">
              <span>{{ props.row.medicalScheme }}</span>
            </el-form-item>
            <el-form-item label="银行名称：">
              <span>{{ props.row.bankName }}</span>
            </el-form-item>
            <el-form-item label="银行账户名称：">
              <span>{{ props.row.bankAccountName }}</span>
            </el-form-item>
            <el-form-item label="银行账户：">
              <span>{{ props.row.bankAccountNo }}</span>
            </el-form-item>
            <el-form-item label="档案所在单位：">
              <span>{{ props.row.fileUnit }}</span>
            </el-form-item>
            <el-form-item label="档案所在单位可否调动：">
              <span>{{ props.row.fileUnitMoveTxt }}</span>
            </el-form-item>
            <el-form-item label="社保养老账户电脑号：">
              <span>{{ props.row.SIAccount }}</span>
            </el-form-item>
            <el-form-item label="住房公积金账户：">
              <span>{{ props.row.HCAccount }}</span>
            </el-form-item>
            <el-form-item label="基本医疗保险卡号：">
              <span>{{ props.row.medicalSchemeAccoun }}</span>
            </el-form-item>
            <el-form-item label="状态：">
              <span>{{ props.row.statusTxt }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      
      <el-table-column sortable prop="staffNo" label="员工编号"></el-table-column>
      <el-table-column sortable prop="nameChinese" label="名称"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.photo?scope.row.photo:avatarDefault"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column sortable prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" width="500px">
        <template slot-scope="scope">
          <!-- 编辑账户 -->
          <el-button v-if="userRight" size="mini" icon="el-icon-edit" @click="modifyAccountFun(scope.row.code)">编辑账号</el-button>
          <!-- 编辑 -->
          <el-button v-if="userRight" size="mini" icon="el-icon-edit" @click="modifyFun(scope.$index, scope.row)">编辑</el-button>
          <!-- 是否在职 -->
          <el-button v-if="userRight"
            size="mini"
            icon="el-icon-bangzhu"
            @click="isShowState = true;staffID = scope.row.id;workStatus = scope.row.workStatus"
          >状态</el-button>
          <!-- 状态 -->
          <el-button v-if="userRight" size="mini" icon="el-icon-warning" @click='prohibitFun(scope.$index, scope.row)'>{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <!-- 删除 -->
          <!-- <el-button v-if="userRight"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button> -->
          <!-- 详细操作 -->
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="getCurInfo(scope.$index, scope.row)"
          >详细操作</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页编码 -->
    <page-info :pageInfo_props="pageInfo" :pageList.sync="pageList" :isShowLoading.sync="isShowLoading"  ref="pageInfo"></page-info>
    <!-- 添加员工 -->
    <el-dialog
      title="编辑员工"
      width="60%"
      :visible.sync="isShowAddAccess"
      :close-on-click-modal="false"
    >
      <editTemplate
        v-if="isShowAddAccess"
        :curInfo="curInfo"
        :userRight_props="userRight"
        v-on:listenIsShowMask="listenIsShowMask"
      ></editTemplate>
    </el-dialog>
    <!-- 改变状态 -->
    <el-dialog title="是否在职" :visible.sync="isShowState">
      <el-radio-group v-model="workStatus">
        <el-radio :label="1">在职</el-radio>
        <el-radio :label="2">离职</el-radio>
        <el-radio :label="3">停薪留职</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowState = false">取 消</el-button>
        <el-button type="primary" @click='changeState'>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑账号 -->
    <el-dialog title="账户信息" :visible.sync="isShowAccountState">
      <el-form label-width="170px" size="mini">
      <el-form-item label="登录账户" prop="account" >
        <el-input v-model="accountInfo.account" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="accountInfo.password" show-password></el-input>
      </el-form-item>
      <el-form-item v-if="userInfo.roleTypeId == 2 && userInfo.lev == 301" label="关联系统管理员账户：" prop="hrCode" >
        <el-select v-model="accountInfo.hrCode" placeholder="请选择关联系统管理员" >
        <el-option v-for="item in HRadminList" :key="item.id" :label="item.name" :value="item.code"></el-option>
      </el-select>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAccountState = false">取 消</el-button>
        <el-button type="primary" @click='subAccount'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import editTemplate from "./editTemplate.vue";
import md5 from "js-md5";
import pageInfo from "@/components/pageInfo.vue";
import busAndSearch from "@/components/busAndSearch.vue";
import {genderTxt,workStatusTxt,hukouTypeTxt,martialStatusTxt,permanentOrContractTxt,annualLeaveWriteOffMethodTxt,payrollTypeTxt,fileUnitMoveTxt} from "@/lib/staticData.js";
export default {
  components: {
    editTemplate,pageInfo,busAndSearch
  },
  name: "staffInformation",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      pageList:[],
      curInfo: {}, //当前内容
      BUCodeSelected: "", //单位code
      workStatus:'',//员工状态
      staffID:'',//员工ID
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      isShowState: false, //是否显示状态
      isShowAccountState:false,//是否显示账号信息
      avatarDefault:require("@/assets/images/avatar.png"), //默认头像
      accountInfo:{},
      HRadminList:[],//管理员列表
      userRight:false,
      userInfo:{},
      filter:{searchKey:'',searchField:['account','staffNo','nameChinese','nameEnglish','staffAlias','position','genderTxt',
      'dateOfBirth','address','mobile','email','IDNo','ethnic','politicalBackground','hukouTypeTxt','martialStatusTxt','emergencyContact','SIAccount','medicalSchemeAccoun','HCAccount','SIAccount']}
    };
  },
  computed:{
    pageInfo(){
      return {
        reqParams:{//请求分页参数
            isReq:false,
            url:"/server/api/v1/staff/getAll",
            data:{ hrCode: this.$toolFn.curUser.userCode,BUCode:this.BUCodeSelected }
          }
        }
    },
    busAndSearch(){
      return {filter:this.filter};
    },
    tableData(){
      return this.pageList.map(item => {
        item.statusTxt = workStatusTxt(item.workStatus);
        item.genderTxt = genderTxt(item.gender);
        item.hukouTypeTxt = hukouTypeTxt(item.hukouType);
        item.martialStatusTxt = martialStatusTxt(item.martialStatus);
        item.permanentOrContractTxt = permanentOrContractTxt(item.permanentOrContract);
        item.annualLeaveWriteOffMethodTxt = annualLeaveWriteOffMethodTxt(item.annualLeaveWriteOffMethod);
        item.payrollTypeTxt = payrollTypeTxt(item.payrollType);
        item.fileUnitMoveTxt = fileUnitMoveTxt(item.fileUnitMove);
        item.dateOfBirth = this.$toolFn.timeFormat(item.dateOfBirth).slice(0, 10);
        item.dateOfJoining = this.$toolFn.timeFormat(item.dateOfJoining).slice(0, 10);
        item.dateOfLeaving = this.$toolFn.timeFormat(item.dateOfLeaving).slice(0, 10);
        item.annualLeaveWriteOffDate = this.$toolFn.timeFormat(item.annualLeaveWriteOffDate).slice(0, 10);
        item.annualLeaveRetainClearDate = this.$toolFn.timeFormat(item.annualLeaveRetainClearDate).slice(0, 10);
        return item;
      });
    }
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    this.userRight = this.userRight_props;
    //this.InitializationFun();
    
  },
  methods: {
    // 禁用
    prohibitFun(index, res) {
      var txt = '';
      var status = 1;
      if(res.status == 1){
          txt = '此操作将启用该数据, 是否继续?'
          status = 0;
      }else{
          txt = '此操作将禁用该数据, 是否继续?'
          status = 1;
      }
      this.$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          var data = {
                id:res.id,
                status:status
            }
          this.$myApi.http.post("/server/api/v1/staff/update", data).then(res => {
              this.reload();
              this.$message.success("操作成功~");
            });
        })
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
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
    },
    // 编辑修改
    modifyFun(index, res) {
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.isShowAddAccess = true;
    },
    //提交账号修改
    subAccount() {
      var reqUrl = '/server/api/v1/staff/account/update';
      var data = {
        staffCode:this.accountInfo.staffCode,
        hrCode:this.accountInfo.hrCode
      }
      if (this.accountInfo.password && this.accountInfo.password != ""){
        data.password = md5(this.accountInfo.password);
      }
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('修改成功！');
        }else{
          this.$message.success(res.data.msg);
        }
      })
    },    
    //编辑账号
    modifyAccountFun(code) {
      var reqUrl = '/server/api/v1/staff/account';
      var data = {
        staffCode:code
      }
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.isShowAccountState = true;
          this.accountInfo = res.data.data.account;
        }
      })
    },
    // 改变状态
    changeState(index, res) {
      if(this.workStatus == ''){
        this.$message.info('请选择状态');
        return false;
      }
      var reqUrl = '/server/api/v1/staff/update';
      var data = {
        id:this.staffID,
        workStatus:this.workStatus
      }
      this.$myApi.http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('修改成功！');
        }
      })
    },
    // 删除
    handleDelete(index, res) {
      this.$confirm("此操作将永久删除该员工信息, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$myApi.http.post("/server/api/v1/staff/delete", { id: res.id }).then(res => {
              this.reload();
              this.$message.success("操作成功！");
            });
        })
    },
    // 获取当前信息
    getCurInfo(index, res) {
      this.$store.commit({
        type: "getStaffInfo",
        staffInfo: res,
        isShowDetails: true
      });
    }
  },
  watch: {
    BUCodeSelected: {
      handler: function(newVal) {
        this.pageInfo.reqParams.isReq = true;
        this.$refs.pageInfo.getData(this.pageInfo);
        this.getHRadminList(this.BUCodeSelected);
      }
    },
    "filter.searchKey":{
      handler: function(newVal) {
        this.$refs.pageInfo.searchKey(this.busAndSearch.filter);
      }
    }
  },
};
</script>
<style scoped lang="scss">
.my-top {
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 25%;
}
.staffInformation {
  .photo {
    width: 35px;
    height: 35px;
    border-radius: 5px;
  }
}
</style>






