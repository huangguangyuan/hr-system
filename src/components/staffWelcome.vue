<template>
  <div class="wrap welcome">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="upPart" style="">
            <p><span>0</span>人</p>
            <div class="icons" style="background-image: url(data:image/png;base64,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);background-size: cover;"></div>
          </div>
          <div class="downPart" style="background-image: linear-gradient(-90deg,#81d4ff,#4cb5f2);">
            员工人数
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="upPart" style="">
            <p><span>0</span>人</p>
            <div class="icons" style="background-image: url(data:image/png;base64,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);background-size: cover;"></div>
          </div>
          <div class="downPart" style="background-image: linear-gradient(-90deg,#87f4e2,#42d2b9);">
            待审批
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="upPart" style="">
            <p><span>0</span>人</p>
            <div class="icons" style="background-image: url(data:image/png;base64,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);background-size: cover;"></div>
          </div>
          <div class="downPart" style="background-image: linear-gradient(-90deg,#e2e1e5 4%,#cdbed1 96%);">
            待确认
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="upPart" style="">
            <p><span>0</span>人</p>
            <div class="icons" style="background-image: url(data:image/png;base64,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);background-size: cover;"></div>
          </div>
          <div class="downPart" style="background-image: linear-gradient(-90deg,#f3dfb3,#ddb146);">
            待生成
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-calendar v-model="value"></el-calendar>
      </el-col>
      <el-col :span="12">
        <div class="fastEntry"> 
          <h5>快捷入口</h5>
          <ul>
            <li>
              <div>
                <i class="el-icon-s-custom"></i>
              </div>
              <p>员工列表</p>
            </li>
            <li>
              <div>
                <i class="el-icon-s-custom"></i>
              </div>
              <p>应税项目</p>
            </li>
            <li>
              <div>
                <i class="el-icon-s-custom"></i>
              </div>
              <p>审批申请</p>
            </li>
            <li>
              <div>
                <i class="el-icon-s-custom"></i>
              </div>
              <p>生成工资单</p>
            </li>
            <li>
              <div>
                <i class="el-icon-s-custom"></i>
              </div>
              <p>确认工资单</p>
            </li>
            <li>
              <div>
                <i class="el-icon-s-custom"></i>
              </div>
              <p>确认出粮信息</p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "welcome",
  inject: ["reload"],
  data() {
    return {
      value: new Date()
    };
  },
  methods:{
  }
};
</script>
<style scoped lang="scss">
.welcome {
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple {
    background: #f3f3f9;
  }
  .grid-content {
    border-radius: 4px;
    height: 130px;overflow: hidden;
    .upPart{
      height: 100px;display: flex;box-sizing: border-box;padding: 0 40px;justify-content: space-between;align-items: center;
      p{color: #999;font-size: 16px;};
      span{font-size: 36px;color: #000000;}
      .icons{width: 50px;height: 50px;}
    }
    .downPart{
      height: 30px;
      box-sizing: border-box;padding: 0 20px;
      display: flex;justify-content: flex-end;align-items: center;font-size: 15px;
      color: #ffffff;
    }
  }
  .fastEntry{
    background-color: #f3f3f9;border-radius: 4px;box-sizing: border-box;padding: 30px 30px;
    h5{font-weight: 500;font-size: 16px;}
    ul{
      display: flex;flex-wrap: wrap;
      li{
        width: 33.3%;box-sizing: border-box;display: flex;justify-content: center;align-items: center;flex-direction: column;margin-top: 40px;
        div{width: 80px;height: 80px;background-color: #ffffff;border-radius: 100%;display: flex;justify-content: center;align-items: center;color: #cccccc;font-size: 36px;}
        p{margin-top: 20px;}
      }
    }
  }
  .calendar{
    background-color: #f3f3f9;border-radius: 4px;box-sizing: border-box;padding: 30px 30px;
    height: 300px;
  }
}
</style>






