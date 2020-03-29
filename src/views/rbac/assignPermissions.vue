<template>
  <div class="assignPermissions">
    <el-tree 
      :data="data" 
      show-checkbox 
      node-key="code" 
      ref="tree" 
      default-expand-all
      :props="defaultProps"
    ></el-tree>
    <div class="btn-ground">
      <el-button type="primary" @click="addAccess">确 认</el-button>
      <el-button @click="cancelFn">取 消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "assignPermissions",
  inject: ["reload"],
  props: ["curInfo"],
  data() {
    return {
      data: [],
      defaultProps: {
        children: "nodes",
        label: "name"
      }
    };
  },
  mounted() {
    this.getAccessList();
    this.getCurrentAccess();
  },
  methods: {
    //获取当前角色所在项目下所有权限
    getAccessList() {
      var _this = this;
      var reqUrl = "/server/api/v1/projectAccess/accessbyProjectCode";
      var data = {
        projectCode: _this.curInfo.projectCode,
        typeId: _this.curInfo.typeId
      };
      
      _this.$myApi.http
        .post(reqUrl, data)
        .then(res => {
          console.log(res);
          _this.data = res.data.data.map(item => {
            // item.disabled = true;
            return item;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取用户当前的权限
    getCurrentAccess() {
      var _this = this;
      var reqUrl = "/server/api/v1/projectRole/getDetailByCode";
      var data = { code: _this.curInfo.code };
      _this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.data.accessList != 0) {
          var arr = res.data.data.accessList.map(item => {
            return item.accessCode;
          });
          _this.$refs.tree.setCheckedKeys(arr);
        }
      });
    },
    // 分配权限
    addAccess() {
      var _this = this;
      var reqUrl = "/server/api/v1/projectRole/updateProjectRoleAccessRelation";
      var codeArr = _this.$refs.tree.getCheckedKeys();
      var data = {
        roleCode: _this.curInfo.code,
        params: []
      };
      for (var i = 0; i < codeArr.length; i++) {
        data.params.push({
          projectCode: "8ea5fcd0-5aa4-11e9-9b7e-bb5ad1145dea",
          accessCode: codeArr[i]
        });
      }
      _this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.code == 0) {
          _this.$message("操作成功~");
          _this.reload();
        }
      });
    },
    // 取消
    cancelFn() {
      var _this = this;
      _this.$emit("listenIsShowMask", false);
    }
  }
};
</script>
<style scoped lang="scss">
.btn-ground {
  padding: 20px 30px;
}
</style>


