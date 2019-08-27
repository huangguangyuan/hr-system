<template>
  <div class="wrap wagesMain">
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
    };
  },
  mounted() {},
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






