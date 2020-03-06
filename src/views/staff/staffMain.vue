<template>
  <div class="wrap staffMain" v-if="isShow">
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
      isShow:false,
      curInfo:{},
      userInfo:{},
      userRight:false
    };
  },
  mounted() {
    this.userInfo = this.$toolFn.localGet("userInfo");
      if (this.userInfo.roleTypeId == 2){
        if (this.userInfo.access.staffMain.length > 0){
          this.isShow = true;
        }
        if (this.userInfo.access.staffMain.indexOf(2) >= 0 || this.userInfo.access.staffMain.indexOf(3) >= 0 || this.userInfo.access.staffMain.indexOf(4) >= 0){
          this.userRight = true;
        }
      }else if (this.userInfo.roleTypeId == 3 ){
        this.userRight = true;
        this.isShow = true;
      }
  },
  methods: {},
  computed: {
    isShowDetails(){
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






