<template>
  <div class="wrap payrollMain" v-if="isShow">
    <payroll-list v-if="payrollKey == 'payrollList'" :userRight_props="userRight"></payroll-list>
    <deduction-list v-if="payrollKey == 'deduction'" :userRight_props="userRight"></deduction-list>
    <!-- <allowance-list v-if="payrollKey == 'allowance'"></allowance-list> -->
    <salary-item-list v-if="payrollKey == 'salaryItem'" :userRight_props="userRight"></salary-item-list>
    <salary-item-list2 v-if="payrollKey == 'salaryItem2'" :userRight_props="userRight"></salary-item-list2>
    <insured v-if="payrollKey == 'insured'" :userRight_props="userRight"></insured>
    <MPFinfo v-if="payrollKey == 'MPFinfo'" :userRight_props="userRight"></MPFinfo>
  </div>
</template>
<script>
import payrollList from './payrolllist/payrolllist.vue';
import deductionList from './deduction/deductionList.vue';
// import allowanceList from './allowance/allowanceList.vue';
import salaryItemList from './salaryItem/salaryItemList.vue';
import salaryItemList2 from './salaryItem/salaryItemList2.vue';
import insured from './insured/insured.vue';
import MPFinfo from './MPF/MPFinfo.vue';
export default {
  components: {
    payrollList,deductionList,salaryItemList,salaryItemList2,insured,MPFinfo
  },
  name: "payrollMain",
  inject: ["reload"],
  data() {
    return {
      isShow:false,
      userRight:[]
    };
  },
  mounted() {
    this.userInfo = this.$toolFn.curUser;
      if (this.userInfo.roleTypeId == 2){
        if (this.userInfo.access.payrollMain.length > 0){
          this.isShow = true;
        }
        this.userRight  = this.userInfo.access.payrollMain;
      }else if (this.userInfo.roleTypeId == 3 ){
        this.userRight = true;
        this.isShow = true;
      }
  },
  methods: {},
  computed: {
    payrollKey(){
      return this.$store.state.payrollModule.payrollKey;
    }
  }
};
</script>
<style scoped lang="scss">
</style>






