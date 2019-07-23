<template>
  <div class="wrap payrollMain">
    <payroll-list v-if="payrollKey == 'payrollList'"></payroll-list>
    <deduction-list v-if="payrollKey == 'deduction'"></deduction-list>
    <allowance-list v-if="payrollKey == 'allowance'"></allowance-list>
  </div>
</template>
<script>
import payrollList from './payrolllist/payrolllist.vue';
import deductionList from './deduction/deductionList.vue';
import allowanceList from './allowance/allowanceList.vue';
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
    payrollList,deductionList,allowanceList
  }
};
</script>
<style scoped lang="scss">
</style>






