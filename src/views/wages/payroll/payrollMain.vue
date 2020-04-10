
<template>
  <div class="wrap payrollMain" v-if="isShow">
    <staff-payroll-list v-if='payrollMainKey == "staffPayrollList"'></staff-payroll-list>
    <payroll-times v-if='payrollMainKey == "payrollTimes"'></payroll-times>
  </div>
</template>
<script>
import staffPayrollList from './staffPayrollList.vue';
import payrollTimes from './payrollTimes.vue';
export default {
  components: {
    staffPayrollList,payrollTimes
  },
  name: "payrollMain",
  inject: ["reload"],
  data() {
    return {
      isShow:false
    };
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
    if (this.userInfo.access.payrollMain.length > 0){
      this.isShow = true;
    }
  },
  methods: {},
  computed: {
    payrollMainKey(){
      return this.$store.state.payrollModule.payrollMainKey;
    }
  }
};
</script>
<style scoped lang="scss">
</style>






