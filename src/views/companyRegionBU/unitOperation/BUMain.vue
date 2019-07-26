<template>
  <div class="wrap BUMain">
    <regionBUList v-if='!isShowSetting'></regionBUList>
    <setting v-else></setting>
  </div>
</template>
<script>
import regionBUList from './regionBUList.vue'
import setting from './setting.vue'
export default {
  name: "BUMain",
  inject: ["reload"],
  data() {
    return {
      isShow:true,
      curInfo:{}
    };
  },
  mounted() {},
  methods: {},
  computed: {
    isShowSetting(){
      return this.$store.state.BUModule.isShowSetting;
    }
  },
  components: {
    regionBUList,setting
  }
};
</script>
<style scoped lang="scss">
</style>






