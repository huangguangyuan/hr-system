//获取月总电度
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

export function monthList(){
  return [{val:1,txt:'1月'},{val:2,txt:'2月'},{val:3,txt:'3月'},{val:4,txt:'4月'},{val:5,txt:'5月'},{val:6,txt:'6月'},{val:7,txt:'7月'},{val:8,txt:'8月'},{val:9,txt:'9月'},
  {val:10,txt:'10月'},{val:11,txt:'11月'},{val:12,txt:'12月'}]
}





