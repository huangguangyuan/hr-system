<template>
  <div class="addRole">
    <el-tree :data="data" show-checkbox node-key="code" ref="tree" default-expand-all :props="defaultProps"></el-tree>
    <div class="btn-ground">
      <el-button type="primary" @click="addRolr">确 认</el-button>
      <el-button @click="cancelFn">取 消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "addRole",
  inject: ["reload"],
  props: ["modifyInfo"],
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
    this.getRoleList();
    this.getCurrentRole();
  },
  methods: {
    //获取后台管理员角色列表
    getRoleList() {
      var reqUrl = "/server/api/v1/projectRole/projectRolesWithAll";
      if(this.modifyInfo.adminType == "admin"){
        var data = { typeId: 1 };
      }else{
        var data = { typeId: 2 };
      }
      this.$myApi.http.post(reqUrl, data).then(res => {
          this.data = res.data.data;
        })
    },
    // 获取用户当前的角色
    getCurrentRole() {
      var reqUrl = "";
      if(this.modifyInfo.adminType == "admin"){
        reqUrl = '/server/api/v1/admin/getByCode';
      }else{
        reqUrl = '/server/api/v1/admin/hrSys/getByCode';
      }
      var data = { code: this.modifyInfo.code };
      this.$myApi.http.post(reqUrl, data).then(res => {
        if (res.data.data.roles != 0) {
          var arr = res.data.data.roles.map(item => {
            return item.code;
          });
          this.$refs.tree.setCheckedKeys(arr);
        }
      });
    },
    // 添加角色
    addRolr() {
      var reqUrl = "/server/api/v1/admin/updateAdminRoleRelation";
      var roleCodeArr = this.$refs.tree.getCheckedKeys();
      var data = {
        adminCode: this.modifyInfo.code,
        params: []
      };
      for (var i = 0; i < roleCodeArr.length; i++) {
        data.params.push({
          projectCode: "8ea5fcd0-5aa4-11e9-9b7e-bb5ad1145dea",
          roleCode: roleCodeArr[i]
        });
      }
      this.$myApi.http.post(reqUrl, data).then(res => {
        if(res.data.code == 0){
          this.$message('操作成功');
          this.reload();
        }
      });
    },
    // 取消
    cancelFn() {
      this.$emit("listenIsShowAddAdmin", false);
    }
  }
};
</script>
<style scoped lang="scss">
.btn-ground {
  padding: 20px 30px;
}
</style>


