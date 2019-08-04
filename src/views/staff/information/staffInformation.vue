<template>
  <div class="staffInformation">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>员工基本信息</span>
      <el-button v-if="userRight" type="warning" size="small" @click="isShowAddAccess = true;curInfo.type='add'">添加员工</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入员工姓名" v-model="searchInner" @blur="searchFun">
        <el-select
          v-model="BUCode"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="selectFun"
        >
          <el-option
            v-for="(item,index) in regionBUlist"
            :key="index"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchFun">搜 索</el-button>
      </el-input>
    </div>
    <!-- 列表内容 -->
    <el-table v-loading="isShowLoading" :data="queryTableDate" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="中文名称：">
              <span>{{ props.row.nameChinese }}</span>
            </el-form-item>
            <el-form-item label="英文名称：">
              <span>{{ props.row.nameEnglish }}</span>
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
            <el-form-item label="伴侣姓名：" v-if="props.row.martialStatus == "1"">
              <span>{{ props.row.nameOfSpouse }}</span>
            </el-form-item>
            <el-form-item label="子女数目：" v-if="props.row.martialStatus == "1"">
              <span>{{ props.row.countOfKids }}</span>
            </el-form-item>
            <el-form-item label="紧急联系人：">
              <span>{{ props.row.emergencyContact }}</span>
            </el-form-item>
            <el-form-item label="入职日期：">
              <span>{{ props.row.dateOfJoining }}</span>
            </el-form-item>
            <el-form-item label="离职日期：" v-if="props.row.status == "2"">
              <span>{{ props.row.dateOfLeaving }}</span>
            </el-form-item>
            <el-form-item label="离职原因：" v-if="props.row.status == "2"">
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
      <el-table-column prop="nameChinese" label="名称"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px;border-radius: 100%;"
            :src="scope.row.photo?scope.row.photo:AvatarDefault"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="genderTxt" label="性别"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button v-if="userRight" size="mini" icon="el-icon-edit" @click="modifyFun(scope.$index, scope.row)">编辑</el-button>
          <!-- 状态 -->
          <el-button v-if="userRight"
            size="mini"
            icon="el-icon-bangzhu"
            @click="isShowState = true;staffID = scope.row.id;"
          >状态</el-button>
          <!-- 删除 -->
          <el-button v-if="userRight"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
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
    <div class="pageInfo">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="curChange"
      ></el-pagination>
      <p>当前为第 {{curPage}} 页，共有 {{pageTotal}} 页</p>
    </div>
    <!-- 添加员工 -->
    <el-dialog
      title="添加员工"
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
    <el-dialog title="改变状态" :visible.sync="isShowState">
      <el-radio-group v-model="staffState">
        <el-radio :label="1">在职</el-radio>
        <el-radio :label="2">离职</el-radio>
        <el-radio :label="3">停薪留职</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='changeState'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import editTemplate from "./editTemplate.vue";
import { deflate } from "zlib";
export default {
  name: "staffInformation",
  inject: ["reload"],
  props: ["userRight_props"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      regionBUlist: [], //单位列表
      BUCode: "", //角色类型
      staffState:'',//员工状态
      staffID:'',//员工ID
      isShowLoading: false, //是否显示loading页
      isShowAddAccess: false, //是否显示新增页面
      isShowState: false, //是否显示状态
      AvatarDefault:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //默认头像
      userRight:false
    };
  },
  mounted() {
    var _this = this;
    _this.userRight = _this.userRight_props;
    
    _this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      var _this = this;
      _this.getregionBU();
    },
    // 获取单位列表
    getregionBU() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUs";
      _this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          _this.regionBUlist = res.data.data;
          _this.BUCode = this.$toolFn.sessionGet("staffBUCode")
            ? this.$toolFn.sessionGet("staffBUCode")
            : res.data.data[0].code;
          _this.getData(this.BUCode);
        }
      });
    },
    //获取项目数据列表
    getData(BUCode) {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/getAll";
      var myData = { BUCode: BUCode };
      _this.isShowLoading = true;
      _this.$http
        .post(reqUrl, myData)
        .then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              // 状态
              switch (item.status) {
                case 1:
                  item.statusTxt = "在职";
                  break;
                case 2:
                  item.statusTxt = "离职";
                  break;
                case 3:
                  item.statusTxt = "停薪留职";
                  break;
                default:
                  item.statusTxt = "未知";
              }
              // 性别
              switch (item.gender) {
                case "M":
                  item.genderTxt = "男";
                  break;
                case "F":
                  item.genderTxt = "女";
                  break;
                default:
                  item.genderTxt = "未知";
              }
              // 户口性质
              switch (item.hukouType) {
                case 1:
                  item.hukouTypeTxt = "城镇";
                  break;
                case 2:
                  item.hukouTypeTxt = "农村";
                  break;
                default:
                  item.hukouTypeTxt = "未知";
              }
              //婚姻状况
              switch (item.martialStatus) {
                case 0:
                  item.martialStatusTxt = "未婚";
                  break;
                case 1:
                  item.martialStatusTxt = "已婚";
                  break;
                default:
                  item.martialStatusTxt = "未知";
              }
              //长工/合约
              switch (item.permanentOrContract) {
                case "P":
                  item.permanentOrContractTxt = "长工";
                  break;
                case "C":
                  item.permanentOrContractTxt = "合约";
                  break;
                default:
                  item.permanentOrContractTxt = "未知";
              }
              // 年假清空方法
              switch (item.annualLeaveWriteOffMethod) {
                case 1:
                  item.annualLeaveWriteOffMethodTxt = "年结";
                  break;
                case 2:
                  item.annualLeaveWriteOffMethodTxt = "自定义日期结算";
                  break;
                default:
                  item.annualLeaveWriteOffMethodTxt = "未知";
              }
              // 工资类型
              switch (item.payrollType) {
                case 1:
                  item.payrollTypeTxt = "月薪";
                  break;
                case 2:
                  item.payrollTypeTxt = "周薪";
                  break;
                case 3:
                  item.payrollTypeTxt = "时薪";
                  break;
                default:
                  item.payrollTypeTxt = "未知";
              }
              // 档案所在单位可否调动
              switch (item.fileUnitMove) {
                case 1:
                  item.fileUnitMoveTxt = "是";
                  break;
                case 0:
                  item.fileUnitMoveTxt = "否";
                  break;
                default:
                  item.fileUnitMoveTxt = "未知";
              }
              // 时间转换
              item.dateOfBirth = _this.$toolFn
                .timeFormat(item.dateOfBirth)
                .slice(0, 10);
              item.dateOfJoining = _this.$toolFn
                .timeFormat(item.dateOfJoining)
                .slice(0, 10);
              item.dateOfLeaving = _this.$toolFn
                .timeFormat(item.dateOfLeaving)
                .slice(0, 10);
              return item;
            })
            .sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
            });
          _this.total = _this.tableData.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前页数
    curChange(val) {
      var _this = this;
      _this.curPage = val;
    },
    // 接收子组件发送信息
    listenIsShowMask(res) {
      this.isShowAddAccess = false;
    },
    // 获取单位BUCode
    selectFun(val) {
      this.BUCode = val;
      this.getData(this.BUCode);
      this.$toolFn.sessionSet("staffBUCode", val);
    },
    // 根据name字段查找数据
    searchFun() {
      var _this = this;
      if (_this.searchInner != "") {
        var reqUrl = "/server/api/v1/staff/getByOptions";
        var data = { nameChinese: _this.searchInner };
        _this.$http.post(reqUrl, data).then(res => {
          _this.isShowLoading = false;
          _this.tableData = res.data.data
            .map(item => {
              // 状态
              switch (item.status) {
                case 1:
                  item.statusTxt = "在职";
                  break;
                case 2:
                  item.statusTxt = "离职";
                  break;
                case 3:
                  item.statusTxt = "停薪留职";
                  break;
                default:
                  item.statusTxt = "未知";
              }
              // 性别
              switch (item.gender) {
                case "M":
                  item.genderTxt = "男";
                  break;
                case "F":
                  item.genderTxt = "女";
                  break;
                default:
                  item.genderTxt = "未知";
              }
              // 户口性质
              switch (item.hukouType) {
                case 1:
                  item.hukouTypeTxt = "城镇";
                  break;
                case 2:
                  item.hukouTypeTxt = "农村";
                  break;
                default:
                  item.hukouTypeTxt = "未知";
              }
              //婚姻状况
              switch (item.martialStatus) {
                case 0:
                  item.martialStatusTxt = "未婚";
                  break;
                case 1:
                  item.martialStatusTxt = "已婚";
                  break;
                default:
                  item.martialStatusTxt = "未知";
              }
              //长工/合约
              switch (item.permanentOrContract) {
                case "P":
                  item.permanentOrContractTxt = "长工";
                  break;
                case "C":
                  item.permanentOrContractTxt = "合约";
                  break;
                default:
                  item.permanentOrContractTxt = "未知";
              }
              // 年假清空方法
              switch (item.annualLeaveWriteOffMethod) {
                case 1:
                  item.annualLeaveWriteOffMethodTxt = "年结";
                  break;
                case 2:
                  item.annualLeaveWriteOffMethodTxt = "自定义日期结算";
                  break;
                default:
                  item.annualLeaveWriteOffMethodTxt = "未知";
              }
              // 工资类型
              switch (item.payrollType) {
                case 1:
                  item.payrollTypeTxt = "月薪";
                  break;
                case 2:
                  item.payrollTypeTxt = "周薪";
                  break;
                case 3:
                  item.payrollTypeTxt = "时薪";
                  break;
                default:
                  item.payrollTypeTxt = "未知";
              }
              // 档案所在单位可否调动
              switch (item.fileUnitMove) {
                case 1:
                  item.fileUnitMoveTxt = "是";
                  break;
                case 0:
                  item.fileUnitMoveTxt = "否";
                  break;
                default:
                  item.fileUnitMoveTxt = "未知";
              }
              // 时间转换
              item.dateOfBirth = _this.$toolFn.timeFormat(item.dateOfBirth);
              item.dateOfJoining = _this.$toolFn.timeFormat(item.dateOfJoining);
              item.dateOfLeaving = _this.$toolFn.timeFormat(item.dateOfLeaving);
              return item;
            })
            .sort((a, b) => {
              if (a.id < b.id) {
                return 1;
              }
              if (a.id > b.id) {
                return -1;
              }
              return 0;
            });
          _this.total = _this.tableData.length;
        });
      } else {
        _this.getData(this.BUCode);
      }
    },
    // 编辑修改
    modifyFun(index, res) {
      this.curInfo = res;
      this.curInfo.type = "modify";
      this.isShowAddAccess = true;
    },
    // 改变转态
    changeState(index, res) {
      if(this.staffState == ''){
        this.$message.info('请选择状态');
        return false;
      }
      var reqUrl = '/server/api/v1/staff/update';
      var data = {
        id:this.staffID,
        status:this.staffState
      }
      this.$http.post(reqUrl,data).then(res => {
        if(res.data.code == 0){
          this.reload();
          this.$message.success('修改成功！');
        }
      })
    },
    // 删除
    handleDelete(index, res) {
      var _this = this;
      _this
        .$confirm("此操作将永久删除该员工信息, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .post("/server/api/v1/staff/delete", { id: res.id })
            .then(res => {
              _this.reload();
              _this.$message.success("操作成功！");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
  computed: {
    queryTableDate() {
      var _this = this;
      var begin = (_this.curPage - 1) * _this.pageSize;
      var end = _this.curPage * _this.pageSize;
      return _this.tableData.slice(begin, end);
    },
    pageTotal() {
      var _this = this;
      var pageTotal = Math.ceil(_this.total / _this.pageSize);
      return pageTotal;
    }
  },
  components: {
    editTemplate
  }
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
.pageInfo {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 14px;
    margin-right: 20px;
  }
}
.search-wrap {
  margin: 20px auto;
  width: 100%;
  box-sizing: border-box;
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






