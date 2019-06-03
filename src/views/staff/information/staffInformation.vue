<template>
  <div class="wrap staffInformation">
    <!-- 头部内容 -->
    <div class="my-top">
      <span>员工基本信息</span>
      <el-button type="warning" size="small" @click="isShowAddAccess = true;curInfo.type='add'">添加员工</el-button>
    </div>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input placeholder="请输入内容" v-model="searchInner" @blur="searchFun">
        <el-select
          v-model="BUCode"
          slot="prepend"
          placeholder="请选择"
          style="width:200px;"
          @change="getType"
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
    <el-table v-loading='isShowLoading' :data="queryTableDate" stripe>
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
            <el-form-item label="伴侣姓名：">
              <span>{{ props.row.nameOfSpouse }}</span>
            </el-form-item>
            <el-form-item label="子女数目：">
              <span>{{ props.row.countOfKids }}</span>
            </el-form-item>
            <el-form-item label="紧急联系人：">
              <span>{{ props.row.emergencyContact }}</span>
            </el-form-item>
            <el-form-item label="入职日期：">
              <span>{{ props.row.dateOfJoining }}</span>
            </el-form-item>
            <el-form-item label="离职日期：">
              <span>{{ props.row.dateOfLeaving }}</span>
            </el-form-item>
            <el-form-item label="离职原因：">
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
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="genderTxt" label="性别"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="statusTxt" label="状态"></el-table-column>
      <el-table-column label="操作" width="500px">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="modifyFun(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-warning"
            @click="forbidden(scope.$index, scope.row)"
          >{{scope.row.status==1?'禁用':'启用'}}</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
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
    <el-dialog title="添加员工" :visible.sync="isShowAddAccess"  :close-on-click-modal="false">
      <editTemplate v-if="isShowAddAccess" :curInfo="curInfo" v-on:listenIsShowMask="listenIsShowMask"></editTemplate>
    </el-dialog>
  </div>
</template>
<script>
import editTemplate from "./editTemplate.vue";
import { deflate } from 'zlib';
export default {
  name: "staffInformation",
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      total: 0, //总计
      pageSize: 6, //页面数据多少
      curPage: 1, //当前页数
      curInfo: {}, //当前内容
      searchInner: "", //搜索内容
      BUCode: "18fa0a70-62c5-11e9-93a9-f78fd132055e", //角色类型
      isShowAddAccess: false, //是否显示新增权限页面
      isShowLoading: false, //是否显示loading页
      regionBUlist: [] //单位列表
    };
  },
  mounted() {
    var _this = this;
    _this.InitializationFun();
  },
  methods: {
    // 初始化
    InitializationFun() {
      var _this = this;
      _this.getregionBU();
      _this.getData();
    },
    // 获取单位列表
    getregionBU() {
      var _this = this;
      var reqUrl = "/server/api/v1/company/regionBUs";
      _this.$http.post(reqUrl, {}).then(res => {
        if (res.data.code == 0) {
          _this.regionBUlist = res.data.data;
        }
      });
    },
    //获取项目数据列表
    getData() {
      var _this = this;
      var reqUrl = "/server/api/v1/staff/getAll";
      var myData = { BUCode: _this.BUCode };
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
              };
              // 性别
              switch (item.gender) {
                case 'M':
                  item.genderTxt = "男";
                  break;
                case 'F':
                  item.genderTxt = "女";
                  break;
                default:
                  item.genderTxt = "未知";
              };
              // 户口性质
              switch(item.hukouType){
                case 1:
                  item.hukouTypeTxt = '城镇';
                  break;
                case 2:
                  item.hukouTypeTxt = '农村';
                  break;
                default:
                  item.hukouTypeTxt = '未知';
              };
              //婚姻状况 
              switch(item.martialStatus){
                case 0:
                  item.martialStatusTxt = '未婚';
                  break;
                case 1:
                  item.martialStatusTxt = '已婚';
                  break;
                default:
                  item.martialStatusTxt = '未知';
              };
              //长工/合约
              switch(item.permanentOrContract){
                case 'P':
                  item.permanentOrContractTxt = '长工';
                  break;
                case 'C':
                  item.permanentOrContractTxt = '合约';
                  break;
                default:
                  item.permanentOrContractTxt = '未知';
              };
              // 年假清空方法
              switch(item.annualLeaveWriteOffMethod){
                case 1:
                  item.annualLeaveWriteOffMethodTxt = '年结';
                  break;
                case 2:
                  item.annualLeaveWriteOffMethodTxt = '自定义日期结算';
                  break;
                default:
                  item.annualLeaveWriteOffMethodTxt = '未知';
              };
              // 工资类型
              switch(item.payrollType){
                case 1:
                  item.payrollTypeTxt = '月薪';
                  break;
                case 2:
                  item.payrollTypeTxt = '周薪';
                  break;
                case 3:
                  item.payrollTypeTxt = '时薪';
                  break;
                default:
                  item.payrollTypeTxt = '未知';
              };
              // 档案所在单位可否调动
              switch(item.fileUnitMove){
                case 1:
                  item.fileUnitMoveTxt = '是';
                  break;
                case 0:
                  item.fileUnitMoveTxt = '否';
                  break;
                default:
                  item.fileUnitMoveTxt = '未知';
              };
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 循环数据列表获取属性
    mapFun(objArr) {
      var _this = this;
      return objArr.map(item => {
        item.createTime = _this.$toolFn.timeFormat(item.createTime);
        item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
        item.isStatus = item.status == 1 ? "启用" : "禁用";
        item.children = item.nodes;
        if (item.children != 0) {
          _this.mapFun(item.children);
        }
        return item;
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
    // 获取角色类型
    getType(val) {
      var _this = this;
      _this.BUCode = val;
      _this.getData();
    },
    // 根据name字段查找数据
    searchFun() {
      var _this = this;
      if (_this.searchInner != "") {
        var reqUrl = "/server/api/v1/projectAccess/getByOptions";
        var data = { name: _this.searchInner };
        _this.$http.post(reqUrl, data).then(res => {
          if (res.data.code == 0) {
            _this.tableData = res.data.data
              .map(item => {
                item.createTime = _this.$toolFn.timeFormat(item.createTime);
                item.modifyTime = _this.$toolFn.timeFormat(item.modifyTime);
                item.isStatus = item.status == 1 ? "启用" : "禁用";
                item.children = item.nodes;
                return item;
              }) //倒序
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
          } else {
            console.log(res.data.code);
          }
        });
      } else {
        _this.getData();
      }
    },
    // 禁用
    forbidden(index, res) {
      var _this = this;
      var reqUrl = "/server/api/v1/projectAccess/update";
      var data = { id: res.id };
      var txt = "";
      if (res.status == 1) {
        data.status = 0;
        txt = "此操作将禁用, 是否继续?";
      } else {
        data.status = 1;
        txt = "此操作将启用, 是否继续?";
      }
      _this
        .$confirm(txt, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http.post(reqUrl, data).then(res => {
            _this.reload();
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消操作~"
          });
        });
    },
    // 删除
    handleDelete(index, res) {
      var _this = this;
      _this
        .$confirm("此操作将永久删除该数据, 是否继续?", "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .post("/server/api/v1/projectAccess/delete", { id: res.id })
            .then(res => {
              _this.reload();
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
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
</style>






