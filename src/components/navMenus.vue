<template>
    <div>
        <template v-for="item in navMenus">
            <el-menu-item 
                v-if="item.isMenu === 1" 
                :key='item.id'
                :data="item" 
                :index="item.authUrl"
                :route="item.authUrl"
                @click='getRoute(item)'
            >
                <i :class='item.iconUrl'></i>
                <span>{{item.name}}</span>
            </el-menu-item>

            <el-submenu 
                v-if="item.items!=null && item.isMenu === 0" 
                :key="item.id"
                :data="item" 
                :index='item.id'
            >
                <template slot="title">
                    <i :class='item.iconUrl'></i>
                    <!-- <span class="text-color">{{item.name}}</span> -->
                    <template v-if="!collapsed"><span slot="title">{{item.name}}</span></template>
                </template>
                <nav-menus :navMenus='item.items'></nav-menus>
            </el-submenu>
        </template>
    </div>
</template>
<script>

export default {
    name:'navMenus',
    props:['navMenus','collapsed'],
    data(){
        return{
            newTabName:''
        }
    },
    methods:{
        getRoute(res){
            
            var val = {
                title: res.name,
                name: res.authUrl
            }
            if(this.navTabs.length == 0){
                this.$store.commit({
                    type:'changeNavTabs',
                    navTabs:val,
                    component:''
                });
            }else{
                // 这里判断tab标签是否已经有存在的路径
                var isOk = this.navTabs.every((item)=>{
                    return item.name != res.authUrl;
                });
                if(isOk){
                    this.$store.commit({
                        type:'changeNavTabs',
                        navTabs:val
                    });
                }
            }
            this.$store.commit({
                type:'changeTabsVal',
                TabsValue:res.authUrl
            });
        }
    },
    computed:{
        navTabs(){
            return this.$store.state.navModule.navTabs;
        }
    }
}
</script>
<style>

</style>


