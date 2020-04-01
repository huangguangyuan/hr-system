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
  switch (id) {
    case 1:
      str = "外地农村";
      break;
    case 2:
      str = "外地城镇";
      break;
    case 3:
      str = "本地农村";
      break;
    case 4:
      str = "本地城镇";
      break;
    case 5:
      str = "港澳台";
      break;
    case 6:
      str = "外籍";
      break;
  }
  return str;
}


