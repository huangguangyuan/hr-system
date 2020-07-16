<template>
  <div class="staffInfo">
    <ul class="msgList" v-if="isContent">
      <li>
          <span class="title">中文名</span>：
          <span class="val">{{tableData.nameChinese}}</span>
        </li>
      <li>
          <span class="title">英文名</span>：
          <span class="val">{{tableData.nameEnglish}}</span>
        </li>
      <li>
          <span class="title">性别</span>：
          <span class="val">{{tableData.gender}}</span>
        </li>
      <li>
          <span class="title">员工别名</span>：
          <span class="val">{{tableData.staffAlias}}</span>
        </li>
      <li>
          <span class="title">员工编号</span>：
          <span class="val">{{tableData.staffNo}}</span>
        </li>      
      <li>
          <span class="title">电话</span>：
          <span class="val">{{tableData.mobile}}</span>
        </li>
      <li>
          <span class="title">户口所在地</span>：
          <span class="val">{{tableData.hukouLoction}}</span>
        </li>
      <li>
          <span class="title">文化程度</span>：
          <span class="val">{{tableData.cultureLevelTxt}}</span>
        </li>
      <li>
          <span class="title">政治面貌</span>：
          <span class="val">{{tableData.politicalBackgroundListTxt}}</span>
        </li>        
      <li>
          <span class="title">紧急联系人</span>：
          <span class="val">{{tableData.emergencyContact}}</span>
        </li>
      <li>
          <span class="title">档案所在单位</span>：
          <span class="val">{{tableData.fileUnit}}</span>
        </li>
      <li>
          <span class="title">职位</span>：
          <span class="val">{{tableData.position}}</span>
        </li>
      <li>
          <span class="title">身份证号码</span>：
          <span class="val">{{tableData.IDNo}}</span>
        </li>
      <li>
          <span class="title">地址</span>：
          <span class="val">{{tableData.address}}</span>
        </li>
      <li>
          <span class="title">出生地</span>：
          <span class="val">{{tableData.dateOfPlace}}</span>
        </li>
      <li>
          <span class="title">民族</span>：
          <span class="val">{{tableData.ethnic}}</span>
        </li>
      <li>
          <span class="title">银行帐号</span>：
          <span class="val">{{tableData.bankAccountNo}}</span>
        </li>
      <li>
          <span class="title">银行名称</span>：
          <span class="val">{{tableData.bankName}}</span>
        </li>
       <li>
          <span class="title">银行账户名称</span>：
          <span class="val">{{tableData.bankAccountName}}</span>
        </li>
       <li>
          <span class="title">社保养老账户</span>：
          <span class="val">{{tableData.SIAccount}}</span>
        </li>
       <li>
          <span class="title">住房公积金账户</span>：
          <span class="val">{{tableData.HCAccount}}</span>
        </li>
       <li>
          <span class="title">基本医疗保险卡号</span>：
          <span class="val">{{tableData.medicalSchemeAccount}}</span>
        </li>
    </ul>
    <div class="noContent" v-else>
      暂无数据
    </div>
  </div>
</template>
<script>

import {cultureLevelList,politicalBackgroundList} from "@/lib/staticData.js";
export default {
  name: "staffInfo",
  inject: ["reload"],
  data() {
    return {
      tableData: {},
      isContent:false//是否有内容
    };
  },
  mounted() {
    this.getStaffInfo();
  },
  methods: {
    // 获取出粮周期
    getStaffInfo() {
      var reqUrl = "/server/api/v1/staff/getByCode";
      this.$myApi.http.post(reqUrl, {code:this.$toolFn.curUser.userCode}).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data
          let cultureLevelItem = cultureLevelList().find(f=>{return f.val === this.tableData.cultureLevel });
          let politicalBackgroundListItem = politicalBackgroundList().find(f=>{return f.val === this.tableData.politicalBackground });
          this.tableData.cultureLevelTxt = cultureLevelItem?cultureLevelItem.txt:this.tableData.cultureLevel
          this.tableData.politicalBackgroundListTxt = politicalBackgroundListItem?politicalBackgroundListItem.txt:this.tableData.politicalBackground
          
          this.isContent = true
        }
      });
    }
  },
  computed: {
  }
};
</script>
<style scoped lang="scss">
.staffInfo{
  width: 90%;
  margin: 15px auto;
  .grid-content {
    padding: 10px 20px;
    background-color: #d3dce6;
    margin-bottom: 15px;
    border-radius: 8px;
    font-size: 14px;
    color: #909399;
    span{
      font-size: 14px;
      font-weight: bold;
      color: #666;
    }
  }
  .noContent{
    line-height: 200px;text-align: center;color: #d3dce6;
  }
}
.msgList {
  margin: 20px auto 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    padding: 15px 10px;
    font-size: 14px;
    width: 48%;
    box-sizing: border-box;
    list-style: none;
    .title {
      color: #99a9bf;
      display: inline-block;
      min-width: 120px;
      text-align: left;
    }
    border-bottom: 1px #99a9bf dashed;
  }
}
</style>