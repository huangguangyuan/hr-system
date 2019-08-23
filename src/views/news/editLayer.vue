<template>
  <div class="editLayer">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-form-item label="消息类型：" prop="typeId">
        <el-select v-model="ruleForm.typeId" placeholder="请选择消息类型">
          <el-option label="公开信息" value="1"></el-option>
          <el-option label="指定信息" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息标题：" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="消息内容：" prop="content">
        <el-input type="textarea" v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item label="所属公司/地区/单位" prop="codeList" v-if='ruleForm.typeId == "2"'>
        <el-cascader v-model="ruleForm.codeList" :props="props"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import axios from "axios";
export default {
  name: "editLayer",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    const _that = this;
    return {
      ruleForm: {
        typeId: "",
        title:"",
        content:"",
        codeList:['6e8d76d0-9622-11e9-ae47-8542e8e74f2b','23e5c850-965c-11e9-a26b-0b0c646075f1','bf8a39b1-965e-11e9-a26b-0b0c646075f1'],
      }, //表单信息
      rules: {
        typeId: [{ required: true, message: "请选择消息类型", trigger: "change" }],
        title: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入消息内容", trigger: "blur" }],
      },
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          var nodes;
          if (node.level == 0) {
            axios.post("/server/api/v1/company/companys", {}).then(res => {
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
            axios.post("/server/api/v1/company/company", { id: node.data.id })
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
            axios.post("/server/api/v1/company/region", { id: node.data.id })
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
        children: "children",
        checkStrictly:true
      }
    };
  },
  mounted() {
    this.initializeFun();
  },
  methods: {
    // 初始化
    initializeFun() {
      if (this.curInfo.type == "modify") {
        this.ruleForm.typeId = this.curInfo.typeId.toString();
        this.ruleForm.title = this.curInfo.title.toString();
        this.ruleForm.content = this.curInfo.content;
      }
    },
    // 提交表单
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增
    addFun() {
      var reqUrl = "/server/api/v1/info/buInfoAdd";
      var data = {
        typeId:parseInt(this.ruleForm.typeId),
        title:this.ruleForm.title,
        content:this.ruleForm.content,
        companyCode:this.ruleForm.codeList[0] || '',
        regionCode:this.ruleForm.codeList[1] || '',
        BUCode:this.ruleForm.codeList[2] || ''
      };
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("新增成功~");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    modifyFun() {
      var reqUrl = "/server/api/v1/info/buInfoUpdate";
      var data = {
        id:this.curInfo.id,
        typeId:parseInt(this.ruleForm.typeId),
        title:this.ruleForm.title,
        content:this.ruleForm.content,
        companyCode:this.ruleForm.codeList[0] || '',
        regionCode:this.ruleForm.codeList[1] || '',
        BUCode:this.ruleForm.codeList[2] || ''
      };
      console.log(data);
      this.$http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          this.reload();
          this.$message.success("修改成功~");
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style lang="scss">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
.el-cascader-menu__list {
  padding-right: 10px;
}
</style>


