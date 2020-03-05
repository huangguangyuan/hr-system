<template>
  <div class="wrap wagesMain" v-if="isShow">
    <wages-staff-list v-if='wagesKey == "wagesStaffList"'></wages-staff-list>
    <staff-wages-config v-if='wagesKey == "staffWagesConfig"'></staff-wages-config>
    <salary-date v-if='wagesKey == "salaryDate"'></salary-date>
  </div>
</template>
<script>
import wagesStaffList from './wagesStaffList.vue';
import staffWagesConfig from './staffWagesConfig/staffWagesConfig.vue';
import salaryDate from './salaryDate.vue';
export default {
  name: "wagesMain",
  inject: ["reload"],
  data() {
    return {
      isShow:false
    };
  },
  mounted() {
    this.userInfo = this.$toolFn.localGet("userInfo");
    if (this.userInfo.access.payrollMain.length > 0){
      this.isShow = true;
    }
  },
  methods: {},
  computed: {
    wagesKey(){
      return this.$store.state.wagesModule.wagesKey;
    }
  },
  components: {
    wagesStaffList,staffWagesConfig,salaryDate
  }
};
</script>
<style scoped lang="scss">
</style>






