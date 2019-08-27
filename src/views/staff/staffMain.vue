<template>
  <div class="wrap staffMain">
    <staff-information v-if='!isShowDetails && userInfo.roleTypeId != 1' :userRight_props="userRight"></staff-information>
    <staff-details v-if='isShowDetails && userInfo.roleTypeId !=1'  :userRight_props="userRight"></staff-details>
    <warning v-if="userInfo.roleTypeId == 1"></warning>
  </div>
</template>
<script>
import staffInformation from "./information/staffInformation.vue";
import staffDetails from "./details/staffDetails.vue";
import warning from "./warning/warning.vue";
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
      if (this.userInfo.roleTypeId == 3 ){
        this.userRight = true;
      }
      return this.$store.state.staffModule.isShowDetails;
    }
  },
  components: {
    staffInformation,
    staffDetails,
    warning
  }
};
</script>
<style scoped lang="scss">
</style>






