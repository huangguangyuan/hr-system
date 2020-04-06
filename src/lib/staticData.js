//审批流程类型
export function approveHisTypeTxt(typeId){
    switch (typeId) {
        case 1:
          return "批准";
        case 2:
          return "不批准";
        case 3:
          return "转派";
        case 90:
          return "撤回";
        case 99:
          return "新建";
        case 100:
          return '结算';
        default:
          return "未知";
      }
  }
//月份
export function monthList(){
  return [{val:1,txt:'1月'},{val:2,txt:'2月'},{val:3,txt:'3月'},{val:4,txt:'4月'},{val:5,txt:'5月'},{val:6,txt:'6月'},{val:7,txt:'7月'},{val:8,txt:'8月'},{val:9,txt:'9月'},
  {val:10,txt:'10月'},{val:11,txt:'11月'},{val:12,txt:'12月'}]
}
//性别
export function taxableTxt(taxable){
  switch (taxable) {
    case 0:
      return "否";
    case 1:
      return "是";
    default:
      return "未知";
  }
}
//性别
export function genderTxt(gender){
  switch (gender) {
    case "M":
      return "男";
    case "F":
      return "女";
    default:
      return "未知";
  }
}

//专项附加扣除
export function deductionTypeTxt(typeId){
  switch (typeId) {
    case 1:
      return "赡养老人";
    case 2:
      return "子女教育";
    case 3:
      return "房贷利息";
    case 4:
      return "住房租金";
    case 5:
      return "继续教育";
    case 6:
      return "大病医疗";
    default:
      return "未知";
  }
}

//社保类型
export function SITxt(typeId){
  switch (typeId) {
    case 1:
      return "养老";
    case 2:
      return "医疗";
    case 3:
      return "工伤";
    case 4:
      return "生育";
    case 5:
      return "失业";
    case 6:
      return "大病";
    case 7:
      return "医疗保险";
    default:
      return "未知"
  }
}

//缴纳类型
export function paymentIdTxt(typeId){
  switch (typeId) {
    case 1:
      return "公司";
    case 2:
      return "个人";
    default:
      return "未知"
  }
}
//户籍类型
export function householdIdTxt(typeId){
  switch (typeId) {
    case 1:
      return "外地农村";
    case 2:
      return "外地城镇";
    case 3:
      return "本地农村";
    case 4:
      return "本地城镇";
    case 5:
      return "港澳台";
    case 6:
      return "外籍";
  }
}

//工作状态
export function workStatusTxt(workStatus){
  switch (workStatus) {
    case 1:
      return "在职";
    case 2:
      return "离职";
    case 3:
      return "停薪留职";
    default:
      return "未知";
  }
}
 // 户口性质
export function hukouTypeTxt(hukouType){
  switch (hukouType) {
    case 1:
      return "城镇";
    case 2:
      return "农村";
    default:
      return "未知";
  }
}

//婚姻状况
export function martialStatusTxt(martialStatus){
  switch (martialStatus) {
    case 0:
      return "未婚";
    case 1:
      return "已婚";
    default:
      return "未知";
  }
}
 //长工/合约
export function permanentOrContractTxt(permanentOrContract){
  switch (permanentOrContract) {
    case "P":
      return "长工";
    case "C":
      return "合约";
    default:
      return "未知";
  }
}
// 年假清空方法
export function annualLeaveWriteOffMethodTxt(annualLeaveWriteOffMethod){
  // 年假清空方法
  switch (annualLeaveWriteOffMethod) {
    case 1:
      return "年结";
    case 2:
      return "自定义日期结算";
    default:
      return "未知";
  }
}

// 工资类型
export function payrollTypeTxt(payrollType){
  switch (payrollType) {
    case 1:
      return "月薪";
    case 2:
      return "周薪";
    case 3:
      return "时薪";
    default:
      return "未知";
  }
}

// 档案所在单位可否调动
export function fileUnitMoveTxt(fileUnitMove){
  switch (fileUnitMove) {
    case 1:
      return "是";
    case 0:
      return "否";
    default:
      return "未知";
  }
}