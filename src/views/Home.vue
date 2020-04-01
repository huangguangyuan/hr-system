<template>
  <div class="home">
    <el-container>
      <!-- 顶部 -->
      <el-header>
        <div class="left">
          <div class="collapse-btn" @click="collapseFun">
            <i class="el-icon-menu"></i>
          </div>
          <p>后台管理系统</p>
        </div>
        <div class="right">
          <el-badge is-dot class="item" >
            <i class="el-icon-bell" @click="goLink('/newsList')"></i>
          </el-badge>
          <img src="@/assets/images/face_ico.jpg" alt>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{userInfo.account}}（{{userInfo.roleTypeTxt||userInfo.typeTxt}}）
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout(userInfo.roleTypeId)">退出登录</el-dropdown-item>
              <el-dropdown-item v-if="userInfo.roleTypeId == 1" @click.native="isShowPasswrdBox = true">修改密码</el-dropdown-item>
              <el-dropdown-item v-if="userInfo.relatedUser" divided disabled>切换账户</el-dropdown-item>
              <el-dropdown-item v-if="userInfo.relatedUser" @click.native="switchUser(userInfo.relatedUser)"><i style="font-size:18px;" class="el-icon-refresh"></i>{{userInfo.relatedUser.typeTxt}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <!-- 左侧导航 -->
        <el-aside :width="collapseSize">
          <el-scrollbar style="height:100%">
            <el-menu
              :default-active="$route.path"
              router
              class="el-menu-vertical-demo"
              background-color="#363b4e"
              text-color="#fff"
              active-text-color="#ed8937"
              unique-opened
              :collapse="isCollapse"
            >
              <nav-menus :navMenus="sidebarInfo" :collapsed="isCollapse"></nav-menus>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <!-- 右侧内容 -->
        <el-container>
          <!-- 中部内容 -->
          <el-main>
            <!-- 标签页 -->
            <div class="tabs-wrap">
              <el-tabs
                v-model="TabsValue"
                type="card"
                closable
                @tab-click="tabSelection"
                @tab-remove="removeTab"
              >
                <el-tab-pane
                  v-for="(item) in navTabs"
                  :key="item.name"
                  :label="item.title"
                  :name="item.name"
                ></el-tab-pane>
              </el-tabs>
              <el-dropdown @command="handleCommand">
                <el-button>
                  标签选项
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="margin-top:-20px;">
                  <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
                  <!-- <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <!-- router路由内容 -->
            <el-scrollbar style="height:calc(100% - 66px);">
              <router-view></router-view>
            </el-scrollbar>
          </el-main>
          <!-- 底部 -->
          <el-footer>
            版权所有 (C) 2019 GRAMMY TECH。保留所有权利。
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <!-- 申请表单详情 -->
    <el-dialog title="修改密码" :visible.sync="isShowPasswrdBox" :close-on-click-modal="false" label-width="140px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >
        <el-form-item label="输入密码：" prop="password">
          <el-input v-model="ruleForm.password" show-password  ></el-input>
        </el-form-item>
        <el-form-item label="重复密码：" prop="passwordRepeat" >
          <el-input v-model="ruleForm.passwordRepeat" show-password ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="isShowPasswrdBox = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import sidebarInfo from "@/lib/sidebarInfo.js";
import navMenus from "@/components/navMenus.vue";
import md5 from "js-md5";
export default {
  name: "home",
  inject: ["reload"],
  data() {
    return {
      sidebarInfo: [], //左侧导航栏数据
      isCollapse: false, //左侧导航栏是否折叠
      collapseSize: "220px", //左侧导航栏宽度大小
      isShowPasswrdBox:false,//是否显示表单详情
      ruleForm: {
        password: "",
        passwordRepeat: ""
      },
      userInfo:{},
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        passwordRepeat: [
          { required: true, message: "请输入重复密码", trigger: "blur" }
        ]
      },
    };
  },
  mounted() {
    this.userInfo = this.$toolFn.localGet('userInfo');
    console.log(this.userInfo);
    this.initializeFun();
  },
  methods: {
    goLink(path){
      this.$router.replace({ path: path});
    },
    switchUser(switchUser){
      var reqUrl = "/server/api/v1/hrSys/loginRelated";
      var postJson = {
          account: switchUser.account,
        	typeId:switchUser.typeId
      }
      this.$myApi.http.post(reqUrl,postJson).then(res => {
        if (res.data.code == 0){
          sessionStorage.clear();
          localStorage.clear();
          this.$store.commit({
            type: "getNavTabs",
            navTabs: []
          });
          this.$toolFn.localSet("userInfo", res.data.data.data);
          var sidebar = res.data.data.data.roles[0].menuList.map(item => {
            item.id = item.id.toString();
            return item;
          });
          this.$store.dispatch("add_Routes", sidebar).then(res => {
              return this.$store.dispatch('getAccessData_Fun',sidebar)
            }).then(res => {
              var userInfo = this.$toolFn.localGet("userInfo");
              this.userInfo = userInfo;
              this.reload();
              if (userInfo.roleTypeId == 1){
                this.$router.push({ path: "/applyMain" });
              }else{
                this.$router.push({ path: "/home" });
              }
            })
        }
      });
    },
    
    submitForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          
          var reqUrl = '/server/api/v1/staff/account/update';
          var data = {
            staffCode:this.userInfo.userCode
          }
          if (this.ruleForm.password != this.ruleForm.passwordRepeat){
            this.$message.error("两次秘密不一致！");
          }else{
            data.password = md5(this.ruleForm.password);
          }
          this.$myApi.http.post(reqUrl,data).then(res => {
            if(res.data.code == 0){
              this.isShowPasswrdBox = false;
              this.$message.success('修改成功！');
            }else{
              this.$message.error(res.data.msg);
            }
          })
        } else {
          return false;
        }
      });
    },
    logout(roleTypeId){
      var reqUrl = "/server/api/v1/admin/logout";
      var returnUrl = "/";
      if (roleTypeId == 1 || roleTypeId == 2){
        reqUrl = "/server/api/v1/hrSys/logout";
        returnUrl = "/hr";
      }
      this.$myApi.http.post(reqUrl).then(res => {
        if (res.data.code == 0){
          this.$toolFn.localRemove('userInfo');
          this.$router.replace({
              path: returnUrl // 到登录页重新获取token
            })
        }
      }).catch(error => {
        sessionStorage.clear();
        localStorage.clear();
        this.$router.replace({
              path: '/' // 到登录页重新获取token
            })
      })
    },
    // 初始化
    initializeFun() {
      this.initializeTab();
      this.sidebarInfo = this.getSidebar;
    },
    // 选中当前tab标签
    tabSelection(tab) {
      
      this.$router.push({ path: tab.name });
    },
    // 删除当前tab标签
    removeTab(targetName) {
      
      var activeName = this.TabsValue;
      var tabs = this.navTabs;
      // 判断如果tab标签的数量是最后一个则不执行
      if (this.navTabs.length == 1) {
        return false;
      }
      if (targetName === activeName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            var nextTab = tabs[index + 1] || tabs[index - 1];

            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      // 更新tab标签的name值
      this.$store.commit({
        type: "changeTabsVal",
        TabsValue: activeName
      });
      // 更新tab标签数组列表
      this.$store.commit({
        type: "getNavTabs",
        navTabs: tabs.filter(tab => {
          return tab.name !== targetName;
        })
      });

      // home页面的router路径
      this.$router.push({ path: activeName });
    },
    // 关闭标签
    handleCommand(command) {
      
      var tabs = this.navTabs;
      var activeName = this.TabsValue;
      // 关闭其他tab标签
      if (command == "closeOther") {
        this.$store.commit({
          type: "getNavTabs",
          navTabs: tabs.filter(tab => {
            return tab.name == activeName;
          })
        });
      } else {
        this.$store.commit({
          type: "getNavTabs",
          navTabs: []
        });
      }
    },
    // 初始化默认第一个tab标签
    initializeTab() {
      
      var firstTitle = this.$route.path;
      if (this.navTabs.length != 0) {
        return false;
      }
      var isExist = this.navTabs.some(item => {
        return (item.name = this.$route.path);
      });
      // 判断tab标签是否已经存在
      if (isExist) {
        return false;
      }
      for (let i = 0; i < sidebarInfo.length; i++) {
        for (var j = 0; j < sidebarInfo[i].items.length; j++) {
          if (sidebarInfo[i].items[j].authUrl == this.$route.path) {
            firstTitle = sidebarInfo[i].items[j].name;
          }
        }
      }
      this.$store.commit({
        type: "changeNavTabs",
        navTabs: {
          title: firstTitle,
          name: this.$route.path
        }
      });
      // 更新tab标签的name值
      this.$store.commit({
        type: "changeTabsVal",
        TabsValue: this.$route.path
      });
    },
    // 侧边栏折叠
    collapseFun() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.collapseSize = "60px";
        document.getElementsByClassName("wrap")[0].style.width='calc(100vw - 60px)'
      } else {
        this.collapseSize = "220px";
        document.getElementsByClassName("wrap")[0].style.width='calc(100vw - 220px)'
      }
    }
  },
  computed: {
    navTabs() {
      return this.$store.state.navModule.navTabs;
    },
    TabsValue: {
      get: function() {
        return this.$store.state.navModule.TabsValue;
      },
      set: function(v) {
        
        this.$store.commit({
          type: "changeTabsVal",
          TabsValue: v
        });
      }
    },
    // 获取左侧导航条
    getSidebar() {
      return this.$store.state.accessModule.accessList;
    },
    hasScrollbar() {
      var isOK
      var obj = document.getElementsByClassName("el-scrollbar__wrap")[1];
      if (obj.scrollHeight > obj.clientHeight || obj.offsetHeight > obj.clientHeight) {
        isOK = true;
      }else{
        isOK = false;
      }
      return isOK;
    }
  },
  components: {
    navMenus
  }
};
</script>
<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;

}
  .el-icon-bell{
    cursor: pointer;
  }
</style>




