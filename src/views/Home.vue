<template>
  <div class="home">
    <el-container>
      <!-- 顶部 -->
      <el-header>
        <div class="left">
          <img src="@/assets/images/logo.png" alt>
          <p>后台管理系统</p>
        </div>
        <div class="right">
          <el-badge is-dot class="item">
            <i class="el-icon-bell"></i>
          </el-badge>
          <img src="@/assets/images/face_ico.jpg" alt>
          <el-dropdown>
            <span class="el-dropdown-link">
              1234567890
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>关于作者</el-dropdown-item>
              <el-dropdown-item>用户信息</el-dropdown-item>
              <el-dropdown-item>修改信息</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <!-- 左侧导航 -->
        <el-aside width="220px">
          <el-scrollbar style="height:100%">
            <el-menu
              :default-active="$route.path"
              router
              class="el-menu-vertical-demo"
              background-color="#363b4e"
              text-color="#fff"
              active-text-color="#ed8937"
              unique-opened
            >
              <nav-menus :navMenus="sidebarInfo"></nav-menus>
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
            <img src="@/assets/images/logo.png" alt="">
            版权所有 (C) 2019 GRAMMY TECH。保留所有权利。
            
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import sidebarInfo from "@/lib/sidebarInfo.js";
import navMenus from "@/components/navMenus.vue";
export default {
  name: "home",
  data() {
    return {
      sidebarInfo
    };
  },
  mounted() {
    var _this = this;
    _this.initializeTab();
  },
  methods: {
    // 选中当前tab标签
    tabSelection(tab) {
      var _this = this;
      _this.$router.push({ path: tab.name });
    },
    // 删除当前tab标签
    removeTab(targetName) {
      var _this = this;
      var activeName = _this.TabsValue;
      var tabs = _this.navTabs;
      // 判断如果tab标签的数量是最后一个则不执行
      if (_this.navTabs.length == 1) {
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
      _this.$store.commit({
        type: "changeTabsVal",
        TabsValue: activeName
      });
      // 更新tab标签数组列表
      _this.$store.commit({
        type: "getNavTabs",
        navTabs: tabs.filter(tab => {
          return tab.name !== targetName;
        })
      });

      // home页面的router路径
      _this.$router.push({ path: activeName });
    },
    // 关闭标签
    handleCommand(command) {
      var _this = this;
      var tabs = _this.navTabs;
      var activeName = _this.TabsValue;
      // 关闭其他tab标签
      if (command == "closeOther") {
        _this.$store.commit({
          type: "getNavTabs",
          navTabs: tabs.filter(tab => {
            return tab.name == activeName;
          })
        });
      } else {
        _this.$store.commit({
          type: "getNavTabs",
          navTabs: []
        });
      }
    },
    // 初始化默认第一个tab标签
    initializeTab() {
      var _this = this;
      var firstTitle = _this.$route.path;
      var isExist = _this.navTabs.some(item => {
        return item.name = _this.$route.path
      });
      // 判断tab标签是否已经存在
      if(isExist){return false;}
      for (let i = 0; i < sidebarInfo.length; i++) {
        for (var j = 0; j < sidebarInfo[i].items.length; j++) {
          if (sidebarInfo[i].items[j].authUrl == _this.$route.path) {
            firstTitle = sidebarInfo[i].items[j].name;
          }
        }
      }
      _this.$store.commit({
        type: "changeNavTabs",
        navTabs: {
          title: firstTitle,
          name: _this.$route.path
        }
      });
      // 更新tab标签的name值
      _this.$store.commit({
        type: "changeTabsVal",
        TabsValue: _this.$route.path
      });
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
        var _this = this;
        _this.$store.commit({
          type: "changeTabsVal",
          TabsValue: v
        });
      }
    }
  },
  components: {
    navMenus
  }
};
</script>
<style scoped lang="scss">
</style>




