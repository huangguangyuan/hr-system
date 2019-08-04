<template>
  <div class="wrap staffMain">
    <staff-information v-if='!isShowDetails' :userRight_props="userRight"></staff-information>
    <staff-details v-else  :userRight_props="userRight"></staff-details>
  </div>
</template>
<script>
import staffInformation from "./information/staffInformation.vue";
import staffDetails from "./details/staffDetails.vue";
export default {
  name: "staffMain",
  inject: ["reload"],
  data() {
    return {
      isShow:true,
      curInfo:{},
      userInfo:{},
      userRight:false
    };
  },
  mounted() {
  },
  methods: {},
  computed: {
    isShowDetails(){
      this.userInfo = this.$toolFn.localGet("userInfo");
      if (this.userInfo.roleTypeId == 2 && [301,601,611].indexOf(this.userInfo.lev) >= 0 ){
        this.userRight = true;
      }
      return this.$store.state.staffModule.isShowDetails;
    }
  },
  components: {
    staffInformation,
    staffDetails
  }
};
</script>
<style scoped lang="scss">
</style>






