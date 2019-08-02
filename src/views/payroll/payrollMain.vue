<template>
  <div class="wrap payrollMain">
    <payroll-list v-if="payrollKey == 'payrollList'"></payroll-list>
    <deduction-list v-if="payrollKey == 'deduction'"></deduction-list>
    <allowance-list v-if="payrollKey == 'allowance'"></allowance-list>
    <salary-item-list v-if="payrollKey == 'salaryItem'"></salary-item-list>
    <insured v-if="payrollKey == 'insured'"></insured>
    <MPFinfo v-if="payrollKey == 'MPFinfo'"></MPFinfo>
  </div>
</template>
<script>
import payrollList from './payrolllist/payrolllist.vue';
import deductionList from './deduction/deductionList.vue';
import allowanceList from './allowance/allowanceList.vue';
import salaryItemList from './salaryItem/salaryItemList.vue';
import insured from './insured/insured.vue';
import MPFinfo from './MPF/MPFinfo.vue';
export default {
  name: "payrollMain",
  inject: ["reload"],
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {},
  computed: {
    payrollKey(){
      return this.$store.state.payrollModule.payrollKey;
    }
  },
  components: {
    payrollList,deductionList,allowanceList,salaryItemList,insured,MPFinfo
  }
};
</script>
<style scoped lang="scss">
</style>






